/**
 * @file lib/claude/index.ts
 * @description Re-exports del módulo Claude API
 */

export {
  interpretarInstruccion,
  extraerConstanciaFiscal,
  extraerComprobanteBancario,
  type InterpretarResult,
  type ConstanciaFiscalData,
  type ExtraerConstanciaResult,
  type ComprobanteBancarioData,
  type ExtraerComprobanteResult,
} from "./client";

export {
  getFacturaInterpreterPrompt,
  CONSTANCIA_FISCAL_PROMPT,
  COMPROBANTE_BANCARIO_PROMPT,
} from "./prompts/factura-interpreter";
