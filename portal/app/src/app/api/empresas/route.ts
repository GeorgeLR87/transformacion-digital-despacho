/**
 * GET /api/empresas
 * Lista todas las empresas emisoras activas.
 */
import { createClient } from "@/lib/supabase/server";
import { requireAuth, apiSuccess, apiError } from "@/lib/api/helpers";

export async function GET() {
  const user = await requireAuth();
  if (!user) return apiError("No autenticado", 401);

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("billing_empresas_emisoras")
    .select("id, rfc, razon_social, regimen_fiscal, cp_fiscal, activo, csd_vigencia_fin")
    .eq("activo", true)
    .order("razon_social");

  if (error) {
    return apiError(error.message, 500, "SUPABASE_ERROR");
  }

  return apiSuccess(data);
}
