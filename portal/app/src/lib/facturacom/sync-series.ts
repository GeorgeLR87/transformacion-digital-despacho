/**
 * @file lib/facturacom/sync-series.ts
 * @description Sincronización de series entre factura.com y billing_series_emisoras en Supabase.
 *
 * Regla crítica:
 *   SerieID de factura.com === uid_facturacom en billing_series_emisoras (INTEGER).
 *   Este es el valor que va en el campo "Serie" del payload de timbrado, NO la letra.
 *
 * Estrategia: upsert por empresa_id + uid_facturacom.
 * - Series nuevas → insertar.
 * - Series existentes → actualizar nombre/tipo/estado si cambió.
 * - NO eliminar series inactivas (pueden ser referenciadas por CFDIs históricos).
 */

import { createFacturaComClient, FacturaComSerie, FacturaComApiError } from "./client";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface SyncSeriesOptions {
  /** ID de la empresa en billing_empresas_emisoras */
  empresaId: string;
  /** RFC de la empresa (para logs) */
  rfc: string;
  /** Credenciales de factura.com para esta empresa */
  apiKey: string;
  secretKey: string;
}

export interface SyncSeriesResult {
  total: number;
  insertadas: number;
  actualizadas: number;
  errores: number;
  detallesError: string[];
  /** Series con sus UIDs numéricos para uso inmediato */
  series: SerieConUid[];
}

export interface SerieConUid {
  uid_facturacom: number; // SerieID — va en el campo Serie del CFDI
  nombre: string; // SerieName — letra/código, ej: "F"
  tipo: string; // SerieType — "factura" | "pago" | etc.
  activa: boolean;
}

// ---------------------------------------------------------------------------
// Helper — Supabase admin
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
 * Sincroniza las series de factura.com hacia billing_series_emisoras.
 *
 * @example
 * const result = await syncSeriesFacturaCom({
 *   empresaId: "uuid-empresa",
 *   rfc: "SPT1608084H8",
 *   apiKey: "...",
 *   secretKey: "...",
 * });
 * // result.series contiene todos los SerieID numéricos disponibles
 */
export async function syncSeriesFacturaCom(
  options: SyncSeriesOptions
): Promise<SyncSeriesResult> {
  const { empresaId, rfc, apiKey, secretKey } = options;

  const facturaClient = createFacturaComClient({ apiKey, secretKey });
  const supabase = getSupabaseAdmin();

  const result: SyncSeriesResult = {
    total: 0,
    insertadas: 0,
    actualizadas: 0,
    errores: 0,
    detallesError: [],
    series: [],
  };

  // Obtener series de factura.com
  let seriesRemota: FacturaComSerie[];
  try {
    const res = await facturaClient.listSeries();
    seriesRemota = res.data ?? [];
  } catch (err) {
    if (err instanceof FacturaComApiError) {
      result.errores++;
      result.detallesError.push(`Error al listar series en factura.com: ${err.message}`);
      return result;
    }
    throw err;
  }

  result.total = seriesRemota.length;

  if (seriesRemota.length === 0) {
    console.warn(`[sync-series] ${rfc}: factura.com devolvió 0 series`);
    return result;
  }

  // Obtener series existentes en Supabase para esta empresa
  const { data: existentes, error: fetchError } = await supabase
    .from("billing_series_emisoras")
    .select("id, uid_facturacom, serie, tipo, activa")
    .eq("empresa_id", empresaId);

  if (fetchError) {
    result.errores += seriesRemota.length;
    result.detallesError.push(`Error al consultar series existentes: ${fetchError.message}`);
    return result;
  }

  // Mapa uid_facturacom → registro existente
  const existentesMap = new Map(
    existentes?.map((s) => [s.uid_facturacom, s]) ?? []
  );

  // Clasificar
  const toInsert: BillingSerieInsert[] = [];
  const toUpdate: {
    id: string;
    serie: string;
    tipo: string;
    activa: boolean;
  }[] = [];

  for (const serie of seriesRemota) {
    const activa = serie.SerieStatus === "Activa";
    const existente = existentesMap.get(serie.SerieID);

    result.series.push({
      uid_facturacom: serie.SerieID,
      nombre: serie.SerieName,
      tipo: serie.SerieType,
      activa,
    });

    if (!existente) {
      toInsert.push(mapSerieToRow(serie, empresaId));
    } else {
      // Actualizar si cambió nombre de serie, tipo o estado
      const changed =
        existente.serie !== serie.SerieName ||
        existente.tipo !== serie.SerieType ||
        existente.activa !== activa;

      if (changed) {
        toUpdate.push({
          id: existente.id,
          serie: serie.SerieName,
          tipo: serie.SerieType,
          activa,
        });
      } else {
        result.actualizadas++; // ya sincronizada
      }
    }
  }

  // Insertar nuevas series
  if (toInsert.length > 0) {
    const { error: insertError } = await supabase
      .from("billing_series_emisoras")
      .insert(toInsert);

    if (insertError) {
      result.errores += toInsert.length;
      result.detallesError.push(`Error al insertar series: ${insertError.message}`);
    } else {
      result.insertadas += toInsert.length;
    }
  }

  // Actualizar series con cambios
  for (const update of toUpdate) {
    const { error: updateError } = await supabase
      .from("billing_series_emisoras")
      .update({
        serie: update.serie,
        tipo: update.tipo,
        activa: update.activa,
      })
      .eq("id", update.id);

    if (updateError) {
      result.errores++;
      result.detallesError.push(
        `Error al actualizar serie ${update.id}: ${updateError.message}`
      );
    } else {
      result.actualizadas++;
    }
  }

  console.log(
    `[sync-series] ${rfc}: total=${result.total} insertadas=${result.insertadas} actualizadas=${result.actualizadas} errores=${result.errores}`
  );

  return result;
}

// ---------------------------------------------------------------------------
// Tipos internos
// ---------------------------------------------------------------------------

/** Campos para insertar en billing_series_emisoras */
interface BillingSerieInsert {
  empresa_id: string;
  serie: string;
  uid_facturacom: number;
  tipo: string;
  descripcion: string;
  activa: boolean;
}

// ---------------------------------------------------------------------------
// Mapper — FacturaComSerie → billing_series_emisoras row
// ---------------------------------------------------------------------------

function mapSerieToRow(serie: FacturaComSerie, empresaId: string): BillingSerieInsert {
  return {
    empresa_id: empresaId,
    uid_facturacom: serie.SerieID,       // INTEGER — el campo "Serie" del CFDI
    serie: serie.SerieName,              // "F", "PA", etc. — columna `serie` en el schema
    tipo: serie.SerieType,               // "factura" | "pago" | "nota_credito" | etc.
    descripcion: serie.SerieDescription,
    activa: serie.SerieStatus === "Activa",
  };
}

// ---------------------------------------------------------------------------
// Lookup helper — obtener uid_facturacom para una serie dado su nombre y tipo
// ---------------------------------------------------------------------------

/**
 * Resuelve el uid_facturacom (SerieID numérico) de una serie por su nombre y tipo.
 * Primero busca en Supabase (caché local). Si no existe y se provee facturaClient,
 * consulta factura.com directamente, inserta en caché y retorna el UID.
 *
 * @param supabase - Cliente Supabase
 * @param empresaId - ID de la empresa emisora
 * @param serieName - Nombre de la serie, ej: "F", "PA"
 * @param serieType - Tipo de serie (para desambiguar si hay varias con el mismo nombre)
 * @param facturaClient - Cliente factura.com (necesario solo si la serie no está en caché)
 *
 * @returns SerieID numérico para usar en el campo "Serie" del payload de CFDI
 */
export async function resolveSerieUid(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  empresaId: string,
  serieName: string,
  serieType: "factura" | "pago" | "nota_credito" | "nota_debito" | "retencion",
  facturaClient?: ReturnType<typeof createFacturaComClient>
): Promise<number> {
  // 1. Buscar en caché local
  const { data: local } = await supabase
    .from("billing_series_emisoras")
    .select("uid_facturacom")
    .eq("empresa_id", empresaId)
    .eq("serie", serieName)
    .eq("tipo", serieType)
    .eq("activa", true)
    .single();

  if (local?.uid_facturacom) {
    return local.uid_facturacom;
  }

  // 2. Si se provee cliente, buscar en factura.com e insertar en caché
  if (facturaClient) {
    const res = await facturaClient.listSeries();
    const seriesRemota = res.data ?? [];

    const found = seriesRemota.find(
      (s) => s.SerieName === serieName && s.SerieType === serieType
    );

    if (found) {
      // Upsert por empresa_id + serie (índice UNIQUE en el schema)
      await supabase
        .from("billing_series_emisoras")
        .upsert(
          {
            empresa_id: empresaId,
            serie: found.SerieName,
            uid_facturacom: found.SerieID,
            tipo: found.SerieType,
            descripcion: found.SerieDescription,
            activa: found.SerieStatus === "Activa",
          },
          { onConflict: "empresa_id,serie" }
        );

      return found.SerieID;
    }
  }

  throw new Error(
    `Serie "${serieName}" de tipo "${serieType}" no encontrada para la empresa ${empresaId}. ` +
      `Verificar que exista y esté activa en factura.com.`
  );
}
