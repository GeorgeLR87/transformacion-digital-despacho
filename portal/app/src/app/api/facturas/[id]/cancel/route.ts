/**
 * POST /api/facturas/[id]/cancel
 * Cancela un CFDI ante el SAT vía factura.com.
 *
 * Body: { motivo: "01"|"02"|"03"|"04", uuid_sustitucion?: string }
 */
import type { NextRequest } from "next/server";
import { requireAuth, apiSuccess, apiError, parseJsonBody, getFacturaComCredentials } from "@/lib/api/helpers";
import { createClient } from "@/lib/supabase/server";
import { cancelCfdi, type MotivoCancel } from "@/lib/facturacom";

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/facturas/[id]/cancel">
) {
  const user = await requireAuth();
  if (!user) return apiError("No autenticado", 401);

  const { id } = await ctx.params;

  const body = await parseJsonBody<{ motivo: MotivoCancel; uuid_sustitucion?: string }>(req);
  if (!body) return apiError("Body JSON inválido", 400, "INVALID_JSON");
  if (!body.motivo) return apiError("motivo es requerido (01, 02, 03, 04)", 400, "MISSING_FIELD");

  // Obtener empresa_id de la factura
  const supabase = await createClient();
  const { data: factura } = await supabase
    .from("billing_facturas")
    .select("empresa_id")
    .eq("id", id)
    .single();

  if (!factura) return apiError("Factura no encontrada", 404, "NOT_FOUND");

  // Obtener credenciales
  const creds = await getFacturaComCredentials(factura.empresa_id);
  if (!creds) {
    return apiError("Credenciales de factura.com no encontradas", 404, "CREDENTIALS_NOT_FOUND");
  }

  const result = await cancelCfdi({
    factura_id: id,
    motivo: body.motivo,
    uuid_sustitucion: body.uuid_sustitucion,
    credentials: creds,
  });

  if (!result.success) {
    return apiError(result.error!, 400, "CANCEL_ERROR");
  }

  return apiSuccess({ status: result.status, message: result.message });
}
