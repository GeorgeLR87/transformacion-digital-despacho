/**
 * GET  /api/facturas — Listar facturas con filtros
 * POST /api/facturas — Crear/timbrar CFDI (implementado en Paso 4)
 *
 * Query params GET: ?empresa_id=, ?status=, ?desde=, ?hasta=, ?limit=50, ?offset=0
 */
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  requireAuth,
  apiSuccess,
  apiError,
  parseJsonBody,
  getFacturaComCredentials,
} from "@/lib/api/helpers";
import {
  createCfdiPue,
  createCfdiPpd,
  createCfdiRep,
  createCfdiGlobal,
  type ConceptoInput,
  type Periodicidad,
} from "@/lib/facturacom";

// ---------------------------------------------------------------------------
// GET — Listar facturas
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  if (!user) return apiError("No autenticado", 401);

  const sp = req.nextUrl.searchParams;
  const empresaId = sp.get("empresa_id");
  const status = sp.get("status");
  const desde = sp.get("desde");
  const hasta = sp.get("hasta");
  const limit = Math.min(Number(sp.get("limit")) || 50, 200);
  const offset = Number(sp.get("offset")) || 0;

  const supabase = await createClient();

  let query = supabase
    .from("billing_facturas")
    .select(
      "id, uuid, uid_facturacom, serie, folio, fecha_emision, subtotal, iva, total, moneda, metodo_pago, forma_pago, status, status_pago, empresa_id, receptor_id, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (empresaId) query = query.eq("empresa_id", empresaId);
  if (status) query = query.eq("status", status);
  if (desde) query = query.gte("fecha_emision", desde);
  if (hasta) query = query.lte("fecha_emision", hasta);

  const { data, error, count } = await query;

  if (error) {
    return apiError(error.message, 500, "SUPABASE_ERROR");
  }

  return apiSuccess(data, { total: count ?? 0, limit, offset });
}

// ---------------------------------------------------------------------------
// POST — Crear / timbrar CFDI (delega a funciones especializadas por tipo)
// ---------------------------------------------------------------------------

interface FacturaPostBody {
  tipo: "pue" | "ppd" | "rep" | "global";
  empresa_id: string;
  receptor_uid: string;
  receptor_id: string;
  serie_uid: number;
  conceptos?: ConceptoInput[];
  forma_pago?: string;
  uso_cfdi?: string;
  moneda?: string;
  tipo_cambio?: number;
  observaciones?: string;
  // Campos específicos para REP
  factura_ppd_id?: string;
  serie_pago_uid?: number;
  fecha_pago?: string;
  monto?: number;
  moneda_pago?: string;
  referencia?: string;
  // Campos específicos para Global
  periodicidad?: Periodicidad;
  meses?: string;
  anio?: number;
}

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  if (!user) return apiError("No autenticado", 401);

  const body = await parseJsonBody<FacturaPostBody>(req);
  if (!body) return apiError("Body JSON inválido", 400, "INVALID_JSON");

  const { tipo, empresa_id } = body;
  if (!empresa_id) return apiError("empresa_id es requerido", 400, "MISSING_FIELD");
  if (!tipo) return apiError("tipo es requerido (pue, ppd, rep)", 400, "MISSING_FIELD");

  // Obtener credenciales de factura.com
  const creds = await getFacturaComCredentials(empresa_id);
  if (!creds) {
    return apiError(
      "No se encontraron credenciales de factura.com para esta empresa",
      404,
      "CREDENTIALS_NOT_FOUND"
    );
  }

  // Delegar según tipo de CFDI
  if (tipo === "pue") {
    if (!body.conceptos?.length) return apiError("conceptos es requerido para PUE", 400, "MISSING_FIELD");
    if (!body.forma_pago) return apiError("forma_pago es requerido para PUE", 400, "MISSING_FIELD");

    const result = await createCfdiPue({
      empresa_id,
      receptor_uid: body.receptor_uid,
      receptor_id: body.receptor_id,
      serie_uid: body.serie_uid,
      conceptos: body.conceptos,
      forma_pago: body.forma_pago,
      uso_cfdi: body.uso_cfdi ?? "G03",
      moneda: body.moneda,
      tipo_cambio: body.tipo_cambio,
      observaciones: body.observaciones,
      credentials: creds,
    });

    if (!result.success) return apiError(result.error!, 400, "TIMBRADO_ERROR");
    return apiSuccess(result.factura, { cfdi: result.cfdiResponse });
  }

  if (tipo === "ppd") {
    if (!body.conceptos?.length) return apiError("conceptos es requerido para PPD", 400, "MISSING_FIELD");

    const result = await createCfdiPpd({
      empresa_id,
      receptor_uid: body.receptor_uid,
      receptor_id: body.receptor_id,
      serie_uid: body.serie_uid,
      conceptos: body.conceptos,
      uso_cfdi: body.uso_cfdi ?? "G03",
      moneda: body.moneda,
      tipo_cambio: body.tipo_cambio,
      observaciones: body.observaciones,
      credentials: creds,
    });

    if (!result.success) return apiError(result.error!, 400, "TIMBRADO_ERROR");
    return apiSuccess(result.factura, { cfdi: result.cfdiResponse });
  }

  if (tipo === "rep") {
    if (!body.factura_ppd_id) return apiError("factura_ppd_id es requerido para REP", 400, "MISSING_FIELD");
    if (!body.fecha_pago) return apiError("fecha_pago es requerido para REP", 400, "MISSING_FIELD");
    if (!body.monto) return apiError("monto es requerido para REP", 400, "MISSING_FIELD");
    if (!body.forma_pago) return apiError("forma_pago es requerido para REP", 400, "MISSING_FIELD");

    const result = await createCfdiRep({
      empresa_id,
      factura_ppd_id: body.factura_ppd_id,
      receptor_uid: body.receptor_uid,
      serie_pago_uid: body.serie_pago_uid ?? body.serie_uid,
      forma_pago: body.forma_pago,
      fecha_pago: body.fecha_pago,
      monto: body.monto,
      moneda_pago: body.moneda_pago,
      referencia: body.referencia,
      credentials: creds,
    });

    if (!result.success) return apiError(result.error!, 400, "TIMBRADO_ERROR");
    return apiSuccess(result.pago, { cfdi: result.cfdiResponse });
  }

  if (tipo === "global") {
    if (!body.conceptos?.length) return apiError("conceptos es requerido para Global", 400, "MISSING_FIELD");
    if (!body.periodicidad) return apiError("periodicidad es requerido para Global", 400, "MISSING_FIELD");
    if (!body.meses) return apiError("meses es requerido para Global", 400, "MISSING_FIELD");
    if (!body.anio) return apiError("anio es requerido para Global", 400, "MISSING_FIELD");

    const result = await createCfdiGlobal({
      empresa_id,
      receptor_uid: body.receptor_uid,
      serie_uid: body.serie_uid,
      conceptos: body.conceptos,
      forma_pago: body.forma_pago ?? "99",
      moneda: body.moneda,
      periodicidad: body.periodicidad,
      meses: body.meses,
      anio: body.anio,
      observaciones: body.observaciones,
      credentials: creds,
    });

    if (!result.success) return apiError(result.error!, 400, "TIMBRADO_ERROR");
    return apiSuccess(result.factura, { cfdi: result.cfdiResponse });
  }

  return apiError("tipo inválido — debe ser pue, ppd, rep o global", 400, "INVALID_TYPE");
}
