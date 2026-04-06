/**
 * @file lib/facturacom/timbrado.ts
 * @description Funciones de negocio para timbrado de CFDIs por tipo.
 *
 * Cuatro funciones principales:
 * - createCfdiPue()    → Factura con pago en una exhibición
 * - createCfdiPpd()    → Factura con pago en parcialidades (requiere REP posterior)
 * - createCfdiRep()    → Complemento de Pago v2.0 para facturas PPD
 * - createCfdiGlobal() → Factura al público en general (RFC XAXX010101000)
 *
 * Cada función: valida → timbra en factura.com → registra en Supabase → devuelve resultado.
 *
 * Reglas críticas:
 * - Serie = UID numérico de factura.com, NO la letra
 * - Receptor.UID = UID hex interno de factura.com, NO el RFC
 * - Folios asignados automáticamente por factura.com
 * - Moneda del comprobante REP siempre "XXX" (MonedaP lleva la moneda real)
 * - Fecha CFDI máximo 72 horas hacia atrás
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import {
  createFacturaComClient,
  type FacturaComCredentials,
  type CfdiCreateResponse,
} from "./client";
import {
  validateCfdiFactura,
  validateCfdiRep,
  formatValidationErrors,
  conceptoRepFijo,
  type ICfdiFactura,
  type ICfdiRep,
} from "./validators";

// ---------------------------------------------------------------------------
// Tipos compartidos
// ---------------------------------------------------------------------------

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Variables NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY requeridas");
  }
  return createClient<Database>(url, serviceKey);
}

/** Resultado común de cualquier operación de timbrado */
export interface TimbradoResult {
  success: boolean;
  factura?: {
    id: string;
    uuid: string | null;
    uid_facturacom: string | null;
    serie: string;
    folio: string | null;
    total: number;
    status: string;
  };
  pago?: {
    id: string;
    uuid_sat_rep: string | null;
    num_parcialidad: number;
    monto: number;
    saldo_insoluto: number;
  };
  cfdiResponse?: CfdiCreateResponse;
  error?: string;
}

/** Concepto de entrada para facturas PUE/PPD */
export interface ConceptoInput {
  clave_prod_serv: string;
  clave_unidad: string;
  descripcion: string;
  cantidad: number;
  valor_unitario: number;
  objeto_imp?: string;
  tasa_iva?: number;
  concepto_id?: string; // ID de billing_conceptos (opcional, para tracking)
}

// ---------------------------------------------------------------------------
// Orden 26 — Crear CFDI PUE (pago en una exhibición)
// ---------------------------------------------------------------------------

export interface CreatePueParams {
  empresa_id: string;
  receptor_uid: string; // UID hex de factura.com
  receptor_id: string;  // ID en billing_receptores
  serie_uid: number;    // UID numérico de la serie en factura.com
  conceptos: ConceptoInput[];
  forma_pago: string;   // Clave SAT: "01", "03", "28", etc.
  uso_cfdi: string;     // Clave SAT: "G03", "S01", etc.
  moneda?: string;      // Default: "MXN"
  tipo_cambio?: number; // Default: 1
  observaciones?: string;
  credentials: FacturaComCredentials;
}

/**
 * Crea y timbra un CFDI de tipo PUE (Pago en Una Exhibición).
 *
 * Flujo:
 * 1. Construir payload con conceptos e impuestos
 * 2. Validar con Zod (CfdiFacturaSchema)
 * 3. Timbrar en factura.com
 * 4. Insertar en billing_facturas + billing_conceptos_factura + billing_cfdi_eventos
 */
export async function createCfdiPue(params: CreatePueParams): Promise<TimbradoResult> {
  const {
    empresa_id,
    receptor_uid,
    receptor_id,
    serie_uid,
    conceptos,
    forma_pago,
    uso_cfdi,
    moneda = "MXN",
    tipo_cambio = 1,
    observaciones,
    credentials,
  } = params;

  // Construir conceptos para factura.com
  const conceptosPayload = conceptos.map((c) => {
    const tasaIva = c.tasa_iva ?? 0.16;
    const objetoImp = c.objeto_imp ?? "02"; // 02 = Sí objeto de impuesto
    const base = c.cantidad * c.valor_unitario;

    return {
      ClaveProdServ: c.clave_prod_serv,
      Cantidad: c.cantidad,
      ClaveUnidad: c.clave_unidad,
      Descripcion: c.descripcion,
      ValorUnitario: c.valor_unitario,
      ObjetoImp: objetoImp,
      ...(objetoImp === "02"
        ? {
            Impuestos: {
              Traslados: [
                {
                  Base: parseFloat(base.toFixed(6)),
                  Impuesto: "002", // IVA
                  TipoFactor: "Tasa" as const,
                  TasaOCuota: tasaIva.toFixed(6),
                  Importe: parseFloat((base * tasaIva).toFixed(6)),
                },
              ],
            },
          }
        : {}),
    };
  });

  // Construir payload completo
  const payload: Record<string, unknown> = {
    Receptor: { UID: receptor_uid },
    TipoDocumento: "factura",
    Conceptos: conceptosPayload,
    UsoCFDI: uso_cfdi,
    Serie: serie_uid,
    FormaPago: forma_pago,
    MetodoPago: "PUE",
    Moneda: moneda,
    TipoCambio: tipo_cambio,
    EnviarCorreo: false,
    ...(observaciones ? { Observaciones: observaciones } : {}),
  };

  // Validar
  const validation = validateCfdiFactura(payload);
  if (!validation.success) {
    return { success: false, error: formatValidationErrors(validation.errors) };
  }

  // Timbrar
  const client = createFacturaComClient(credentials);
  let cfdiResponse: CfdiCreateResponse;
  try {
    cfdiResponse = await client.createCfdi(validation.data as unknown as Record<string, unknown>);
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error al timbrar en factura.com",
    };
  }

  // Calcular totales
  const subtotal = conceptos.reduce((acc, c) => acc + c.cantidad * c.valor_unitario, 0);
  const iva = conceptos.reduce((acc, c) => {
    const tasa = c.tasa_iva ?? 0.16;
    const obj = c.objeto_imp ?? "02";
    return acc + (obj === "02" ? c.cantidad * c.valor_unitario * tasa : 0);
  }, 0);
  const total = subtotal + iva;

  // Registrar en Supabase
  const supabase = getSupabaseAdmin();

  const { data: factura, error: insertError } = await supabase
    .from("billing_facturas")
    .insert({
      empresa_id,
      receptor_id,
      uuid: cfdiResponse.UUID ?? cfdiResponse.SAT?.UUID ?? null,
      uid_facturacom: cfdiResponse.uid ?? null,
      serie: cfdiResponse.INV?.Serie ?? String(serie_uid),
      folio: cfdiResponse.INV?.Folio ? String(cfdiResponse.INV.Folio) : null,
      fecha_emision: new Date().toISOString(),
      subtotal,
      iva,
      total,
      moneda,
      metodo_pago: "PUE",
      forma_pago,
      status: cfdiResponse.UUID ? "timbrada" : "borrador",
      status_pago: "pagada",
    })
    .select()
    .single();

  if (insertError) {
    return {
      success: false,
      error: `CFDI timbrado (${cfdiResponse.uid}) pero error al guardar: ${insertError.message}`,
      cfdiResponse,
    };
  }

  // Insertar conceptos de la factura
  const conceptosFactura = conceptos.map((c) => ({
    factura_id: factura.id,
    concepto_id: c.concepto_id ?? null,
    clave_prod_serv: c.clave_prod_serv,
    clave_unidad: c.clave_unidad,
    descripcion: c.descripcion,
    cantidad: c.cantidad,
    precio_unitario: c.valor_unitario,
    tasa_iva: c.tasa_iva ?? 0.16,
    importe: c.cantidad * c.valor_unitario,
    importe_iva: c.cantidad * c.valor_unitario * (c.tasa_iva ?? 0.16),
  }));

  await supabase.from("billing_conceptos_factura").insert(conceptosFactura);

  // Registrar evento
  await supabase.from("billing_cfdi_eventos").insert({
    factura_id: factura.id,
    evento: cfdiResponse.UUID ? "timbrado" : "borrador_creado",
    descripcion: `CFDI PUE ${cfdiResponse.UUID ? "timbrado" : "borrador"} · Serie ${factura.serie} · Folio ${factura.folio}`,
    payload_response: JSON.parse(JSON.stringify(cfdiResponse)),
  });

  return {
    success: true,
    factura: {
      id: factura.id,
      uuid: factura.uuid,
      uid_facturacom: factura.uid_facturacom,
      serie: factura.serie,
      folio: factura.folio,
      total: factura.total,
      status: factura.status,
    },
    cfdiResponse,
  };
}

// ---------------------------------------------------------------------------
// Orden 27 — Crear CFDI PPD (pago en parcialidades o diferido)
// ---------------------------------------------------------------------------

export interface CreatePpdParams extends Omit<CreatePueParams, "forma_pago"> {
  /** PPD siempre usa FormaPago "99" (Por definir) */
}

/**
 * Crea y timbra un CFDI de tipo PPD (Pago en Parcialidades o Diferido).
 *
 * Diferencias con PUE:
 * - MetodoPago = "PPD" (no "PUE")
 * - FormaPago = "99" (por definir — se conoce al recibir el pago)
 * - status_pago = "pendiente" (requiere Complemento de Pago REP posterior)
 * - saldo_insoluto inicia en total
 */
export async function createCfdiPpd(params: CreatePpdParams): Promise<TimbradoResult> {
  // Reutilizar la lógica de PUE con las diferencias de PPD
  const pueParams: CreatePueParams = {
    ...params,
    forma_pago: "99", // PPD siempre usa "99"
  };

  // Construir conceptos para factura.com (misma lógica que PUE)
  const conceptosPayload = params.conceptos.map((c) => {
    const tasaIva = c.tasa_iva ?? 0.16;
    const objetoImp = c.objeto_imp ?? "02";
    const base = c.cantidad * c.valor_unitario;

    return {
      ClaveProdServ: c.clave_prod_serv,
      Cantidad: c.cantidad,
      ClaveUnidad: c.clave_unidad,
      Descripcion: c.descripcion,
      ValorUnitario: c.valor_unitario,
      ObjetoImp: objetoImp,
      ...(objetoImp === "02"
        ? {
            Impuestos: {
              Traslados: [
                {
                  Base: parseFloat(base.toFixed(6)),
                  Impuesto: "002",
                  TipoFactor: "Tasa" as const,
                  TasaOCuota: tasaIva.toFixed(6),
                  Importe: parseFloat((base * tasaIva).toFixed(6)),
                },
              ],
            },
          }
        : {}),
    };
  });

  const payload: Record<string, unknown> = {
    Receptor: { UID: params.receptor_uid },
    TipoDocumento: "factura",
    Conceptos: conceptosPayload,
    UsoCFDI: params.uso_cfdi,
    Serie: params.serie_uid,
    FormaPago: "99",
    MetodoPago: "PPD",
    Moneda: params.moneda ?? "MXN",
    TipoCambio: params.tipo_cambio ?? 1,
    EnviarCorreo: false,
    ...(params.observaciones ? { Observaciones: params.observaciones } : {}),
  };

  // Validar
  const validation = validateCfdiFactura(payload);
  if (!validation.success) {
    return { success: false, error: formatValidationErrors(validation.errors) };
  }

  // Timbrar
  const client = createFacturaComClient(params.credentials);
  let cfdiResponse: CfdiCreateResponse;
  try {
    cfdiResponse = await client.createCfdi(validation.data as unknown as Record<string, unknown>);
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error al timbrar en factura.com",
    };
  }

  // Calcular totales
  const subtotal = params.conceptos.reduce((acc, c) => acc + c.cantidad * c.valor_unitario, 0);
  const iva = params.conceptos.reduce((acc, c) => {
    const tasa = c.tasa_iva ?? 0.16;
    const obj = c.objeto_imp ?? "02";
    return acc + (obj === "02" ? c.cantidad * c.valor_unitario * tasa : 0);
  }, 0);
  const total = subtotal + iva;

  // Registrar en Supabase
  const supabase = getSupabaseAdmin();

  const { data: factura, error: insertError } = await supabase
    .from("billing_facturas")
    .insert({
      empresa_id: params.empresa_id,
      receptor_id: params.receptor_id,
      uuid: cfdiResponse.UUID ?? cfdiResponse.SAT?.UUID ?? null,
      uid_facturacom: cfdiResponse.uid ?? null,
      serie: cfdiResponse.INV?.Serie ?? String(params.serie_uid),
      folio: cfdiResponse.INV?.Folio ? String(cfdiResponse.INV.Folio) : null,
      fecha_emision: new Date().toISOString(),
      subtotal,
      iva,
      total,
      moneda: params.moneda ?? "MXN",
      metodo_pago: "PPD",
      forma_pago: "99",
      status: cfdiResponse.UUID ? "timbrada" : "borrador",
      status_pago: "pendiente",
      saldo_insoluto: total, // PPD: el saldo insoluto inicia en el total
    })
    .select()
    .single();

  if (insertError) {
    return {
      success: false,
      error: `CFDI timbrado (${cfdiResponse.uid}) pero error al guardar: ${insertError.message}`,
      cfdiResponse,
    };
  }

  // Insertar conceptos
  const conceptosFactura = params.conceptos.map((c) => ({
    factura_id: factura.id,
    concepto_id: c.concepto_id ?? null,
    clave_prod_serv: c.clave_prod_serv,
    clave_unidad: c.clave_unidad,
    descripcion: c.descripcion,
    cantidad: c.cantidad,
    precio_unitario: c.valor_unitario,
    tasa_iva: c.tasa_iva ?? 0.16,
    importe: c.cantidad * c.valor_unitario,
    importe_iva: c.cantidad * c.valor_unitario * (c.tasa_iva ?? 0.16),
  }));

  await supabase.from("billing_conceptos_factura").insert(conceptosFactura);

  // Registrar evento
  await supabase.from("billing_cfdi_eventos").insert({
    factura_id: factura.id,
    evento: cfdiResponse.UUID ? "timbrado" : "borrador_creado",
    descripcion: `CFDI PPD ${cfdiResponse.UUID ? "timbrado" : "borrador"} · Serie ${factura.serie} · Folio ${factura.folio} · Saldo pendiente: $${total.toFixed(2)}`,
    payload_response: JSON.parse(JSON.stringify(cfdiResponse)),
  });

  return {
    success: true,
    factura: {
      id: factura.id,
      uuid: factura.uuid,
      uid_facturacom: factura.uid_facturacom,
      serie: factura.serie,
      folio: factura.folio,
      total: factura.total,
      status: factura.status,
    },
    cfdiResponse,
  };
}

// ---------------------------------------------------------------------------
// Orden 28 — Crear Complemento de Pago REP v2.0
// ---------------------------------------------------------------------------

export interface CreateRepParams {
  empresa_id: string;
  /** ID de la factura PPD en billing_facturas */
  factura_ppd_id: string;
  /** UID hex del receptor en factura.com */
  receptor_uid: string;
  /** UID numérico de la serie de pagos en factura.com */
  serie_pago_uid: number;
  /** Forma de pago real: "03" transferencia, "01" efectivo, etc. */
  forma_pago: string;
  /** Fecha del pago (ISO 8601) */
  fecha_pago: string;
  /** Monto del pago */
  monto: number;
  /** Moneda del pago (default MXN) */
  moneda_pago?: string;
  /** Referencia bancaria del pago (opcional) */
  referencia?: string;
  credentials: FacturaComCredentials;
}

/**
 * Crea y timbra un Complemento de Pago (REP) v2.0 para una factura PPD.
 *
 * Flujo:
 * 1. Leer factura PPD de Supabase (UUID, saldo, parcialidad actual)
 * 2. Calcular NumParcialidad, ImpSaldoAnt, ImpPagado, ImpSaldoInsoluto
 * 3. Construir payload REP con concepto fijo SAT
 * 4. Validar con Zod (CfdiRepSchema)
 * 5. Timbrar en factura.com
 * 6. Insertar en billing_pagos
 * 7. Actualizar billing_facturas (monto_pagado_acumulado, saldo_insoluto, status_pago)
 *
 * Reglas SAT:
 * - Moneda del comprobante REP = "XXX" siempre
 * - MonedaP = moneda real del pago
 * - Concepto fijo: ClaveProdServ 84111506, ClaveUnidad ACT, ValorUnitario 0
 * - "Trasaldos" con esa ortografía (es de factura.com, no es typo)
 */
export async function createCfdiRep(params: CreateRepParams): Promise<TimbradoResult> {
  const {
    empresa_id,
    factura_ppd_id,
    receptor_uid,
    serie_pago_uid,
    forma_pago,
    fecha_pago,
    monto,
    moneda_pago = "MXN",
    referencia,
    credentials,
  } = params;

  const supabase = getSupabaseAdmin();

  // 1. Leer factura PPD
  const { data: facturaPpd, error: errFactura } = await supabase
    .from("billing_facturas")
    .select("id, uuid, total, saldo_insoluto, monto_pagado_acumulado, moneda, metodo_pago")
    .eq("id", factura_ppd_id)
    .single();

  if (errFactura || !facturaPpd) {
    return { success: false, error: "Factura PPD no encontrada" };
  }

  if (facturaPpd.metodo_pago !== "PPD") {
    return { success: false, error: "La factura no es de tipo PPD — no aplica REP" };
  }

  if (!facturaPpd.uuid) {
    return { success: false, error: "La factura PPD no tiene UUID SAT — debe estar timbrada" };
  }

  // 2. Calcular parcialidad
  const { count: pagosAnteriores } = await supabase
    .from("billing_pagos")
    .select("id", { count: "exact", head: true })
    .eq("factura_id", factura_ppd_id);

  const numParcialidad = (pagosAnteriores ?? 0) + 1;
  const saldoAnterior = facturaPpd.saldo_insoluto ?? facturaPpd.total;
  const saldoInsoluto = Math.max(0, saldoAnterior - monto);

  // 3. Construir payload REP
  const payload: Record<string, unknown> = {
    Receptor: { UID: receptor_uid },
    TipoCfdi: "pago",
    UsoCFDI: "CP01",
    Serie: serie_pago_uid,
    Moneda: "XXX", // Siempre XXX en el comprobante REP
    FormaPago: forma_pago,
    MetodoPago: "PPD",
    EnviarCorreo: false,
    Conceptos: [
      {
        ClaveProdServ: conceptoRepFijo.ClaveProdServ,
        Cantidad: conceptoRepFijo.Cantidad,
        ClaveUnidad: conceptoRepFijo.ClaveUnidad,
        Descripcion: conceptoRepFijo.Descripcion,
        ValorUnitario: conceptoRepFijo.ValorUnitario,
        Importe: 0,
      },
    ],
    Pagos: [
      {
        FechaPago: fecha_pago,
        FormaDePagoP: forma_pago,
        MonedaP: moneda_pago,
        TipoCambioP: moneda_pago === "MXN" ? 0 : 1,
        Monto: monto.toFixed(2),
        DoctoRelacionado: [
          {
            IdDocumento: facturaPpd.uuid,
            MonedaDR: facturaPpd.moneda,
            EquivalenciaDR: 1,
            NumParcialidad: numParcialidad,
            ImpSaldoAnt: saldoAnterior.toFixed(2),
            ImpPagado: monto.toFixed(2),
            ImpSaldoInsoluto: saldoInsoluto.toFixed(2),
            ObjetoImpuesto: "02",
            MetodoDePagoDR: "PPD" as const,
          },
        ],
      },
    ],
  };

  // 4. Validar
  const validation = validateCfdiRep(payload);
  if (!validation.success) {
    return { success: false, error: formatValidationErrors(validation.errors) };
  }

  // 5. Timbrar
  const client = createFacturaComClient(credentials);
  let cfdiResponse: CfdiCreateResponse;
  try {
    cfdiResponse = await client.createCfdi(validation.data as unknown as Record<string, unknown>);
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error al timbrar REP en factura.com",
    };
  }

  // 6. Insertar pago en billing_pagos
  const { data: pago, error: pagoError } = await supabase
    .from("billing_pagos")
    .insert({
      factura_id: factura_ppd_id,
      fecha_pago,
      forma_pago,
      monto,
      num_parcialidad: numParcialidad,
      saldo_anterior: saldoAnterior,
      saldo_insoluto: saldoInsoluto,
      referencia: referencia ?? null,
      uuid_sat_rep: cfdiResponse.UUID ?? cfdiResponse.SAT?.UUID ?? null,
      status: cfdiResponse.UUID ? "timbrado" : "pendiente",
    })
    .select()
    .single();

  if (pagoError) {
    return {
      success: false,
      error: `REP timbrado (${cfdiResponse.uid}) pero error al guardar pago: ${pagoError.message}`,
      cfdiResponse,
    };
  }

  // 7. Actualizar factura PPD
  const nuevoMontoPagado = (facturaPpd.monto_pagado_acumulado ?? 0) + monto;
  const nuevaStatusPago = saldoInsoluto <= 0.01 ? "pagada" : "parcial";

  await supabase
    .from("billing_facturas")
    .update({
      monto_pagado_acumulado: nuevoMontoPagado,
      saldo_insoluto: saldoInsoluto,
      status_pago: nuevaStatusPago,
    })
    .eq("id", factura_ppd_id);

  // Registrar evento en la factura PPD
  await supabase.from("billing_cfdi_eventos").insert({
    factura_id: factura_ppd_id,
    evento: "pago_registrado",
    descripcion: `REP parcialidad ${numParcialidad} · $${monto.toFixed(2)} · Saldo: $${saldoInsoluto.toFixed(2)} · UUID REP: ${cfdiResponse.UUID ?? "borrador"}`,
    payload_response: JSON.parse(JSON.stringify(cfdiResponse)),
  });

  return {
    success: true,
    pago: {
      id: pago.id,
      uuid_sat_rep: pago.uuid_sat_rep,
      num_parcialidad: pago.num_parcialidad,
      monto: pago.monto,
      saldo_insoluto: pago.saldo_insoluto,
    },
    cfdiResponse,
  };
}

// ---------------------------------------------------------------------------
// Orden 29 — Crear CFDI Global (factura al público en general)
// ---------------------------------------------------------------------------

/**
 * Periodicidad SAT para InformacionGlobal:
 * 01=Diario, 02=Semanal, 03=Quincenal, 04=Mensual, 05=Bimestral
 */
export type Periodicidad = "01" | "02" | "03" | "04" | "05";

export interface CreateGlobalParams {
  empresa_id: string;
  /** UID hex de XAXX010101000 en factura.com */
  receptor_uid: string;
  /** UID numérico de la serie en factura.com */
  serie_uid: number;
  conceptos: ConceptoInput[];
  forma_pago: string;
  moneda?: string;
  /** Periodicidad SAT: 01=Diario, 02=Semanal, 03=Quincenal, 04=Mensual, 05=Bimestral */
  periodicidad: Periodicidad;
  /** Mes(es) que cubre: "01"-"12" o "13"-"18" para bimestres */
  meses: string;
  /** Año fiscal */
  anio: number;
  observaciones?: string;
  credentials: FacturaComCredentials;
}

/**
 * Crea y timbra un CFDI Global (facturas al público en general).
 *
 * Reglas SAT para CFDI Global:
 * - RFC receptor: XAXX010101000
 * - Régimen receptor: 616 (Sin obligaciones fiscales)
 * - UsoCFDI: S01 (Sin efectos fiscales)
 * - MetodoPago: PUE
 * - Requiere nodo InformacionGlobal con Periodicidad, Meses y Año
 * - FormaPago según cómo pagaron los clientes del periodo
 */
export async function createCfdiGlobal(params: CreateGlobalParams): Promise<TimbradoResult> {
  const {
    empresa_id,
    receptor_uid,
    serie_uid,
    conceptos,
    forma_pago,
    moneda = "MXN",
    periodicidad,
    meses,
    anio,
    observaciones,
    credentials,
  } = params;

  // Construir conceptos
  const conceptosPayload = conceptos.map((c) => {
    const tasaIva = c.tasa_iva ?? 0.16;
    const objetoImp = c.objeto_imp ?? "02";
    const base = c.cantidad * c.valor_unitario;

    return {
      ClaveProdServ: c.clave_prod_serv,
      Cantidad: c.cantidad,
      ClaveUnidad: c.clave_unidad,
      Descripcion: c.descripcion,
      ValorUnitario: c.valor_unitario,
      ObjetoImp: objetoImp,
      ...(objetoImp === "02"
        ? {
            Impuestos: {
              Traslados: [
                {
                  Base: parseFloat(base.toFixed(6)),
                  Impuesto: "002",
                  TipoFactor: "Tasa" as const,
                  TasaOCuota: tasaIva.toFixed(6),
                  Importe: parseFloat((base * tasaIva).toFixed(6)),
                },
              ],
            },
          }
        : {}),
    };
  });

  // Payload con InformacionGlobal — campo específico de CFDI Global
  const payload: Record<string, unknown> = {
    Receptor: { UID: receptor_uid },
    TipoDocumento: "factura",
    Conceptos: conceptosPayload,
    UsoCFDI: "S01", // Siempre S01 para público en general
    Serie: serie_uid,
    FormaPago: forma_pago,
    MetodoPago: "PUE",
    Moneda: moneda,
    EnviarCorreo: false,
    InformacionGlobal: {
      Periodicidad: periodicidad,
      Meses: meses,
      Año: anio,
    },
    ...(observaciones ? { Observaciones: observaciones } : {}),
  };

  // Validar con el schema de factura ordinaria (CFDI Global usa el mismo tipo base)
  const validation = validateCfdiFactura(payload);
  if (!validation.success) {
    return { success: false, error: formatValidationErrors(validation.errors) };
  }

  // Timbrar — enviamos el payload original (no el validado) porque InformacionGlobal
  // no está en el Zod schema pero factura.com sí lo necesita
  const client = createFacturaComClient(credentials);
  let cfdiResponse: CfdiCreateResponse;
  try {
    cfdiResponse = await client.createCfdi(payload);
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error al timbrar CFDI Global en factura.com",
    };
  }

  // Calcular totales
  const subtotal = conceptos.reduce((acc, c) => acc + c.cantidad * c.valor_unitario, 0);
  const iva = conceptos.reduce((acc, c) => {
    const tasa = c.tasa_iva ?? 0.16;
    const obj = c.objeto_imp ?? "02";
    return acc + (obj === "02" ? c.cantidad * c.valor_unitario * tasa : 0);
  }, 0);
  const total = subtotal + iva;

  // Registrar en Supabase
  const supabase = getSupabaseAdmin();

  const { data: factura, error: insertError } = await supabase
    .from("billing_facturas")
    .insert({
      empresa_id,
      receptor_id: "", // CFDI Global no tiene receptor individual
      uuid: cfdiResponse.UUID ?? cfdiResponse.SAT?.UUID ?? null,
      uid_facturacom: cfdiResponse.uid ?? null,
      serie: cfdiResponse.INV?.Serie ?? String(serie_uid),
      folio: cfdiResponse.INV?.Folio ? String(cfdiResponse.INV.Folio) : null,
      fecha_emision: new Date().toISOString(),
      subtotal,
      iva,
      total,
      moneda,
      metodo_pago: "PUE",
      forma_pago,
      status: cfdiResponse.UUID ? "timbrada" : "borrador",
      status_pago: "pagada",
      notas_internas: `CFDI Global · Periodicidad ${periodicidad} · Meses ${meses} · Año ${anio}`,
    })
    .select()
    .single();

  if (insertError) {
    return {
      success: false,
      error: `CFDI Global timbrado (${cfdiResponse.uid}) pero error al guardar: ${insertError.message}`,
      cfdiResponse,
    };
  }

  // Insertar conceptos
  const conceptosFactura = conceptos.map((c) => ({
    factura_id: factura.id,
    concepto_id: c.concepto_id ?? null,
    clave_prod_serv: c.clave_prod_serv,
    clave_unidad: c.clave_unidad,
    descripcion: c.descripcion,
    cantidad: c.cantidad,
    precio_unitario: c.valor_unitario,
    tasa_iva: c.tasa_iva ?? 0.16,
    importe: c.cantidad * c.valor_unitario,
    importe_iva: c.cantidad * c.valor_unitario * (c.tasa_iva ?? 0.16),
  }));

  await supabase.from("billing_conceptos_factura").insert(conceptosFactura);

  // Registrar evento
  await supabase.from("billing_cfdi_eventos").insert({
    factura_id: factura.id,
    evento: cfdiResponse.UUID ? "timbrado" : "borrador_creado",
    descripcion: `CFDI Global ${cfdiResponse.UUID ? "timbrado" : "borrador"} · Periodicidad ${periodicidad} · Meses ${meses}/${anio}`,
    payload_response: JSON.parse(JSON.stringify(cfdiResponse)),
  });

  return {
    success: true,
    factura: {
      id: factura.id,
      uuid: factura.uuid,
      uid_facturacom: factura.uid_facturacom,
      serie: factura.serie,
      folio: factura.folio,
      total: factura.total,
      status: factura.status,
    },
    cfdiResponse,
  };
}
