/**
 * GET /api/empresas/[id]/series
 * Lista las series de facturación de una empresa.
 * Query params opcionales: ?activa=true (por defecto solo activas)
 */
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, apiSuccess, apiError } from "@/lib/api/helpers";

export async function GET(
  req: NextRequest,
  ctx: RouteContext<"/api/empresas/[id]/series">
) {
  const user = await requireAuth();
  if (!user) return apiError("No autenticado", 401);

  const { id } = await ctx.params;
  const soloActivas = req.nextUrl.searchParams.get("activa") !== "false";

  const supabase = await createClient();

  let query = supabase
    .from("billing_series_emisoras")
    .select("id, serie, tipo, uid_facturacom, descripcion, es_default, activa")
    .eq("empresa_id", id)
    .order("serie");

  if (soloActivas) {
    query = query.eq("activa", true);
  }

  const { data, error } = await query;

  if (error) {
    return apiError(error.message, 500, "SUPABASE_ERROR");
  }

  return apiSuccess(data);
}
