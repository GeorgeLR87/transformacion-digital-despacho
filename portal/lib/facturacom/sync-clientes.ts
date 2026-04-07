/**
 * @file lib/facturacom/sync-clientes.ts
 * @description Sincronización de receptores entre factura.com y billing_receptores en Supabase.
 *
 * Estrategia: upsert por RFC + empresa_id.
 * - Si el receptor ya existe en Supabase → actualizar uid_facturacom si cambió.
 * - Si no existe → insertar.
 * - NO elimina receptores (factura.com es la fuente de verdad para UIDs).
 *
 * Uso principal:
 *   1. Al registrar una nueva empresa (importar todos sus receptores).
 *   2. En cron periódico para mantener sincronía.
 *   3. Antes de timbrar, para verificar que el receptor existe y obtener su UID.
 */

import { createFacturaComClient, FacturaComCliente, FacturaComApiError } from "./client";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase"; // generado con supabase gen types

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface SyncClientesOptions {
  /** ID de la empresa en billing_empresas_emisoras */
  empresaId: string;
  /** RFC de la empresa (para logs) */
  rfc: string;
  /** Credenciales de factura.com para esta empresa */
  apiKey: string;
  secretKey: string;
  /** Si true, importa en lotes de per_page hasta agotar paginación */
  fullSync?: boolean;
}

export interface SyncClientesResult {
  total: number;
  insertados: number;
  actualizados: number;
  errores: number;
  detallesError: string[];
}

// ---------------------------------------------------------------------------
// Helper — cliente Supabase con service_role (acceso completo para sync server-side)
// ---------------------------------------------------------------------------

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Variables de entorno NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY requeridas"
    );
  }
  return createClient<Database>(url, serviceKey);
}

// ---------------------------------------------------------------------------
// Función principal de sincronización
// ---------------------------------------------------------------------------

/**
 * Sincroniza todos los receptores de factura.com de una empresa hacia billing_receptores.
 *
 * @example
 * const result = await syncClientesFacturaCom({
 *   empresaId: "uuid-empresa",
 *   rfc: "SPT1608084H8",
 *   apiKey: "...",
 *   secretKey: "...",
 *   fullSync: true,
 * });
 */
export async function syncClientesFacturaCom(
  options: SyncClientesOptions
): Promise<SyncClientesResult> {
  const { empresaId, rfc, apiKey, secretKey, fullSync = false } = options;

  const facturaClient = createFacturaComClient({ apiKey, secretKey });
  const supabase = getSupabaseAdmin();

  const result: SyncClientesResult = {
    total: 0,
    insertados: 0,
    actualizados: 0,
    errores: 0,
    detallesError: [],
  };

  // Obtener todos los clientes de factura.com (con paginación si fullSync)
  let clientes: FacturaComCliente[] = [];

  if (fullSync) {
    clientes = await fetchAllClientes(facturaClient);
  } else {
    // Solo primera página (útil para sync incremental o verificaciones rápidas)
    const res = await facturaClient.listClientes({ per_page: 100 });
    clientes = res.data ?? [];
  }

  result.total = clientes.length;

  if (clientes.length === 0) {
    return result;
  }

  // Procesar en lotes para no saturar Supabase
  const BATCH_SIZE = 50;
  for (let i = 0; i < clientes.length; i += BATCH_SIZE) {
    const batch = clientes.slice(i, i + BATCH_SIZE);
    const batchResult = await upsertReceptoresBatch(supabase, empresaId, batch);

    result.insertados += batchResult.insertados;
    result.actualizados += batchResult.actualizados;
    result.errores += batchResult.errores;
    result.detallesError.push(...batchResult.detallesError);
  }

  console.log(
    `[sync-clientes] ${rfc}: total=${result.total} insertados=${result.insertados} actualizados=${result.actualizados} errores=${result.errores}`
  );

  return result;
}

// ---------------------------------------------------------------------------
// Paginación completa
// ---------------------------------------------------------------------------

async function fetchAllClientes(
  facturaClient: ReturnType<typeof createFacturaComClient>
): Promise<FacturaComCliente[]> {
  const all: FacturaComCliente[] = [];
  const PER_PAGE = 100;
  let page = 1;

  while (true) {
    let res;
    try {
      res = await facturaClient.listClientes({ page, per_page: PER_PAGE });
    } catch (err) {
      if (err instanceof FacturaComApiError) {
        console.error(`[sync-clientes] Error en página ${page}:`, err.message);
        break;
      }
      throw err;
    }

    const batch = res.data ?? [];
    all.push(...batch);

    // factura.com devuelve menos items que per_page cuando es la última página
    if (batch.length < PER_PAGE) break;
    page++;
  }

  return all;
}

// ---------------------------------------------------------------------------
// Tipos internos
// ---------------------------------------------------------------------------

/** Campos requeridos para insertar en billing_receptores */
interface BillingReceptorInsert {
  empresa_id: string;
  rfc: string;
  razon_social: string;
  email: string;
  regimen_fiscal: string;
  cp_fiscal: string;
  uid_facturacom: string | null;
  activo: boolean;
}

// ---------------------------------------------------------------------------
// Upsert por lote
// ---------------------------------------------------------------------------

interface BatchResult {
  insertados: number;
  actualizados: number;
  errores: number;
  detallesError: string[];
}

/**
 * billing_receptores es per-empresa (UNIQUE por empresa_id + RFC).
 * Cada empresa tiene su propia lista de receptores con UIDs independientes.
 */
async function upsertReceptoresBatch(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  empresaId: string,
  clientes: FacturaComCliente[]
): Promise<BatchResult> {
  const result: BatchResult = {
    insertados: 0,
    actualizados: 0,
    errores: 0,
    detallesError: [],
  };

  // Obtener receptores existentes de ESTA empresa por RFC
  const rfcs = clientes.map((c) => c.RFC);
  const { data: existentes, error: fetchError } = await supabase
    .from("billing_receptores")
    .select("id, rfc, uid_facturacom")
    .eq("empresa_id", empresaId)
    .in("rfc", rfcs);

  if (fetchError) {
    result.errores += clientes.length;
    result.detallesError.push(`Error al consultar receptores existentes: ${fetchError.message}`);
    return result;
  }

  // Mapa RFC → receptor existente
  const existentesMap = new Map(existentes?.map((r) => [r.rfc, r]) ?? []);

  // Separar en inserts y updates
  const toInsert: BillingReceptorInsert[] = [];
  const toUpdate: { id: string; uid_facturacom: string }[] = [];

  for (const cliente of clientes) {
    const existente = existentesMap.get(cliente.RFC);

    if (!existente) {
      // Nuevo receptor para esta empresa
      toInsert.push(mapClienteToReceptor(empresaId, cliente));
    } else if (existente.uid_facturacom !== cliente.UID) {
      // UID cambió (raro pero posible tras migración de cuenta)
      toUpdate.push({ id: existente.id, uid_facturacom: cliente.UID });
    } else {
      // Ya existe y está sincronizado
      result.actualizados++;
    }
  }

  // Insertar nuevos
  if (toInsert.length > 0) {
    const { error: insertError } = await supabase
      .from("billing_receptores")
      .insert(toInsert);

    if (insertError) {
      result.errores += toInsert.length;
      result.detallesError.push(`Error al insertar receptores: ${insertError.message}`);
    } else {
      result.insertados += toInsert.length;
    }
  }

  // Actualizar UIDs que cambiaron
  for (const update of toUpdate) {
    const { error: updateError } = await supabase
      .from("billing_receptores")
      .update({ uid_facturacom: update.uid_facturacom })
      .eq("id", update.id);

    if (updateError) {
      result.errores++;
      result.detallesError.push(
        `Error al actualizar receptor ${update.id}: ${updateError.message}`
      );
    } else {
      result.actualizados++;
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Mapper — FacturaComCliente → billing_receptores row
// ---------------------------------------------------------------------------

/**
 * Mapea un cliente de factura.com a los campos de billing_receptores.
 * Incluye empresa_id para vincular el receptor con su empresa emisora.
 * Campos de dirección (calle, colonia, etc.) no están en el schema — se omiten.
 */
function mapClienteToReceptor(empresaId: string, cliente: FacturaComCliente): BillingReceptorInsert {
  return {
    empresa_id: empresaId,
    uid_facturacom: cliente.UID,       // TEXT hex, ej: "69c2b39872b03"
    rfc: cliente.RFC,
    razon_social: cliente.RazonSocial,
    regimen_fiscal: cliente.RegimenId, // "601", "616", etc.
    cp_fiscal: cliente.CodigoPostal,   // columna real en el schema
    email: cliente.Email ?? "",        // NOT NULL en schema — cadena vacía si no viene
    activo: true,
    // uso_cfdi usa DEFAULT 'G03' en Supabase — no se sobreescribe aquí
  };
}

// ---------------------------------------------------------------------------
// Lookup helper — obtener UID de factura.com para un RFC dado
// ---------------------------------------------------------------------------

/**
 * Busca el UID interno de factura.com para un RFC dentro de una empresa.
 * Primero consulta billing_receptores (per empresa).
 * Si no existe, busca en factura.com, lo inserta y retorna el UID.
 *
 * Lanza error si el RFC no existe en factura.com.
 *
 * @param supabase - Cliente Supabase (admin para escritura)
 * @param facturaClient - Cliente de factura.com de la empresa emisora
 * @param empresaId - ID de la empresa emisora en billing_empresas_emisoras
 * @param rfc - RFC del receptor a buscar
 */
export async function resolveReceptorUid(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  facturaClient: ReturnType<typeof createFacturaComClient>,
  empresaId: string,
  rfc: string
): Promise<string> {
  // 1. Buscar en billing_receptores de ESTA empresa
  const { data: local } = await supabase
    .from("billing_receptores")
    .select("uid_facturacom")
    .eq("empresa_id", empresaId)
    .eq("rfc", rfc)
    .single();

  if (local?.uid_facturacom) {
    return local.uid_facturacom;
  }

  // 2. Buscar en factura.com
  const clienteRemoto = await facturaClient.findClienteByRfc(rfc);
  if (!clienteRemoto) {
    throw new Error(
      `Receptor con RFC ${rfc} no encontrado en factura.com. Registrarlo primero.`
    );
  }

  // 3. Insertar en Supabase para esta empresa
  await supabase
    .from("billing_receptores")
    .insert(mapClienteToReceptor(empresaId, clienteRemoto));

  return clienteRemoto.UID;
}
