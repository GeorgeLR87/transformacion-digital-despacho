/**
 * POST /api/empresas/[id]/series/sync
 * Sincroniza las series de factura.com → billing_series_emisoras para una empresa.
 */
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, apiSuccess, apiError, getFacturaComCredentials } from "@/lib/api/helpers";
import { syncSeriesFacturaCom } from "@/lib/facturacom";

export async function POST(
  _req: NextRequest,
  ctx: RouteContext<"/api/empresas/[id]/series/sync">
) {
  const user = await requireAuth();
  if (!user) return apiError("No autenticado", 401);

  const { id: empresaId } = await ctx.params;

  // Verificar que la empresa existe
  const supabase = await createClient();
  const { data: empresa } = await supabase
    .from("billing_empresas_emisoras")
    .select("id, rfc")
    .eq("id", empresaId)
    .single();

  if (!empresa) {
    return apiError("Empresa no encontrada", 404, "NOT_FOUND");
  }

  // Obtener credenciales
  const creds = await getFacturaComCredentials(empresaId);
  if (!creds) {
    return apiError(
      "No se encontraron credenciales de factura.com para esta empresa",
      404,
      "CREDENTIALS_NOT_FOUND"
    );
  }

  // Ejecutar sincronización
  try {
    const result = await syncSeriesFacturaCom({
      empresaId,
      rfc: empresa.rfc,
      apiKey: creds.apiKey,
      secretKey: creds.secretKey,
    });

    return apiSuccess(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error al sincronizar series";
    return apiError(message, 502, "SYNC_ERROR");
  }
}
