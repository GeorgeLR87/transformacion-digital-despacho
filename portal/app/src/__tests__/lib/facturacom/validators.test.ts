/**
 * @file __tests__/lib/facturacom/validators.test.ts
 * @description Tests de los schemas Zod para validación pre-timbrado de CFDIs.
 *
 * Estos tests son los más críticos del proyecto: un error aquí significa
 * un CFDI rechazado por el SAT o un folio desperdiciado en factura.com.
 */

import { describe, it, expect } from "vitest";
import {
  CfdiFacturaSchema,
  CfdiRepSchema,
  ConceptoSchema,
  ReceptorSchema,
  validateCfdiFactura,
  validateCfdiRep,
  formatValidationErrors,
  conceptoRepFijo,
} from "@/lib/facturacom/validators";

// ---------------------------------------------------------------------------
// Fixtures — datos de prueba reutilizables
// ---------------------------------------------------------------------------

/** Concepto válido mínimo */
const conceptoValido = {
  ClaveProdServ: "84111506",
  Cantidad: 1,
  ClaveUnidad: "E48",
  Descripcion: "Servicios de consultoría contable",
  ValorUnitario: 5000,
  ObjetoImp: "02" as const,
  Impuestos: {
    Traslados: [
      {
        Base: 5000,
        Impuesto: "002" as const,
        TipoFactor: "Tasa" as const,
        TasaOCuota: "0.160000",
        Importe: 800,
      },
    ],
  },
};

/** Factura PUE válida mínima */
const facturaPueValida = {
  Receptor: { UID: "abc123hex" },
  TipoDocumento: "factura" as const,
  Conceptos: [conceptoValido],
  UsoCFDI: "G03" as const,
  Serie: 12345,
  FormaPago: "03" as const,
  MetodoPago: "PUE" as const,
  Moneda: "MXN",
};

/** REP (Complemento de Pago) válido mínimo */
const repValido = {
  Receptor: { UID: "receptor123" },
  TipoCfdi: "pago" as const,
  UsoCFDI: "CP01" as const,
  Serie: 67890,
  Moneda: "XXX" as const,
  FormaPago: "03" as const,
  MetodoPago: "PPD" as const,
  Pagos: [
    {
      FechaPago: "2026-03-17T10:00:00Z",
      FormaDePagoP: "03" as const,
      MonedaP: "MXN",
      Monto: "15000.00",
      DoctoRelacionado: [
        {
          IdDocumento: "550e8400-e29b-41d4-a716-446655440000",
          MonedaDR: "MXN",
          NumParcialidad: 1,
          ImpSaldoAnt: "15000.00",
          ImpPagado: "15000.00",
          ImpSaldoInsoluto: "0.00",
          ObjetoImpuesto: "02" as const,
          MetodoDePagoDR: "PPD" as const,
        },
      ],
    },
  ],
};

// ===========================================================================
// ReceptorSchema
// ===========================================================================

describe("ReceptorSchema", () => {
  it("debería aceptar un receptor con solo UID", () => {
    const result = ReceptorSchema.safeParse({ UID: "abc123" });
    expect(result.success).toBe(true);
  });

  it("debería aceptar un receptor completo con RFC y CP", () => {
    const result = ReceptorSchema.safeParse({
      UID: "abc123",
      RFC: "XAXX010101000",
      CP: "50000",
    });
    expect(result.success).toBe(true);
  });

  it("debería rechazar un receptor sin UID", () => {
    const result = ReceptorSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("debería rechazar un receptor con UID vacío", () => {
    const result = ReceptorSchema.safeParse({ UID: "" });
    expect(result.success).toBe(false);
  });

  it("debería aceptar RFC de persona moral (12 caracteres)", () => {
    const result = ReceptorSchema.safeParse({
      UID: "abc",
      RFC: "ABC010101AB1",
    });
    expect(result.success).toBe(true);
  });

  it("debería aceptar RFC de persona física (13 caracteres)", () => {
    const result = ReceptorSchema.safeParse({
      UID: "abc",
      RFC: "GARA850101HM1",
    });
    expect(result.success).toBe(true);
  });

  it("debería aceptar RFC genérico extranjero (XEXX)", () => {
    const result = ReceptorSchema.safeParse({
      UID: "abc",
      RFC: "XEXX010101000",
    });
    expect(result.success).toBe(true);
  });

  it("debería aceptar RFC genérico público en general (XAXX)", () => {
    const result = ReceptorSchema.safeParse({
      UID: "abc",
      RFC: "XAXX010101000",
    });
    expect(result.success).toBe(true);
  });

  it("debería rechazar RFC con formato inválido", () => {
    const result = ReceptorSchema.safeParse({
      UID: "abc",
      RFC: "INVALIDO",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar código postal que no sea de 5 dígitos", () => {
    const result = ReceptorSchema.safeParse({
      UID: "abc",
      CP: "1234",
    });
    expect(result.success).toBe(false);
  });
});

// ===========================================================================
// ConceptoSchema
// ===========================================================================

describe("ConceptoSchema", () => {
  it("debería aceptar un concepto válido completo", () => {
    const result = ConceptoSchema.safeParse(conceptoValido);
    expect(result.success).toBe(true);
  });

  it("debería aceptar un concepto sin impuestos (ObjetoImp 01)", () => {
    const result = ConceptoSchema.safeParse({
      ClaveProdServ: "84111506",
      Cantidad: 1,
      ClaveUnidad: "E48",
      Descripcion: "Servicio no gravado",
      ValorUnitario: 1000,
      ObjetoImp: "01",
    });
    expect(result.success).toBe(true);
  });

  it("debería rechazar ClaveProdServ que no sea de 8 dígitos", () => {
    const result = ConceptoSchema.safeParse({
      ...conceptoValido,
      ClaveProdServ: "1234",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar ClaveProdServ vacía", () => {
    const result = ConceptoSchema.safeParse({
      ...conceptoValido,
      ClaveProdServ: "",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar Cantidad negativa", () => {
    const result = ConceptoSchema.safeParse({
      ...conceptoValido,
      Cantidad: -1,
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar Cantidad con más de 4 decimales", () => {
    const result = ConceptoSchema.safeParse({
      ...conceptoValido,
      Cantidad: 1.00001,
    });
    expect(result.success).toBe(false);
  });

  it("debería aceptar Cantidad con hasta 4 decimales", () => {
    const result = ConceptoSchema.safeParse({
      ...conceptoValido,
      Cantidad: 1.5001,
    });
    expect(result.success).toBe(true);
  });

  it("debería rechazar ValorUnitario igual a 0", () => {
    const result = ConceptoSchema.safeParse({
      ...conceptoValido,
      ValorUnitario: 0,
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar ValorUnitario negativo", () => {
    const result = ConceptoSchema.safeParse({
      ...conceptoValido,
      ValorUnitario: -100,
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar importe con más de 6 decimales (regla SAT)", () => {
    const result = ConceptoSchema.safeParse({
      ...conceptoValido,
      ValorUnitario: 100.0000001,
    });
    expect(result.success).toBe(false);
  });

  it("debería aceptar importe con hasta 6 decimales", () => {
    const result = ConceptoSchema.safeParse({
      ...conceptoValido,
      ValorUnitario: 100.000001,
    });
    expect(result.success).toBe(true);
  });

  it("debería rechazar Descripcion vacía", () => {
    const result = ConceptoSchema.safeParse({
      ...conceptoValido,
      Descripcion: "",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar Descripcion mayor a 1000 caracteres", () => {
    const result = ConceptoSchema.safeParse({
      ...conceptoValido,
      Descripcion: "A".repeat(1001),
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar ObjetoImp no válido en catálogo SAT", () => {
    const result = ConceptoSchema.safeParse({
      ...conceptoValido,
      ObjetoImp: "99",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar ClaveUnidad mayor a 3 caracteres", () => {
    const result = ConceptoSchema.safeParse({
      ...conceptoValido,
      ClaveUnidad: "ABCD",
    });
    expect(result.success).toBe(false);
  });

  describe("Impuestos - Traslados", () => {
    it("debería aceptar traslado IVA 16%", () => {
      const result = ConceptoSchema.safeParse(conceptoValido);
      expect(result.success).toBe(true);
    });

    it("debería rechazar TasaOCuota sin decimales", () => {
      const result = ConceptoSchema.safeParse({
        ...conceptoValido,
        Impuestos: {
          Traslados: [
            {
              Base: 1000,
              Impuesto: "002",
              TipoFactor: "Tasa",
              TasaOCuota: "16",
              Importe: 160,
            },
          ],
        },
      });
      expect(result.success).toBe(false);
    });

    it("debería rechazar impuesto no válido (fuera de 001-003)", () => {
      const result = ConceptoSchema.safeParse({
        ...conceptoValido,
        Impuestos: {
          Traslados: [
            {
              Base: 1000,
              Impuesto: "999",
              TipoFactor: "Tasa",
              TasaOCuota: "0.160000",
              Importe: 160,
            },
          ],
        },
      });
      expect(result.success).toBe(false);
    });

    it("debería aceptar TipoFactor Exento", () => {
      const result = ConceptoSchema.safeParse({
        ...conceptoValido,
        Impuestos: {
          Traslados: [
            {
              Base: 1000,
              Impuesto: "002",
              TipoFactor: "Exento",
              TasaOCuota: "0.000000",
              Importe: 0,
            },
          ],
        },
      });
      expect(result.success).toBe(true);
    });
  });
});

// ===========================================================================
// CfdiFacturaSchema — Factura ordinaria (PUE / PPD)
// ===========================================================================

describe("CfdiFacturaSchema", () => {
  it("debería aceptar una factura PUE válida completa", () => {
    const result = CfdiFacturaSchema.safeParse(facturaPueValida);
    expect(result.success).toBe(true);
  });

  it("debería aceptar una factura PPD válida", () => {
    const result = CfdiFacturaSchema.safeParse({
      ...facturaPueValida,
      MetodoPago: "PPD",
      FormaPago: "99",
    });
    expect(result.success).toBe(true);
  });

  it("debería aplicar defaults: EnviarCorreo=false, TipoCambio=1", () => {
    const result = CfdiFacturaSchema.safeParse(facturaPueValida);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.EnviarCorreo).toBe(false);
      expect(result.data.TipoCambio).toBe(1);
    }
  });

  it("debería rechazar TipoDocumento que no sea 'factura'", () => {
    const result = CfdiFacturaSchema.safeParse({
      ...facturaPueValida,
      TipoDocumento: "pago",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar sin conceptos", () => {
    const result = CfdiFacturaSchema.safeParse({
      ...facturaPueValida,
      Conceptos: [],
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar UsoCFDI no válido en catálogo SAT", () => {
    const result = CfdiFacturaSchema.safeParse({
      ...facturaPueValida,
      UsoCFDI: "Z99",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar Serie como string (debe ser número entero)", () => {
    const result = CfdiFacturaSchema.safeParse({
      ...facturaPueValida,
      Serie: "A",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar Serie decimal (debe ser entero)", () => {
    const result = CfdiFacturaSchema.safeParse({
      ...facturaPueValida,
      Serie: 123.45,
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar Serie negativa", () => {
    const result = CfdiFacturaSchema.safeParse({
      ...facturaPueValida,
      Serie: -1,
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar FormaPago no válida", () => {
    const result = CfdiFacturaSchema.safeParse({
      ...facturaPueValida,
      FormaPago: "50",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar MetodoPago que no sea PUE o PPD", () => {
    const result = CfdiFacturaSchema.safeParse({
      ...facturaPueValida,
      MetodoPago: "REP",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar Moneda con formato inválido", () => {
    const result = CfdiFacturaSchema.safeParse({
      ...facturaPueValida,
      Moneda: "pesos",
    });
    expect(result.success).toBe(false);
  });

  it("debería aceptar moneda USD con TipoCambio", () => {
    const result = CfdiFacturaSchema.safeParse({
      ...facturaPueValida,
      Moneda: "USD",
      TipoCambio: 17.5,
    });
    expect(result.success).toBe(true);
  });

  it("debería rechazar TipoCambio negativo", () => {
    const result = CfdiFacturaSchema.safeParse({
      ...facturaPueValida,
      TipoCambio: -1,
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar Fecha con formato no ISO 8601", () => {
    const result = CfdiFacturaSchema.safeParse({
      ...facturaPueValida,
      Fecha: "31/03/2026",
    });
    expect(result.success).toBe(false);
  });

  it("debería aceptar Fecha ISO 8601 válida", () => {
    const result = CfdiFacturaSchema.safeParse({
      ...facturaPueValida,
      Fecha: "2026-03-31T10:00:00Z",
    });
    expect(result.success).toBe(true);
  });

  it("debería rechazar Observaciones mayores a 500 caracteres", () => {
    const result = CfdiFacturaSchema.safeParse({
      ...facturaPueValida,
      Observaciones: "X".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  describe("Catálogo de formas de pago SAT", () => {
    const formasValidas = ["01", "02", "03", "04", "28", "99"];
    formasValidas.forEach((forma) => {
      it(`debería aceptar forma de pago ${forma}`, () => {
        const result = CfdiFacturaSchema.safeParse({
          ...facturaPueValida,
          FormaPago: forma,
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Catálogo de usos CFDI SAT", () => {
    const usosValidos = ["G01", "G03", "I01", "D01", "S01", "CP01", "CN01"];
    usosValidos.forEach((uso) => {
      it(`debería aceptar uso CFDI ${uso}`, () => {
        const result = CfdiFacturaSchema.safeParse({
          ...facturaPueValida,
          UsoCFDI: uso,
        });
        expect(result.success).toBe(true);
      });
    });
  });
});

// ===========================================================================
// CfdiRepSchema — Complemento de Pago v2.0
// ===========================================================================

describe("CfdiRepSchema", () => {
  it("debería aceptar un REP válido completo", () => {
    const result = CfdiRepSchema.safeParse(repValido);
    expect(result.success).toBe(true);
  });

  it("debería rechazar Moneda que no sea XXX (norma SAT para REP)", () => {
    const result = CfdiRepSchema.safeParse({
      ...repValido,
      Moneda: "MXN",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar UsoCFDI que no sea CP01 para REP", () => {
    const result = CfdiRepSchema.safeParse({
      ...repValido,
      UsoCFDI: "G03",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar TipoCfdi que no sea 'pago'", () => {
    const result = CfdiRepSchema.safeParse({
      ...repValido,
      TipoCfdi: "factura",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar MetodoPago que no sea PPD", () => {
    const result = CfdiRepSchema.safeParse({
      ...repValido,
      MetodoPago: "PUE",
    });
    expect(result.success).toBe(false);
  });

  it("debería rechazar sin Pagos", () => {
    const result = CfdiRepSchema.safeParse({
      ...repValido,
      Pagos: [],
    });
    expect(result.success).toBe(false);
  });

  it("debería aceptar Serie como string numérico en REP", () => {
    const result = CfdiRepSchema.safeParse({
      ...repValido,
      Serie: "67890",
    });
    expect(result.success).toBe(true);
  });

  it("debería aplicar default: EnviarCorreo=false", () => {
    const result = CfdiRepSchema.safeParse(repValido);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.EnviarCorreo).toBe(false);
    }
  });

  describe("Pagos", () => {
    it("debería rechazar FechaPago con formato no ISO", () => {
      const result = CfdiRepSchema.safeParse({
        ...repValido,
        Pagos: [
          {
            ...repValido.Pagos[0],
            FechaPago: "17/03/2026",
          },
        ],
      });
      expect(result.success).toBe(false);
    });

    it("debería rechazar Monto sin exactamente 2 decimales", () => {
      const result = CfdiRepSchema.safeParse({
        ...repValido,
        Pagos: [
          {
            ...repValido.Pagos[0],
            Monto: "15000",
          },
        ],
      });
      expect(result.success).toBe(false);
    });

    it("debería aceptar Monto con 2 decimales", () => {
      const result = CfdiRepSchema.safeParse({
        ...repValido,
        Pagos: [
          {
            ...repValido.Pagos[0],
            Monto: "7500.50",
          },
        ],
      });
      expect(result.success).toBe(true);
    });

    it("debería rechazar DoctoRelacionado vacío", () => {
      const result = CfdiRepSchema.safeParse({
        ...repValido,
        Pagos: [
          {
            ...repValido.Pagos[0],
            DoctoRelacionado: [],
          },
        ],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("DoctoRelacionado", () => {
    const docto = repValido.Pagos[0].DoctoRelacionado[0];

    it("debería rechazar IdDocumento que no sea UUID", () => {
      const result = CfdiRepSchema.safeParse({
        ...repValido,
        Pagos: [
          {
            ...repValido.Pagos[0],
            DoctoRelacionado: [
              { ...docto, IdDocumento: "no-es-uuid" },
            ],
          },
        ],
      });
      expect(result.success).toBe(false);
    });

    it("debería rechazar ImpSaldoAnt sin 2 decimales exactos", () => {
      const result = CfdiRepSchema.safeParse({
        ...repValido,
        Pagos: [
          {
            ...repValido.Pagos[0],
            DoctoRelacionado: [
              { ...docto, ImpSaldoAnt: "15000.5" },
            ],
          },
        ],
      });
      expect(result.success).toBe(false);
    });

    it("debería rechazar MetodoDePagoDR que no sea PPD", () => {
      const result = CfdiRepSchema.safeParse({
        ...repValido,
        Pagos: [
          {
            ...repValido.Pagos[0],
            DoctoRelacionado: [
              { ...docto, MetodoDePagoDR: "PUE" },
            ],
          },
        ],
      });
      expect(result.success).toBe(false);
    });

    it("debería aceptar NumParcialidad como string numérico", () => {
      const result = CfdiRepSchema.safeParse({
        ...repValido,
        Pagos: [
          {
            ...repValido.Pagos[0],
            DoctoRelacionado: [
              { ...docto, NumParcialidad: "2" },
            ],
          },
        ],
      });
      expect(result.success).toBe(true);
    });
  });
});

// ===========================================================================
// Funciones helper de validación
// ===========================================================================

describe("validateCfdiFactura", () => {
  it("debería retornar success:true con datos válidos", () => {
    const result = validateCfdiFactura(facturaPueValida);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.TipoDocumento).toBe("factura");
    }
  });

  it("debería retornar success:false con datos inválidos", () => {
    const result = validateCfdiFactura({ TipoDocumento: "factura" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  it("debería retornar success:false con payload null", () => {
    const result = validateCfdiFactura(null);
    expect(result.success).toBe(false);
  });

  it("debería retornar success:false con payload undefined", () => {
    const result = validateCfdiFactura(undefined);
    expect(result.success).toBe(false);
  });
});

describe("validateCfdiRep", () => {
  it("debería retornar success:true con REP válido", () => {
    const result = validateCfdiRep(repValido);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.TipoCfdi).toBe("pago");
    }
  });

  it("debería retornar success:false con REP incompleto", () => {
    const result = validateCfdiRep({ TipoCfdi: "pago" });
    expect(result.success).toBe(false);
  });
});

describe("formatValidationErrors", () => {
  it("debería formatear errores Zod en string legible", () => {
    const result = validateCfdiFactura({});
    if (!result.success) {
      const formatted = formatValidationErrors(result.errors);
      expect(typeof formatted).toBe("string");
      expect(formatted.length).toBeGreaterThan(0);
      // Debe usar · como separador
      expect(formatted).toContain("·");
    }
  });

  it("debería incluir la ruta del campo en el mensaje", () => {
    const result = validateCfdiFactura({
      ...facturaPueValida,
      Receptor: { UID: "" },
    });
    if (!result.success) {
      const formatted = formatValidationErrors(result.errors);
      expect(formatted).toContain("Receptor");
    }
  });

  it("debería retornar string vacío con array vacío", () => {
    const formatted = formatValidationErrors([]);
    expect(formatted).toBe("");
  });
});

// ===========================================================================
// conceptoRepFijo — valores fijos SAT para REP
// ===========================================================================

describe("conceptoRepFijo", () => {
  it("debería tener ClaveProdServ 84111506 (exigido por SAT)", () => {
    expect(conceptoRepFijo.ClaveProdServ).toBe("84111506");
  });

  it("debería tener Cantidad 1", () => {
    expect(conceptoRepFijo.Cantidad).toBe(1);
  });

  it("debería tener ClaveUnidad ACT", () => {
    expect(conceptoRepFijo.ClaveUnidad).toBe("ACT");
  });

  it("debería tener Descripcion 'Pago'", () => {
    expect(conceptoRepFijo.Descripcion).toBe("Pago");
  });

  it("debería tener ValorUnitario 0", () => {
    expect(conceptoRepFijo.ValorUnitario).toBe(0);
  });

  it("debería tener ObjetoImp '01' (no objeto de impuesto)", () => {
    expect(conceptoRepFijo.ObjetoImp).toBe("01");
  });
});
