/**
 * POST /api/empresas/[id]/receptores/sync
 * Sincroniza receptores de factura.com → billing_receptores para una empresa.
 * Body opcional: { fullSync: true } para importar todas las páginas.
 */
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  requireAuth,
  apiSuccess,
  apiError,
  getFacturaComCredentials,
  parseJsonBody,
} from "@/lib/api/helpers";
import { syncClientesFacturaCom } from "@/lib/facturacom";

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/empresas/[id]/receptores/sync">
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

  // Parsear body para opciones
  const body = await parseJsonBody<{ fullSync?: boolean }>(req);

  // Ejecutar sincronización
  try {
    const result = await syncClientesFacturaCom({
      empresaId,
      rfc: empresa.rfc,
      apiKey: creds.apiKey,
      secretKey: creds.secretKey,
      fullSync: body?.fullSync ?? false,
    });

    return apiSuccess(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error al sincronizar receptores";
    return apiError(message, 502, "SYNC_ERROR");
  }
}
