/**
 * GET /api/receptores
 * Lista receptores con filtros opcionales.
 * Query params: ?rfc=, ?q= (busca en razón social), ?activo=true, ?limit=50, ?offset=0
 */
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, apiSuccess, apiError } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  if (!user) return apiError("No autenticado", 401);

  const sp = req.nextUrl.searchParams;
  const rfc = sp.get("rfc");
  const q = sp.get("q");
  const soloActivos = sp.get("activo") !== "false";
  const limit = Math.min(Number(sp.get("limit")) || 50, 200);
  const offset = Number(sp.get("offset")) || 0;

  const supabase = await createClient();

  let query = supabase
    .from("billing_receptores")
    .select("id, rfc, razon_social, email, regimen_fiscal, cp_fiscal, uso_cfdi, uid_facturacom, activo", { count: "exact" })
    .order("razon_social")
    .range(offset, offset + limit - 1);

  if (rfc) {
    query = query.eq("rfc", rfc.toUpperCase());
  }

  if (q) {
    query = query.ilike("razon_social", `%${q}%`);
  }

  if (soloActivos) {
    query = query.eq("activo", true);
  }

  const { data, error, count } = await query;

  if (error) {
    return apiError(error.message, 500, "SUPABASE_ERROR");
  }

  return apiSuccess(data, { total: count ?? 0, limit, offset });
}
