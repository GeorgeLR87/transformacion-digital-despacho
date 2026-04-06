/**
 * GET /api/facturas/[id]
 * Detalle de una factura con sus conceptos y pagos.
 */
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, apiSuccess, apiError } from "@/lib/api/helpers";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/facturas/[id]">
) {
  const user = await requireAuth();
  if (!user) return apiError("No autenticado", 401);

  const { id } = await ctx.params;
  const supabase = await createClient();

  // Factura principal
  const { data: factura, error: errFactura } = await supabase
    .from("billing_facturas")
    .select("*")
    .eq("id", id)
    .single();

  if (errFactura || !factura) {
    return apiError("Factura no encontrada", 404, "NOT_FOUND");
  }

  // Conceptos de la factura
  const { data: conceptos } = await supabase
    .from("billing_conceptos_factura")
    .select("*")
    .eq("factura_id", id)
    .order("created_at");

  // Pagos (si es PPD)
  const { data: pagos } = await supabase
    .from("billing_pagos")
    .select("*")
    .eq("factura_id", id)
    .order("num_parcialidad");

  // Eventos / historial
  const { data: eventos } = await supabase
    .from("billing_cfdi_eventos")
    .select("id, evento, descripcion, created_at")
    .eq("factura_id", id)
    .order("created_at", { ascending: false });

  return apiSuccess({
    ...factura,
    conceptos: conceptos ?? [],
    pagos: pagos ?? [],
    eventos: eventos ?? [],
  });
}
