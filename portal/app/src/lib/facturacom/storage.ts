/**
 * @file lib/facturacom/storage.ts
 * @description Descarga XML/PDF de factura.com y los sube a Supabase Storage.
 *
 * Ruta en Storage: facturas/{RFC}/{AÑO}/{MES}/{UUID}.xml y .pdf
 * Los paths se guardan en billing_facturas.xml_storage_path y pdf_storage_path.
 *
 * Los endpoints de factura.com devuelven el archivo en base64:
 *   GET /v4/cfdi40/{uid}/pdf → { "data": "BASE64..." }
 *   GET /v4/cfdi40/{uid}/xml → { "data": "BASE64..." }
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { createFacturaComClient, type FacturaComCredentials } from "./client";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface StorageResult {
  success: boolean;
  xml_storage_path?: string;
  pdf_storage_path?: string;
  errores: string[];
}

export interface SaveCfdiFilesParams {
  /** UID interno de factura.com del CFDI */
  uid_facturacom: string;
  /** UUID SAT del CFDI (para nombrar archivos) */
  uuid_sat: string;
  /** RFC de la empresa emisora (para la ruta en Storage) */
  rfc_emisor: string;
  /** ID de la factura en billing_facturas (para actualizar paths) */
  factura_id: string;
  /** Fecha de emisión (para organizar por año/mes) */
  fecha_emision?: string;
  /** Credenciales de factura.com */
  credentials: FacturaComCredentials;
}

// ---------------------------------------------------------------------------
// Helper — Supabase admin
// ---------------------------------------------------------------------------

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Variables NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY requeridas");
  }
  return createClient<Database>(url, serviceKey);
}

// ---------------------------------------------------------------------------
// Función principal
// ---------------------------------------------------------------------------

/**
 * Descarga XML y PDF de factura.com y los sube a Supabase Storage.
 * Actualiza billing_facturas con los paths de Storage.
 *
 * @example
 * const result = await saveCfdiFiles({
 *   uid_facturacom: "69c42db71c9d3",
 *   uuid_sat: "cd3d95f2-c149-4800-93a7-491982e8c01b",
 *   rfc_emisor: "SPT1608084H8",
 *   factura_id: "uuid-factura",
 *   credentials: { apiKey: "...", secretKey: "..." },
 * });
 */
export async function saveCfdiFiles(params: SaveCfdiFilesParams): Promise<StorageResult> {
  const {
    uid_facturacom,
    uuid_sat,
    rfc_emisor,
    factura_id,
    fecha_emision,
    credentials,
  } = params;

  const facturaClient = createFacturaComClient(credentials);
  const supabase = getSupabaseAdmin();
  const errores: string[] = [];

  // Construir ruta: {RFC}/{AÑO}/{MES}/{UUID}
  const fecha = fecha_emision ? new Date(fecha_emision) : new Date();
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const basePath = `${rfc_emisor}/${year}/${month}/${uuid_sat}`;

  let xmlPath: string | undefined;
  let pdfPath: string | undefined;

  // Descargar y subir XML
  try {
    const xmlBuffer = await facturaClient.downloadCfdiXml(uid_facturacom);
    const xmlStoragePath = `${basePath}.xml`;

    const { error: uploadError } = await supabase.storage
      .from("facturas")
      .upload(xmlStoragePath, xmlBuffer, {
        contentType: "application/xml",
        upsert: true,
      });

    if (uploadError) {
      errores.push(`Error al subir XML: ${uploadError.message}`);
    } else {
      xmlPath = xmlStoragePath;
    }
  } catch (err) {
    errores.push(`Error al descargar XML: ${err instanceof Error ? err.message : "desconocido"}`);
  }

  // Descargar y subir PDF
  try {
    const pdfBuffer = await facturaClient.downloadCfdiPdf(uid_facturacom);
    const pdfStoragePath = `${basePath}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("facturas")
      .upload(pdfStoragePath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      errores.push(`Error al subir PDF: ${uploadError.message}`);
    } else {
      pdfPath = pdfStoragePath;
    }
  } catch (err) {
    errores.push(`Error al descargar PDF: ${err instanceof Error ? err.message : "desconocido"}`);
  }

  // Actualizar billing_facturas con los paths
  if (xmlPath || pdfPath) {
    const updateFields: Record<string, string> = {};
    if (xmlPath) updateFields.xml_storage_path = xmlPath;
    if (pdfPath) updateFields.pdf_storage_path = pdfPath;

    const { error: updateError } = await supabase
      .from("billing_facturas")
      .update(updateFields)
      .eq("id", factura_id);

    if (updateError) {
      errores.push(`Error al actualizar paths en billing_facturas: ${updateError.message}`);
    }
  }

  console.log(
    `[storage] ${rfc_emisor}/${uuid_sat}: xml=${xmlPath ? "✓" : "✗"} pdf=${pdfPath ? "✓" : "✗"} errores=${errores.length}`
  );

  return {
    success: errores.length === 0,
    xml_storage_path: xmlPath,
    pdf_storage_path: pdfPath,
    errores,
  };
}
