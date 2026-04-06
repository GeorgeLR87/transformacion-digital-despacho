/**
 * POST /api/facturas/[id]/storage
 * Descarga XML/PDF de factura.com y los sube a Supabase Storage.
 * Uso: trigger manual desde el dashboard o post-timbrado.
 */
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, apiSuccess, apiError, getFacturaComCredentials } from "@/lib/api/helpers";
import { saveCfdiFiles } from "@/lib/facturacom";

export async function POST(
  _req: NextRequest,
  ctx: RouteContext<"/api/facturas/[id]/storage">
) {
  const user = await requireAuth();
  if (!user) return apiError("No autenticado", 401);

  const { id } = await ctx.params;
  const supabase = await createClient();

  // Buscar factura
  const { data: factura } = await supabase
    .from("billing_facturas")
    .select("id, uid_facturacom, uuid, empresa_id, fecha_emision")
    .eq("id", id)
    .single();

  if (!factura) {
    return apiError("Factura no encontrada", 404, "NOT_FOUND");
  }

  if (!factura.uid_facturacom) {
    return apiError("La factura no tiene UID de factura.com — debe estar timbrada", 400, "NO_UID");
  }

  if (!factura.uuid) {
    return apiError("La factura no tiene UUID SAT — debe estar timbrada", 400, "NO_UUID");
  }

  // Obtener RFC emisor
  const { data: empresa } = await supabase
    .from("billing_empresas_emisoras")
    .select("rfc")
    .eq("id", factura.empresa_id)
    .single();

  if (!empresa) {
    return apiError("Empresa emisora no encontrada", 404, "NOT_FOUND");
  }

  // Obtener credenciales
  const creds = await getFacturaComCredentials(factura.empresa_id);
  if (!creds) {
    return apiError("Credenciales de factura.com no encontradas", 404, "CREDENTIALS_NOT_FOUND");
  }

  // Descargar y guardar
  const result = await saveCfdiFiles({
    uid_facturacom: factura.uid_facturacom,
    uuid_sat: factura.uuid,
    rfc_emisor: empresa.rfc,
    factura_id: factura.id,
    fecha_emision: factura.fecha_emision,
    credentials: creds,
  });

  if (!result.success) {
    return apiError(
      `Errores al guardar archivos: ${result.errores.join(" · ")}`,
      502,
      "STORAGE_ERROR"
    );
  }

  return apiSuccess({
    xml_storage_path: result.xml_storage_path,
    pdf_storage_path: result.pdf_storage_path,
  });
}
