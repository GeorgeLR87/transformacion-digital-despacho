/**
 * GET /api/empresas/[id]
 * Detalle de una empresa emisora con sus series activas.
 */
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, apiSuccess, apiError } from "@/lib/api/helpers";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/empresas/[id]">
) {
  const user = await requireAuth();
  if (!user) return apiError("No autenticado", 401);

  const { id } = await ctx.params;
  const supabase = await createClient();

  // Empresa
  const { data: empresa, error: errEmpresa } = await supabase
    .from("billing_empresas_emisoras")
    .select("id, rfc, razon_social, regimen_fiscal, cp_fiscal, activo, csd_numero_certificado, csd_vigencia_inicio, csd_vigencia_fin, created_at")
    .eq("id", id)
    .single();

  if (errEmpresa || !empresa) {
    return apiError("Empresa no encontrada", 404, "NOT_FOUND");
  }

  // Series activas de la empresa
  const { data: series } = await supabase
    .from("billing_series_emisoras")
    .select("id, serie, tipo, uid_facturacom, descripcion, es_default, activa")
    .eq("empresa_id", id)
    .eq("activa", true)
    .order("serie");

  return apiSuccess({ ...empresa, series: series ?? [] });
}
