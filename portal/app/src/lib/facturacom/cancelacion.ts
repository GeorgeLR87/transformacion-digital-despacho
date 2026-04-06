/**
 * @file lib/facturacom/cancelacion.ts
 * @description Flujo de cancelación de CFDIs ante el SAT vía factura.com.
 *
 * Motivos SAT:
 * - "01" = Comprobante emitido con errores con relación (requiere UUID sustituto)
 * - "02" = Comprobante emitido con errores sin relación
 * - "03" = No se llevó a cabo la operación
 * - "04" = Operación nominativa relacionada en la factura global
 *
 * Estados post-cancelación:
 * - cancelacion_solicitada → esperando aceptación del receptor (montos > $5,000)
 * - cancelada → cancelación aceptada o inmediata (montos ≤ $5,000 o mismo día)
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import {
  createFacturaComClient,
  type FacturaComCredentials,
  type CfdiCancelResponse,
} from "./client";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type MotivoCancel = "01" | "02" | "03" | "04";

export interface CancelCfdiParams {
  /** ID de la factura en billing_facturas */
  factura_id: string;
  /** Motivo SAT de cancelación */
  motivo: MotivoCancel;
  /** UUID SAT del CFDI sustituto — requerido solo cuando motivo === "01" */
  uuid_sustitucion?: string;
  /** Credenciales de factura.com de la empresa emisora */
  credentials: FacturaComCredentials;
}

export interface CancelResult {
  success: boolean;
  status?: string;
  message?: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// Helper — Supabase admin
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
// Función principal
// ---------------------------------------------------------------------------

/**
 * Cancela un CFDI ante el SAT vía factura.com y actualiza billing_facturas.
 *
 * Flujo:
 * 1. Leer factura de Supabase (validar que existe y está timbrada)
 * 2. Llamar a factura.com DELETE /v4/cfdi40/{uid}/cancel
 * 3. Actualizar billing_facturas.status según respuesta
 * 4. Registrar evento en billing_cfdi_eventos
 */
export async function cancelCfdi(params: CancelCfdiParams): Promise<CancelResult> {
  const { factura_id, motivo, uuid_sustitucion, credentials } = params;

  const supabase = getSupabaseAdmin();

  // 1. Leer factura
  const { data: factura, error: errFactura } = await supabase
    .from("billing_facturas")
    .select("id, uid_facturacom, uuid, status, empresa_id")
    .eq("id", factura_id)
    .single();

  if (errFactura || !factura) {
    return { success: false, error: "Factura no encontrada" };
  }

  if (!factura.uid_facturacom) {
    return { success: false, error: "La factura no tiene UID de factura.com — no se puede cancelar" };
  }

  if (factura.status === "cancelada") {
    return { success: false, error: "La factura ya está cancelada" };
  }

  if (factura.status === "cancelacion_solicitada") {
    return { success: false, error: "La cancelación ya fue solicitada — esperando respuesta del SAT" };
  }

  // Validar motivo 01 requiere UUID sustituto
  if (motivo === "01" && !uuid_sustitucion) {
    return { success: false, error: "UUID de sustitución es obligatorio para motivo 01" };
  }

  // 2. Cancelar en factura.com
  const client = createFacturaComClient(credentials);
  let cancelResponse: CfdiCancelResponse;
  try {
    cancelResponse = await client.cancelCfdi(factura.uid_facturacom, motivo, uuid_sustitucion);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al cancelar en factura.com";
    return { success: false, error: message };
  }

  // 3. Determinar nuevo status
  // factura.com puede devolver "success" inmediato o indicar que está en proceso
  const nuevoStatus = cancelResponse.response === "success" ? "cancelada" : "cancelacion_solicitada";

  const motivoTexto: Record<MotivoCancel, string> = {
    "01": "Comprobante con errores con relación",
    "02": "Comprobante con errores sin relación",
    "03": "No se llevó a cabo la operación",
    "04": "Operación nominativa en factura global",
  };

  // Actualizar billing_facturas
  await supabase
    .from("billing_facturas")
    .update({ status: nuevoStatus })
    .eq("id", factura_id);

  // 4. Registrar evento
  await supabase.from("billing_cfdi_eventos").insert({
    factura_id,
    evento: nuevoStatus === "cancelada" ? "cancelado" : "cancelacion_solicitada",
    descripcion: `Cancelación ${nuevoStatus === "cancelada" ? "exitosa" : "solicitada"} · Motivo ${motivo}: ${motivoTexto[motivo]}${uuid_sustitucion ? ` · Sustituto: ${uuid_sustitucion}` : ""}`,
    payload_response: JSON.parse(JSON.stringify(cancelResponse)),
  });

  return {
    success: true,
    status: nuevoStatus,
    message: `Cancelación ${nuevoStatus === "cancelada" ? "completada" : "solicitada"} — motivo ${motivo}`,
  };
}
