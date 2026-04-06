/**
 * @file lib/facturacom/sync-productos.ts
 * @description Sincronización de productos entre factura.com y billing_conceptos en Supabase.
 *
 * Estrategia: upsert por empresa_id + sku (NoIdentificacion de factura.com).
 * - Si el concepto ya existe → actualizar precio, descripción, clave SAT si cambió.
 * - Si no existe → insertar.
 * - NO eliminar conceptos (pueden ser referenciados por facturas históricas).
 *
 * Uso principal:
 *   1. Al registrar una nueva empresa (importar todos sus productos).
 *   2. En sync manual desde el dashboard.
 *   3. Antes de timbrar, para verificar que el concepto existe.
 */

import { createFacturaComClient, FacturaComProducto, FacturaComApiError } from "./client";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface SyncProductosOptions {
  /** ID de la empresa en billing_empresas_emisoras */
  empresaId: string;
  /** RFC de la empresa (para logs) */
  rfc: string;
  /** Credenciales de factura.com para esta empresa */
  apiKey: string;
  secretKey: string;
}

export interface SyncProductosResult {
  total: number;
  insertados: number;
  actualizados: number;
  sinCambio: number;
  errores: number;
  detallesError: string[];
}

// ---------------------------------------------------------------------------
// Helper — cliente Supabase con service_role
// ---------------------------------------------------------------------------

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Variables NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY requeridas"
    );
  }
  return createClient<Database>(url, serviceKey);
}

// ---------------------------------------------------------------------------
// Función principal
// ---------------------------------------------------------------------------

/**
 * Sincroniza todos los productos de factura.com hacia billing_conceptos.
 *
 * @example
 * const result = await syncProductosFacturaCom({
 *   empresaId: "uuid-empresa",
 *   rfc: "SPT1608084H8",
 *   apiKey: "...",
 *   secretKey: "...",
 * });
 */
export async function syncProductosFacturaCom(
  options: SyncProductosOptions
): Promise<SyncProductosResult> {
  const { empresaId, rfc, apiKey, secretKey } = options;

  const facturaClient = createFacturaComClient({ apiKey, secretKey });
  const supabase = getSupabaseAdmin();

  const result: SyncProductosResult = {
    total: 0,
    insertados: 0,
    actualizados: 0,
    sinCambio: 0,
    errores: 0,
    detallesError: [],
  };

  // Obtener todos los productos de factura.com (con paginación)
  let productos: FacturaComProducto[];
  try {
    productos = await fetchAllProductos(facturaClient);
  } catch (err) {
    if (err instanceof FacturaComApiError) {
      result.errores++;
      result.detallesError.push(`Error al listar productos en factura.com: ${err.message}`);
      return result;
    }
    throw err;
  }

  result.total = productos.length;

  if (productos.length === 0) {
    console.warn(`[sync-productos] ${rfc}: factura.com devolvió 0 productos`);
    return result;
  }

  // Obtener conceptos existentes en Supabase para esta empresa
  const { data: existentes, error: fetchError } = await supabase
    .from("billing_conceptos")
    .select("id, sku, clave_prod_serv, descripcion, precio_unitario, clave_unidad, tasa_iva")
    .eq("empresa_id", empresaId);

  if (fetchError) {
    result.errores += productos.length;
    result.detallesError.push(`Error al consultar conceptos existentes: ${fetchError.message}`);
    return result;
  }

  // Mapa sku → concepto existente
  const existentesMap = new Map(
    existentes?.map((c) => [c.sku, c]) ?? []
  );

  // Clasificar en inserts y updates
  const toInsert: BillingConceptoInsert[] = [];
  const toUpdate: { id: string; changes: Partial<BillingConceptoInsert> }[] = [];

  for (const producto of productos) {
    const sku = producto.NoIdentificacion || producto.UID;
    const existente = existentesMap.get(sku);
    const mapped = mapProductoToConcepto(producto, empresaId);

    if (!existente) {
      toInsert.push(mapped);
    } else {
      // Verificar si cambió algo
      const changed =
        existente.clave_prod_serv !== mapped.clave_prod_serv ||
        existente.descripcion !== mapped.descripcion ||
        existente.precio_unitario !== mapped.precio_unitario ||
        existente.clave_unidad !== mapped.clave_unidad ||
        existente.tasa_iva !== mapped.tasa_iva;

      if (changed) {
        toUpdate.push({
          id: existente.id,
          changes: {
            clave_prod_serv: mapped.clave_prod_serv,
            descripcion: mapped.descripcion,
            precio_unitario: mapped.precio_unitario,
            clave_unidad: mapped.clave_unidad,
            tasa_iva: mapped.tasa_iva,
          },
        });
      } else {
        result.sinCambio++;
      }
    }
  }

  // Insertar nuevos
  if (toInsert.length > 0) {
    const { error: insertError } = await supabase
      .from("billing_conceptos")
      .insert(toInsert);

    if (insertError) {
      result.errores += toInsert.length;
      result.detallesError.push(`Error al insertar conceptos: ${insertError.message}`);
    } else {
      result.insertados += toInsert.length;
    }
  }

  // Actualizar los que cambiaron
  for (const update of toUpdate) {
    const { error: updateError } = await supabase
      .from("billing_conceptos")
      .update(update.changes)
      .eq("id", update.id);

    if (updateError) {
      result.errores++;
      result.detallesError.push(
        `Error al actualizar concepto ${update.id}: ${updateError.message}`
      );
    } else {
      result.actualizados++;
    }
  }

  console.log(
    `[sync-productos] ${rfc}: total=${result.total} insertados=${result.insertados} actualizados=${result.actualizados} sinCambio=${result.sinCambio} errores=${result.errores}`
  );

  return result;
}

// ---------------------------------------------------------------------------
// Paginación completa
// ---------------------------------------------------------------------------

async function fetchAllProductos(
  facturaClient: ReturnType<typeof createFacturaComClient>
): Promise<FacturaComProducto[]> {
  const all: FacturaComProducto[] = [];
  const PER_PAGE = 100;
  let page = 1;

  while (true) {
    let res;
    try {
      res = await facturaClient.listProductos({ page, per_page: PER_PAGE });
    } catch (err) {
      if (err instanceof FacturaComApiError) {
        console.error(`[sync-productos] Error en página ${page}:`, err.message);
        break;
      }
      throw err;
    }

    const batch = res.data ?? [];
    all.push(...batch);

    if (batch.length < PER_PAGE) break;
    page++;
  }

  return all;
}

// ---------------------------------------------------------------------------
// Tipos internos
// ---------------------------------------------------------------------------

interface BillingConceptoInsert {
  empresa_id: string;
  sku: string;
  clave_prod_serv: string;
  clave_unidad: string;
  descripcion: string;
  precio_unitario: number;
  tasa_iva: number;
  activo: boolean;
}

// ---------------------------------------------------------------------------
// Mapper — FacturaComProducto → billing_conceptos row
// ---------------------------------------------------------------------------

function mapProductoToConcepto(
  producto: FacturaComProducto,
  empresaId: string
): BillingConceptoInsert {
  return {
    empresa_id: empresaId,
    sku: producto.NoIdentificacion || producto.UID,
    clave_prod_serv: producto.ClaveProdServ,
    clave_unidad: producto.ClaveUnidad || "E48", // E48 = Unidad de servicio (default SAT)
    descripcion: producto.Descripcion,
    precio_unitario: parseFloat(producto.Precio) || 0,
    tasa_iva: parseFloat(producto.IVA) || 0.16,
    activo: true,
  };
}
