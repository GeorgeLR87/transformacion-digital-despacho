/**
 * GET /api/facturas/[id]/xml
 * Descarga el XML de un CFDI desde factura.com.
 * Primero intenta Supabase Storage; si no existe, consulta factura.com.
 */
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, apiError, getFacturaComCredentials } from "@/lib/api/helpers";
import { createFacturaComClient } from "@/lib/facturacom";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/facturas/[id]/xml">
) {
  const user = await requireAuth();
  if (!user) return apiError("No autenticado", 401);

  const { id } = await ctx.params;
  const supabase = await createClient();

  // Buscar factura en Supabase
  const { data: factura } = await supabase
    .from("billing_facturas")
    .select("id, uid_facturacom, empresa_id, xml_storage_path")
    .eq("id", id)
    .single();

  if (!factura) {
    return apiError("Factura no encontrada", 404, "NOT_FOUND");
  }

  // Si ya tenemos el XML en Storage, redirigir a la URL firmada
  if (factura.xml_storage_path) {
    const { data: signedUrl } = await supabase.storage
      .from("facturas")
      .createSignedUrl(factura.xml_storage_path, 300); // 5 min

    if (signedUrl?.signedUrl) {
      return Response.redirect(signedUrl.signedUrl);
    }
  }

  // Si no hay XML local, descargar desde factura.com
  if (!factura.uid_facturacom) {
    return apiError("La factura no tiene UID de factura.com", 400, "NO_UID");
  }

  const creds = await getFacturaComCredentials(factura.empresa_id);
  if (!creds) {
    return apiError("Credenciales de factura.com no encontradas", 404, "CREDENTIALS_NOT_FOUND");
  }

  try {
    const facturaClient = createFacturaComClient(creds);
    const xmlData = await facturaClient.downloadCfdiXml(factura.uid_facturacom);

    return Response.json({ success: true, data: xmlData });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al descargar XML";
    return apiError(message, 502, "FACTURACOM_ERROR");
  }
}
