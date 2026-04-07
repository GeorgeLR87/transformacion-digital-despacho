/**
 * @file lib/telegram/handler.ts
 * @description Orquestador principal del flujo Telegram -> Claude -> factura.com -> Supabase.
 *
 * Flujo con borradores (Ordenes 44-47):
 * 1. Claude interpreta instruccion NL -> JSON CFDI
 * 2. Lookup receptor + empresa + serie en Supabase
 * 3. Crea BORRADOR en factura.com (Draft=1, no timbra, no consume folio fiscal)
 * 4. Descarga PDF del borrador y lo envia por Telegram con botones Confirmar/Cancelar
 * 5. Al confirmar -> timbra el borrador con /timbrarborrador
 * 6. Guarda archivos con saveCfdiFiles y registra en Supabase
 * 7. Al cancelar -> elimina el borrador
 *
 * Persistencia: el UID del borrador en factura.com es el estado.
 * No se usa Map en memoria -> funciona en Vercel serverless.
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type {
  TelegramUpdate,
  TelegramMessage,
  TelegramCallbackQuery,
} from "./types";
import {
  sendMessage,
  answerCallbackQuery,
  editMessageText,
  sendDocumentWithConfirmation,
} from "./client";
import { interpretarInstruccion } from "@/lib/claude/client";
import {
  createFacturaComClient,
  saveCfdiFiles,
} from "@/lib/facturacom";
import { getFacturaComCredentials } from "@/lib/api/helpers";

// ---------------------------------------------------------------------------
// Supabase admin (service_role)
// ---------------------------------------------------------------------------

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Variables NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY requeridas");
  }
  return createClient<Database>(url, serviceKey);
}

// ---------------------------------------------------------------------------
// Entry point — procesar un update de Telegram
// ---------------------------------------------------------------------------

/**
 * Punto de entrada principal. Recibe un TelegramUpdate y lo procesa.
 * No lanza excepciones — los errores se envian como mensaje al chat.
 */
export async function handleTelegramUpdate(update: TelegramUpdate): Promise<void> {
  if (update.callback_query) {
    await handleCallbackQuery(update.callback_query);
    return;
  }

  if (update.message) {
    await handleMessage(update.message);
    return;
  }
}

// ---------------------------------------------------------------------------
// Manejar mensajes de texto
// ---------------------------------------------------------------------------

async function handleMessage(message: TelegramMessage): Promise<void> {
  const chatId = message.chat.id;
  const text = message.text?.trim();

  if (!text) {
    await sendMessage({
      chat_id: chatId,
      text: "Por ahora solo proceso instrucciones de texto. Envia tu instruccion de facturacion.",
    });
    return;
  }

  // Comandos especiales
  if (text === "/start") {
    await sendMessage({
      chat_id: chatId,
      text: "Hola, soy el bot de facturacion de ASC Auditores.\n\n"
        + "Enviame una instruccion como:\n"
        + "<i>\"Factura a CLIENTE X por consultoria $5,000, empresa Security Privada\"</i>\n\n"
        + "Comandos:\n"
        + "/ayuda — Ver esta ayuda",
    });
    return;
  }

  if (text === "/ayuda" || text === "/help") {
    await sendMessage({
      chat_id: chatId,
      text: "<b>Instrucciones de uso:</b>\n\n"
        + "1. Envia tu instruccion en lenguaje natural\n"
        + "2. Revisa el PDF borrador que te envio\n"
        + "3. Confirma o cancela con los botones\n\n"
        + "<b>Ejemplo:</b>\n"
        + "<i>\"Factura PUE a RFC XAXX010101000 por servicios de consultoria, 5000 pesos, transferencia, empresa Security Privada\"</i>\n\n"
        + "<b>Datos que puedes incluir:</b>\n"
        + "- RFC o nombre del receptor\n"
        + "- Descripcion del servicio\n"
        + "- Monto\n"
        + "- Metodo de pago (PUE/PPD)\n"
        + "- Forma de pago (transferencia, efectivo, tarjeta)\n"
        + "- Empresa emisora",
    });
    return;
  }

  // Procesar instruccion de facturacion
  await processFacturaInstruction(chatId, text);
}

// ---------------------------------------------------------------------------
// Procesar instruccion de facturacion con Claude -> crear borrador
// ---------------------------------------------------------------------------

async function processFacturaInstruction(chatId: number, text: string): Promise<void> {
  await sendMessage({ chat_id: chatId, text: "Procesando tu instruccion..." });

  const supabase = getSupabaseAdmin();

  // 1. Obtener lista de empresas emisoras para contexto de Claude
  const { data: empresas } = await supabase
    .from("billing_empresas_emisoras")
    .select("id, rfc, razon_social")
    .eq("activo", true);

  if (!empresas || empresas.length === 0) {
    await sendMessage({
      chat_id: chatId,
      text: "No hay empresas emisoras configuradas. Contacta al administrador.",
    });
    return;
  }

  const empresasNombres = empresas.map((e) => `${e.razon_social} (${e.rfc})`);

  // 2. Llamar a Claude para interpretar
  const interpretacion = await interpretarInstruccion(text, empresasNombres);

  if (!interpretacion.success || !interpretacion.data) {
    await sendMessage({
      chat_id: chatId,
      text: "No pude interpretar la instruccion: " + (interpretacion.error ?? "Error desconocido") + "\n\nIntenta de nuevo con mas detalle.",
    });
    return;
  }

  const instr = interpretacion.data;

  // 3. Resolver empresa emisora
  const empresa = resolveEmpresa(instr.empresa_emisora, empresas);
  if (!empresa) {
    const listaEmpresas = empresas.map((e) => "- " + e.razon_social + " (" + e.rfc + ")").join("\n");
    await sendMessage({
      chat_id: chatId,
      text: "No pude identificar la empresa emisora.\n\nEmpresas disponibles:\n" + listaEmpresas,
    });
    return;
  }

  // 4. Obtener credenciales de factura.com para la empresa
  const creds = await getFacturaComCredentials(empresa.id);
  if (!creds) {
    await sendMessage({
      chat_id: chatId,
      text: "La empresa " + empresa.razon_social + " no tiene credenciales de factura.com configuradas.",
    });
    return;
  }

  // 5. Resolver receptor
  const receptor = await resolveReceptor(supabase, instr.rfc_receptor, instr.nombre_receptor, empresa.id);
  if (!receptor) {
    await sendMessage({
      chat_id: chatId,
      text: "No encontre al receptor: " + (instr.rfc_receptor ?? instr.nombre_receptor ?? "(no especificado)") + ".\n\nVerifica el RFC o nombre e intenta de nuevo.",
    });
    return;
  }

  // 6. Resolver serie de facturacion
  const serie = await resolveSerie(supabase, empresa.id, "factura");
  if (!serie) {
    await sendMessage({
      chat_id: chatId,
      text: "No hay serie de facturacion activa para " + empresa.razon_social + ".",
    });
    return;
  }

  if (!receptor.uid_facturacom) {
    await sendMessage({
      chat_id: chatId,
      text: "El receptor " + receptor.razon_social + " (" + receptor.rfc + ") no tiene UID de factura.com. Sincroniza receptores primero.",
    });
    return;
  }

  // 7. Determinar UsoCFDI
  const usoCfdi = receptor.rfc === "XAXX010101000" ? "S01" : receptor.uso_cfdi;

  // 8. Construir payload del CFDI
  const tasaIva = 0.16;
  const base = instr.cantidad * instr.monto;
  const conceptosPayload = [
    {
      ClaveProdServ: "84111506",
      Cantidad: instr.cantidad,
      ClaveUnidad: "E48",
      Descripcion: instr.descripcion,
      ValorUnitario: instr.monto,
      ObjetoImp: "02",
      Impuestos: {
        Traslados: [
          {
            Base: parseFloat(base.toFixed(6)),
            Impuesto: "002",
            TipoFactor: "Tasa" as const,
            TasaOCuota: tasaIva.toFixed(6),
            Importe: parseFloat((base * tasaIva).toFixed(6)),
          },
        ],
      },
    },
  ];

  const metodoPago = instr.metodo_pago;
  const formaPago = metodoPago === "PPD" ? "99" : instr.forma_pago;

  // Detectar si es CFDI Global (publico en general)
  const esCfdiGlobal = receptor.rfc === "XAXX010101000";

  const cfdiPayload: Record<string, unknown> = {
    Receptor: { UID: receptor.uid_facturacom },
    TipoDocumento: "factura",
    Conceptos: conceptosPayload,
    UsoCFDI: usoCfdi,
    Serie: serie.uid_facturacom,
    FormaPago: formaPago,
    MetodoPago: esCfdiGlobal ? "PUE" : metodoPago, // CFDI Global siempre es PUE
    Moneda: "MXN",
    EnviarCorreo: false,
    // CFDI Global requiere InformacionGlobal (regla SAT CFDI40130)
    ...(esCfdiGlobal ? {
      InformacionGlobal: {
        Periodicidad: "04", // Mensual
        Meses: String(new Date().getMonth() + 1).padStart(2, "0"),
        "Año": new Date().getFullYear(),
      },
    } : {}),
  };

  // 9. Crear BORRADOR en factura.com (NO timbra)
  const client = createFacturaComClient(creds);
  let draftUid: string;
  try {
    const draftResponse = await client.createDraft(cfdiPayload);
    draftUid = draftResponse.uid ?? draftResponse.invoice_uid ?? "";
    if (!draftUid) {
      await sendMessage({
        chat_id: chatId,
        text: "Error: factura.com no devolvio UID del borrador.",
      });
      return;
    }
  } catch (err) {
    await sendMessage({
      chat_id: chatId,
      text: "Error al crear borrador: " + (err instanceof Error ? err.message : "Error desconocido"),
    });
    return;
  }

  // 10. Descargar PDF del borrador
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await client.downloadCfdiPdf(draftUid);
  } catch {
    // Si falla la descarga del PDF, enviar previa en texto
    const subtotal = instr.cantidad * instr.monto;
    const iva = subtotal * tasaIva;
    const total = subtotal + iva;
    await sendMessage({
      chat_id: chatId,
      text: "<b>Previa de factura</b> (borrador creado, PDF no disponible)\n\n"
        + "<b>Emisor:</b> " + empresa.razon_social + "\n"
        + "<b>Receptor:</b> " + receptor.razon_social + " (" + receptor.rfc + ")\n"
        + "<b>Concepto:</b> " + instr.descripcion + "\n"
        + "<b>Total:</b> $" + total.toFixed(2) + "\n"
        + "<b>Metodo:</b> " + metodoPago + "\n\n"
        + "Usa los botones para confirmar o cancelar.",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Confirmar timbrado", callback_data: "timbrar:" + draftUid + ":" + empresa.id },
            { text: "Cancelar", callback_data: "eliminar:" + draftUid + ":" + empresa.id },
          ],
        ],
      },
    });
    return;
  }

  // 11. Enviar PDF borrador por Telegram con botones de confirmacion
  const subtotal = instr.cantidad * instr.monto;
  const iva = subtotal * tasaIva;
  const total = subtotal + iva;

  const caption = "<b>Borrador de factura</b>\n\n"
    + "<b>Emisor:</b> " + empresa.razon_social + "\n"
    + "<b>Receptor:</b> " + receptor.razon_social + " (" + receptor.rfc + ")\n"
    + "<b>Total:</b> $" + total.toFixed(2) + "\n"
    + "<b>Metodo:</b> " + metodoPago + " | <b>Forma:</b> " + formaPago + "\n\n"
    + "Revisa el PDF y confirma o cancela.";

  const fileName = "borrador_" + empresa.rfc + "_" + receptor.rfc + ".pdf";

  // callback_data: "timbrar:{draftUid}:{empresaId}" o "eliminar:{draftUid}:{empresaId}"
  await sendDocumentWithConfirmation(
    chatId,
    pdfBuffer,
    fileName,
    caption,
    "timbrar:" + draftUid + ":" + empresa.id,
    "eliminar:" + draftUid + ":" + empresa.id
  );
}

// ---------------------------------------------------------------------------
// Manejar callback queries (botones de confirmacion)
// ---------------------------------------------------------------------------

async function handleCallbackQuery(callback: TelegramCallbackQuery): Promise<void> {
  const chatId = callback.message?.chat.id;
  const messageId = callback.message?.message_id;
  const data = callback.data;

  if (!chatId || !data) {
    await answerCallbackQuery(callback.id);
    return;
  }

  // Formato: "timbrar:{draftUid}:{empresaId}" o "eliminar:{draftUid}:{empresaId}"
  const parts = data.split(":");
  const action = parts[0];
  const draftUid = parts[1];
  const empresaId = parts[2];

  if (!draftUid || !empresaId) {
    await answerCallbackQuery(callback.id, "Datos invalidos");
    return;
  }

  if (action === "eliminar") {
    await answerCallbackQuery(callback.id, "Cancelado");
    await handleCancelDraft(chatId, draftUid, empresaId, messageId);
    return;
  }

  if (action === "timbrar") {
    await answerCallbackQuery(callback.id, "Timbrando...");
    await handleConfirmDraft(chatId, draftUid, empresaId);
    return;
  }

  await answerCallbackQuery(callback.id);
}

// ---------------------------------------------------------------------------
// Cancelar borrador
// ---------------------------------------------------------------------------

async function handleCancelDraft(
  chatId: number,
  draftUid: string,
  empresaId: string,
  messageId?: number
): Promise<void> {
  const creds = await getFacturaComCredentials(empresaId);
  if (creds) {
    try {
      const client = createFacturaComClient(creds);
      await client.eliminarBorrador(draftUid);
    } catch {
      // No bloquear si falla la eliminacion del borrador
    }
  }

  if (messageId) {
    await editMessageText(chatId, messageId, "Borrador eliminado. Factura cancelada.");
  } else {
    await sendMessage({ chat_id: chatId, text: "Borrador eliminado. Factura cancelada." });
  }
}

// ---------------------------------------------------------------------------
// Confirmar borrador -> timbrar
// ---------------------------------------------------------------------------

async function handleConfirmDraft(
  chatId: number,
  draftUid: string,
  empresaId: string
): Promise<void> {
  await sendMessage({ chat_id: chatId, text: "Timbrando factura..." });

  // Obtener credenciales
  const creds = await getFacturaComCredentials(empresaId);
  if (!creds) {
    await sendMessage({
      chat_id: chatId,
      text: "Error: no se encontraron credenciales de factura.com.",
    });
    return;
  }

  const client = createFacturaComClient(creds);

  try {
    // Timbrar el borrador existente
    const cfdiResponse = await client.timbrarBorrador(draftUid);

    const uuid = cfdiResponse.UUID ?? cfdiResponse.SAT?.UUID ?? null;
    const serie = cfdiResponse.INV?.Serie ?? "";
    const folio = cfdiResponse.INV?.Folio ? String(cfdiResponse.INV.Folio) : null;

    // Registrar en Supabase
    const supabase = getSupabaseAdmin();

    // Obtener datos del emisor para Storage
    const { data: empresaData } = await supabase
      .from("billing_empresas_emisoras")
      .select("rfc")
      .eq("id", empresaId)
      .single();

    // Insertar factura en billing_facturas
    // Nota: los totales se calcularon en el borrador, aqui los obtenemos del CFDI
    const { data: factura } = await supabase
      .from("billing_facturas")
      .insert({
        empresa_id: empresaId,
        receptor_id: "", // Se llena abajo si es posible
        uuid: uuid,
        uid_facturacom: draftUid,
        serie: serie,
        folio: folio,
        fecha_emision: new Date().toISOString(),
        subtotal: 0, // Se actualizara con datos reales del CFDI
        iva: 0,
        total: 0,
        moneda: "MXN",
        metodo_pago: "PUE",
        forma_pago: "99",
        status: uuid ? "timbrada" : "borrador",
        status_pago: "pendiente",
        telegram_chat_id: String(chatId),
      })
      .select()
      .single();

    // Registrar evento
    if (factura) {
      await supabase.from("billing_cfdi_eventos").insert({
        factura_id: factura.id,
        evento: uuid ? "timbrado" : "borrador_creado",
        descripcion: "CFDI timbrado desde Telegram. Serie " + serie + " Folio " + (folio ?? "N/A") + " UUID " + (uuid ?? "N/A"),
        payload_response: JSON.parse(JSON.stringify(cfdiResponse)),
      });

      // Guardar XML y PDF en Storage
      if (uuid && empresaData) {
        try {
          await saveCfdiFiles({
            factura_id: factura.id,
            uid_facturacom: draftUid,
            uuid_sat: uuid,
            rfc_emisor: empresaData.rfc,
            credentials: creds,
          });
        } catch {
          // No bloquear el flujo si falla el guardado
        }
      }
    }

    // Responder con exito
    await sendMessage({
      chat_id: chatId,
      text: "<b>Factura timbrada exitosamente</b>\n\n"
        + "<b>UUID:</b> <code>" + (uuid ?? "N/A") + "</code>\n"
        + "<b>Serie:</b> " + serie + "\n"
        + "<b>Folio:</b> " + (folio ?? "N/A") + "\n"
        + "<b>UID:</b> " + draftUid,
    });
  } catch (err) {
    await sendMessage({
      chat_id: chatId,
      text: "Error al timbrar: " + (err instanceof Error ? err.message : "Error desconocido"),
    });
  }
}

// ---------------------------------------------------------------------------
// Resolvers — buscar entidades en Supabase
// ---------------------------------------------------------------------------

interface EmpresaRow {
  id: string;
  rfc: string;
  razon_social: string;
}

/**
 * Resuelve la empresa emisora a partir del nombre mencionado por Claude.
 * Busca coincidencia parcial en razon_social o RFC.
 */
function resolveEmpresa(
  empresaMencionada: string | null,
  empresas: EmpresaRow[]
): EmpresaRow | null {
  // Si no se menciono empresa y solo hay una, usar esa
  if (!empresaMencionada && empresas.length === 1) {
    return empresas[0];
  }

  if (!empresaMencionada) {
    return null;
  }

  const busqueda = empresaMencionada.toLowerCase();

  // Buscar coincidencia parcial en razon social o RFC
  const match = empresas.find(
    (e) =>
      e.razon_social.toLowerCase().includes(busqueda) ||
      e.rfc.toLowerCase().includes(busqueda) ||
      busqueda.includes(e.razon_social.toLowerCase()) ||
      busqueda.includes(e.rfc.toLowerCase())
  );

  return match ?? null;
}

interface ReceptorRow {
  id: string;
  rfc: string;
  razon_social: string;
  uid_facturacom: string | null;
  uso_cfdi: string;
  regimen_fiscal: string;
}

/**
 * Resuelve el receptor a partir del RFC o nombre.
 * Busca en billing_receptores filtrado por empresa_id.
 */
async function resolveReceptor(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  rfc: string | null,
  nombre: string | null,
  empresaId: string
): Promise<ReceptorRow | null> {
  // Buscar por RFC (mas preciso)
  if (rfc) {
    const { data } = await supabase
      .from("billing_receptores")
      .select("id, rfc, razon_social, uid_facturacom, uso_cfdi, regimen_fiscal")
      .eq("rfc", rfc.toUpperCase())
      .eq("empresa_id" as string, empresaId)
      .eq("activo", true)
      .limit(1)
      .single();

    if (data) return data as ReceptorRow;
  }

  // Buscar por nombre (menos preciso, busqueda parcial)
  if (nombre) {
    const { data } = await supabase
      .from("billing_receptores")
      .select("id, rfc, razon_social, uid_facturacom, uso_cfdi, regimen_fiscal")
      .eq("empresa_id" as string, empresaId)
      .eq("activo", true)
      .ilike("razon_social", "%" + nombre + "%")
      .limit(1)
      .single();

    if (data) return data as ReceptorRow;
  }

  return null;
}

interface SerieRow {
  id: string;
  serie: string;
  uid_facturacom: number;
}

/**
 * Resuelve la serie de facturacion activa para una empresa.
 * Busca la serie default o la primera activa del tipo indicado.
 */
async function resolveSerie(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  empresaId: string,
  tipo: "factura" | "pago"
): Promise<SerieRow | null> {
  // Intentar serie default del tipo
  const { data: serieDefault } = await supabase
    .from("billing_series_emisoras")
    .select("id, serie, uid_facturacom")
    .eq("empresa_id", empresaId)
    .eq("tipo", tipo)
    .eq("activa", true)
    .eq("es_default", true)
    .limit(1)
    .single();

  if (serieDefault?.uid_facturacom) {
    return serieDefault as SerieRow;
  }

  // Fallback: primera serie activa del tipo
  const { data: serieFallback } = await supabase
    .from("billing_series_emisoras")
    .select("id, serie, uid_facturacom")
    .eq("empresa_id", empresaId)
    .eq("tipo", tipo)
    .eq("activa", true)
    .limit(1)
    .single();

  if (serieFallback?.uid_facturacom) {
    return serieFallback as SerieRow;
  }

  // Ultimo fallback: cualquier serie activa (ignorar tipo)
  const { data: serieAny } = await supabase
    .from("billing_series_emisoras")
    .select("id, serie, uid_facturacom")
    .eq("empresa_id", empresaId)
    .eq("activa", true)
    .limit(1)
    .single();

  if (serieAny?.uid_facturacom) {
    return serieAny as SerieRow;
  }

  return null;
}
