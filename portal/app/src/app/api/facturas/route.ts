/**
 * GET  /api/facturas — Listar facturas con filtros
 * POST /api/facturas — Crear/timbrar CFDI (implementado en Paso 4)
 *
 * Query params GET: ?empresa_id=, ?status=, ?desde=, ?hasta=, ?limit=50, ?offset=0
 */
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  requireAuth,
  apiSuccess,
  apiError,
  parseJsonBody,
  getFacturaComCredentials,
} from "@/lib/api/helpers";
import {
  createFacturaComClient,
  validateCfdiFactura,
  validateCfdiRep,
  formatValidationErrors,
} from "@/lib/facturacom";

// ---------------------------------------------------------------------------
// GET — Listar facturas
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  if (!user) return apiError("No autenticado", 401);

  const sp = req.nextUrl.searchParams;
  const empresaId = sp.get("empresa_id");
  const status = sp.get("status");
  const desde = sp.get("desde");
  const hasta = sp.get("hasta");
  const limit = Math.min(Number(sp.get("limit")) || 50, 200);
  const offset = Number(sp.get("offset")) || 0;

  const supabase = await createClient();

  let query = supabase
    .from("billing_facturas")
    .select(
      "id, uuid, uid_facturacom, serie, folio, fecha_emision, subtotal, iva, total, moneda, metodo_pago, forma_pago, status, status_pago, empresa_id, receptor_id, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (empresaId) query = query.eq("empresa_id", empresaId);
  if (status) query = query.eq("status", status);
  if (desde) query = query.gte("fecha_emision", desde);
  if (hasta) query = query.lte("fecha_emision", hasta);

  const { data, error, count } = await query;

  if (error) {
    return apiError(error.message, 500, "SUPABASE_ERROR");
  }

  return apiSuccess(data, { total: count ?? 0, limit, offset });
}

// ---------------------------------------------------------------------------
// POST — Crear / timbrar CFDI
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  if (!user) return apiError("No autenticado", 401);

  const body = await parseJsonBody<Record<string, unknown>>(req);
  if (!body) return apiError("Body JSON inválido", 400, "INVALID_JSON");

  // Determinar tipo de CFDI y empresa
  const empresaId = body.empresa_id as string | undefined;
  if (!empresaId) return apiError("empresa_id es requerido", 400, "MISSING_FIELD");

  // Validar payload según tipo
  const tipoCfdi = body.TipoCfdi ?? body.TipoDocumento;
  let payloadValidado: Record<string, unknown>;

  if (tipoCfdi === "pago") {
    const result = validateCfdiRep(body);
    if (!result.success) {
      return apiError(formatValidationErrors(result.errors), 400, "VALIDATION_ERROR");
    }
    payloadValidado = result.data as unknown as Record<string, unknown>;
  } else {
    const result = validateCfdiFactura(body);
    if (!result.success) {
      return apiError(formatValidationErrors(result.errors), 400, "VALIDATION_ERROR");
    }
    payloadValidado = result.data as unknown as Record<string, unknown>;
  }

  // Obtener credenciales de factura.com
  const creds = await getFacturaComCredentials(empresaId);
  if (!creds) {
    return apiError(
      "No se encontraron credenciales de factura.com para esta empresa",
      404,
      "CREDENTIALS_NOT_FOUND"
    );
  }

  // Timbrar en factura.com
  const facturaClient = createFacturaComClient(creds);

  let cfdiResponse;
  try {
    cfdiResponse = await facturaClient.createCfdi(payloadValidado);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error al timbrar en factura.com";
    return apiError(message, 502, "FACTURACOM_ERROR");
  }

  // Registrar en Supabase
  const supabase = await createClient();

  const receptorId = body.receptor_id as string | undefined;
  const conceptos = body.Conceptos as Array<Record<string, unknown>> | undefined;

  // Calcular totales del payload
  const subtotal =
    (conceptos ?? []).reduce((acc, c) => {
      const qty = Number(c.Cantidad ?? 0);
      const price = Number(c.ValorUnitario ?? 0);
      return acc + qty * price;
    }, 0);
  const tasaIva = 0.16;
  const iva = subtotal * tasaIva;
  const total = subtotal + iva;

  const { data: factura, error: insertError } = await supabase
    .from("billing_facturas")
    .insert({
      empresa_id: empresaId,
      receptor_id: receptorId ?? "",
      uuid: cfdiResponse.UUID ?? cfdiResponse.SAT?.UUID ?? null,
      uid_facturacom: cfdiResponse.uid ?? null,
      serie: cfdiResponse.INV?.Serie ?? String(payloadValidado.Serie ?? ""),
      folio: cfdiResponse.INV?.Folio ? String(cfdiResponse.INV.Folio) : null,
      fecha_emision: new Date().toISOString(),
      subtotal,
      iva,
      total,
      moneda: (payloadValidado.Moneda as string) ?? "MXN",
      metodo_pago: (payloadValidado.MetodoPago as string) ?? "PUE",
      forma_pago: (payloadValidado.FormaPago as string) ?? "99",
      status: cfdiResponse.UUID ? "timbrada" : "borrador",
      status_pago: (payloadValidado.MetodoPago as string) === "PPD" ? "pendiente" : "pagada",
    })
    .select()
    .single();

  if (insertError) {
    // El CFDI ya se timbró — loggear error pero devolver el resultado de factura.com
    console.error("[POST /api/facturas] Error al insertar en Supabase:", insertError.message);
    return apiSuccess(
      { cfdi: cfdiResponse, supabase_error: insertError.message },
      { warning: "CFDI timbrado pero hubo error al guardar en Supabase" }
    );
  }

  // Registrar evento de timbrado
  await supabase.from("billing_cfdi_eventos").insert({
    factura_id: factura.id,
    evento: cfdiResponse.UUID ? "timbrado" : "borrador_creado",
    descripcion: `CFDI ${cfdiResponse.UUID ? "timbrado" : "guardado como borrador"} vía dashboard`,
    payload_response: JSON.parse(JSON.stringify(cfdiResponse)),
  });

  return apiSuccess(factura, { uid_facturacom: cfdiResponse.uid, uuid_sat: cfdiResponse.UUID });
}
