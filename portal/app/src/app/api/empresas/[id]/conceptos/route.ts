/**
 * GET /api/empresas/[id]/conceptos
 * Lista los conceptos/productos de una empresa.
 * Query params: ?activo=true (por defecto solo activos), ?q= (busca en descripción)
 */
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, apiSuccess, apiError } from "@/lib/api/helpers";

export async function GET(
  req: NextRequest,
  ctx: RouteContext<"/api/empresas/[id]/conceptos">
) {
  const user = await requireAuth();
  if (!user) return apiError("No autenticado", 401);

  const { id } = await ctx.params;
  const sp = req.nextUrl.searchParams;
  const soloActivos = sp.get("activo") !== "false";
  const q = sp.get("q");

  const supabase = await createClient();

  let query = supabase
    .from("billing_conceptos")
    .select("id, sku, clave_prod_serv, clave_unidad, descripcion, precio_unitario, tasa_iva, activo")
    .eq("empresa_id", id)
    .order("descripcion");

  if (soloActivos) {
    query = query.eq("activo", true);
  }

  if (q) {
    query = query.ilike("descripcion", `%${q}%`);
  }

  const { data, error } = await query;

  if (error) {
    return apiError(error.message, 500, "SUPABASE_ERROR");
  }

  return apiSuccess(data);
}
