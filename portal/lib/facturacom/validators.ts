/**
 * @file lib/facturacom/validators.ts
 * @description Esquemas Zod para validación pre-timbrado de CFDIs.
 *
 * Se ejecutan ANTES de llamar a factura.com para detectar errores de datos
 * lo antes posible y evitar consumir folios del PAC con CFDIs inválidos.
 *
 * Reglas críticas:
 * - Serie = uid_facturacom INTEGER (no la letra) → validar z.number().int().positive()
 * - Receptor.UID = UID hex de factura.com (no el RFC) → validar string no vacío
 * - Impuestos: 6 decimales por disposición SAT
 * - TipoDocumento solo aplica a facturas ordinarias; REP usa TipoCfdi
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Helpers de validación
// ---------------------------------------------------------------------------

/** RFC válido (persona física 13 chars, moral 12 chars, XAXX/XEXX para extranjeros) */
const rfcSchema = z
  .string()
  .regex(/^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/, "RFC con formato inválido");

/** Código postal de 5 dígitos */
const cpSchema = z.string().regex(/^\d{5}$/, "Código postal debe tener 5 dígitos");

/** Moneda SAT — 3 letras mayúsculas (MXN, USD, EUR, XXX, etc.) */
const monedaSchema = z
  .string()
  .regex(/^[A-Z]{3}$/, "Moneda debe ser código ISO de 3 letras mayúsculas");

/** Importe con hasta 6 decimales (requisito SAT) */
const importeSchema = z
  .number()
  .nonnegative("El importe no puede ser negativo")
  .multipleOf(0.000001, "Máximo 6 decimales por disposición SAT");

// ---------------------------------------------------------------------------
// Catálogos SAT relevantes para este módulo
// (subconjunto — no el catálogo completo)
// ---------------------------------------------------------------------------

const FORMAS_PAGO_SAT = [
  "01", // Efectivo
  "02", // Cheque nominativo
  "03", // Transferencia electrónica de fondos
  "04", // Tarjeta de crédito
  "05", // Monedero electrónico
  "06", // Dinero electrónico
  "08", // Vales de despensa
  "12", // Dación en pago
  "13", // Pago por subrogación
  "14", // Pago por consignación
  "15", // Condonación
  "17", // Compensación
  "23", // Novación
  "24", // Confusión
  "25", // Remisión de deuda
  "26", // Prescripción o caducidad
  "27", // A satisfacción del acreedor
  "28", // Tarjeta de débito
  "29", // Tarjeta de servicios
  "30", // Aplicación de anticipos
  "31", // Intermediario pagos
  "99", // Por definir
] as const;

const USOS_CFDI_SAT = [
  "G01", // Adquisición de mercancias
  "G02", // Devoluciones, descuentos o bonificaciones
  "G03", // Gastos en general
  "I01", // Construcciones
  "I02", // Mobiliario y equipo de oficina
  "I03", // Equipo de transporte
  "I04", // Equipo de computo y accesorios
  "I05", // Dados, troqueles, moldes, matrices y herramental
  "I06", // Comunicaciones telefónicas
  "I07", // Comunicaciones satelitales
  "I08", // Otra maquinaria y equipo
  "D01", // Honorarios médicos, dentales y gastos hospitalarios
  "D02", // Gastos médicos por incapacidad o discapacidad
  "D03", // Gastos funerales
  "D04", // Donativos
  "D05", // Intereses reales efectivamente pagados por créditos hipotecarios
  "D06", // Aportaciones voluntarias al SAR
  "D07", // Primas por seguros de gastos médicos
  "D08", // Gastos de transportación escolar obligatoria
  "D09", // Depósitos en cuentas para el ahorro
  "D10", // Pagos por servicios educativos
  "S01", // Sin efectos fiscales
  "CP01", // Pagos (exclusivo para REP)
  "CN01", // Nómina
] as const;

const OBJETO_IMP_SAT = ["01", "02", "03", "04"] as const;
// 01: No objeto de impuesto
// 02: Sí objeto de impuesto (el más común)
// 03: Sí objeto de impuesto, no obligado a desglose
// 04: Sí objeto de impuesto, retención

// ---------------------------------------------------------------------------
// Sub-esquemas: Impuestos
// ---------------------------------------------------------------------------

const TrasladoSchema = z.object({
  Base: importeSchema,
  Impuesto: z.enum(["001", "002", "003"], {
    errorMap: () => ({ message: "Impuesto: 001=ISR, 002=IVA, 003=IEPS" }),
  }),
  TipoFactor: z.enum(["Tasa", "Cuota", "Exento"]),
  TasaOCuota: z
    .string()
    .regex(/^\d+\.\d{1,6}$/, "TasaOCuota debe tener hasta 6 decimales"),
  Importe: importeSchema,
});

const RetencionSchema = z.object({
  Base: importeSchema,
  Impuesto: z.enum(["001", "002", "003"]),
  TipoFactor: z.enum(["Tasa", "Cuota", "Exento"]),
  TasaOCuota: z.string().regex(/^\d+\.\d{1,6}$/),
  Importe: importeSchema,
});

const ImpuestosConceptoSchema = z.object({
  Traslados: z.array(TrasladoSchema).optional(),
  Retenciones: z.array(RetencionSchema).optional(),
});

// ---------------------------------------------------------------------------
// Sub-esquema: Concepto (línea de factura)
// ---------------------------------------------------------------------------

export const ConceptoSchema = z.object({
  ClaveProdServ: z
    .string()
    .min(1, "ClaveProdServ es requerida")
    .regex(/^\d{8}$/, "ClaveProdServ debe tener 8 dígitos del catálogo SAT"),
  NoIdentificacion: z.string().optional(),
  Cantidad: z
    .number()
    .positive("Cantidad debe ser mayor a 0")
    .multipleOf(0.0001, "Cantidad: máximo 4 decimales"),
  ClaveUnidad: z
    .string()
    .min(1, "ClaveUnidad es requerida")
    .max(3, "ClaveUnidad máximo 3 caracteres"),
  Unidad: z.string().optional(),
  Descripcion: z.string().min(1, "Descripcion es requerida").max(1000),
  ValorUnitario: importeSchema.refine((v) => v > 0, {
    message: "ValorUnitario debe ser mayor a 0",
  }),
  Descuento: importeSchema.optional(),
  ObjetoImp: z.enum(OBJETO_IMP_SAT, {
    errorMap: () => ({ message: "ObjetoImp inválido. Valores: 01-04" }),
  }),
  Impuestos: ImpuestosConceptoSchema.optional(),
});

export type IConcepto = z.infer<typeof ConceptoSchema>;

// ---------------------------------------------------------------------------
// Receptor
// ---------------------------------------------------------------------------

export const ReceptorSchema = z.object({
  /** UID hex interno de factura.com — obtenido de billing_receptores.uid_facturacom */
  UID: z.string().min(1, "Receptor.UID es requerido (UID hex de factura.com, no el RFC)"),
  // Los siguientes campos son informativos — factura.com los ignora si ya existe el cliente
  RFC: rfcSchema.optional(),
  CP: cpSchema.optional(),
  ResidenciaFiscal: z.string().length(3).optional(),
  NumRegIdTrib: z.string().optional(),
});

export type IReceptor = z.infer<typeof ReceptorSchema>;

// ---------------------------------------------------------------------------
// Schema principal: Factura ordinaria (TipoDocumento: "factura")
// ---------------------------------------------------------------------------

export const CfdiFacturaSchema = z.object({
  Receptor: ReceptorSchema,

  TipoDocumento: z.literal("factura"),

  Conceptos: z
    .array(ConceptoSchema)
    .min(1, "Se requiere al menos un concepto"),

  UsoCFDI: z.enum(USOS_CFDI_SAT, {
    errorMap: () => ({ message: "UsoCFDI no válido en el catálogo SAT" }),
  }),

  /**
   * UID numérico de la serie en factura.com.
   * Fuente: billing_series_emisoras.uid_facturacom (INTEGER).
   * NUNCA la letra — factura.com rechaza strings en este campo.
   */
  Serie: z
    .number()
    .int("Serie debe ser un entero")
    .positive("Serie debe ser el UID numérico de factura.com (positivo)"),

  FormaPago: z.enum(FORMAS_PAGO_SAT, {
    errorMap: () => ({ message: "FormaPago no válida en el catálogo SAT" }),
  }),

  MetodoPago: z.enum(["PUE", "PPD"], {
    errorMap: () => ({ message: "MetodoPago debe ser PUE o PPD" }),
  }),

  Moneda: monedaSchema,

  TipoCambio: z
    .number()
    .positive("TipoCambio debe ser positivo")
    .optional()
    .default(1),

  /** Siempre false — el despacho controla el envío desde N8N para tener trazabilidad */
  EnviarCorreo: z.boolean().optional().default(false),

  Fecha: z
    .string()
    .datetime({ message: "Fecha debe ser ISO 8601 (ej: 2026-03-31T10:00:00)" })
    .optional(),

  Observaciones: z.string().max(500).optional(),
});

export type ICfdiFactura = z.infer<typeof CfdiFacturaSchema>;

// ---------------------------------------------------------------------------
// Schema: Complemento de Pago v2.0 (REP)
// ---------------------------------------------------------------------------

const DoctoRelacionadoSchema = z.object({
  /** UUID SAT de la factura PPD original — billing_facturas.uuid */
  IdDocumento: z
    .string()
    .uuid("IdDocumento debe ser el UUID SAT de la factura PPD (formato UUID v4)"),
  MonedaDR: monedaSchema,
  EquivalenciaDR: z.number().positive().optional().default(1),
  NumParcialidad: z
    .number()
    .int()
    .min(1, "NumParcialidad debe ser al menos 1")
    .or(z.string().regex(/^\d+$/)),
  ImpSaldoAnt: z
    .string()
    .regex(/^\d+\.\d{2}$/, "ImpSaldoAnt debe tener 2 decimales"),
  ImpPagado: z
    .string()
    .regex(/^\d+\.\d{2}$/, "ImpPagado debe tener 2 decimales"),
  ImpSaldoInsoluto: z
    .string()
    .regex(/^\d+\.\d{2}$/, "ImpSaldoInsoluto debe tener 2 decimales"),
  ObjetoImpuesto: z.enum(OBJETO_IMP_SAT),
  MetodoDePagoDR: z.literal("PPD"),
  Impuestos: z
    .object({
      // Nota: factura.com usa "Trasaldos" con esa ortografía en su API
      Trasaldos: z.array(TrasladoSchema).optional(),
      Retenidos: z.array(RetencionSchema).optional(),
    })
    .optional(),
});

const PagoSchema = z.object({
  FechaPago: z
    .string()
    .datetime({ message: "FechaPago debe ser ISO 8601 (ej: 2026-03-17T10:00:00)" }),
  FormaDePagoP: z.enum(FORMAS_PAGO_SAT),
  MonedaP: monedaSchema,
  TipoCambioP: z.number().optional().default(0),
  Monto: z
    .string()
    .regex(/^\d+\.\d{2}$/, "Monto del pago debe tener exactamente 2 decimales"),
  DoctoRelacionado: z
    .array(DoctoRelacionadoSchema)
    .min(1, "Se requiere al menos un DoctoRelacionado"),
});

/** Concepto fijo que el SAT exige en todos los REP */
const conceptoRepFijo = {
  ClaveProdServ: "84111506",
  Cantidad: 1,
  ClaveUnidad: "ACT",
  Descripcion: "Pago",
  ValorUnitario: 0,
  ObjetoImp: "01" as const,
} satisfies Omit<IConcepto, "Impuestos" | "Descuento" | "Unidad" | "NoIdentificacion">;

export const CfdiRepSchema = z.object({
  Receptor: ReceptorSchema,

  TipoCfdi: z.literal("pago"),

  UsoCFDI: z.literal("CP01", {
    errorMap: () => ({ message: "UsoCFDI para REP debe ser CP01" }),
  }),

  /**
   * UID numérico de la serie de pago en factura.com.
   * Fuente: billing_series_emisoras.uid_facturacom donde tipo = 'pago'.
   */
  Serie: z
    .number()
    .int("Serie debe ser un entero")
    .positive("Serie debe ser el UID numérico de factura.com (positivo)")
    .or(z.string().regex(/^\d+$/, "Serie también puede ser string numérico para REP")),

  /** Siempre 'XXX' en el comprobante de pago — norma SAT */
  Moneda: z.literal("XXX", {
    errorMap: () => ({ message: "Moneda del comprobante de pago debe ser XXX (norma SAT)" }),
  }),

  FormaPago: z.enum(FORMAS_PAGO_SAT),
  MetodoPago: z.literal("PPD"),
  Redondeo: z.string().optional().default("2"),
  EnviarCorreo: z.boolean().optional().default(false),

  /** El nodo Conceptos va con valores fijos — se incluye para cumplir la estructura */
  Conceptos: z
    .array(z.object({ ClaveProdServ: z.string(), Cantidad: z.union([z.number(), z.string()]), ClaveUnidad: z.string(), Descripcion: z.string(), ValorUnitario: z.union([z.number(), z.string()]), Importe: z.union([z.number(), z.string()]).optional() }))
    .optional(),

  Pagos: z.array(PagoSchema).min(1, "Se requiere al menos un Pago"),
});

export type ICfdiRep = z.infer<typeof CfdiRepSchema>;

// ---------------------------------------------------------------------------
// Helpers de validación — uso desde route handlers y N8N
// ---------------------------------------------------------------------------

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: z.ZodIssue[] };

/**
 * Valida un payload de factura ordinaria antes de enviarlo a factura.com.
 * Retorna los datos parseados (con defaults aplicados) o los errores Zod.
 */
export function validateCfdiFactura(
  payload: unknown
): ValidationResult<ICfdiFactura> {
  const result = CfdiFacturaSchema.safeParse(payload);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error.issues };
}

/**
 * Valida un payload de Complemento de Pago (REP) antes de enviarlo a factura.com.
 */
export function validateCfdiRep(payload: unknown): ValidationResult<ICfdiRep> {
  const result = CfdiRepSchema.safeParse(payload);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error.issues };
}

/**
 * Formatea los errores Zod en un mensaje legible para Telegram/logs.
 * Ejemplo: "Receptor.UID: requerido · Serie: debe ser entero positivo"
 */
export function formatValidationErrors(issues: z.ZodIssue[]): string {
  return issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join(" · ");
}

/**
 * Exporta el concepto fijo para REP (uso en N8N / route handlers).
 * El SAT exige estos valores exactos en todos los Complementos de Pago.
 */
export { conceptoRepFijo };
