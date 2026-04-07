/**
 * @file lib/claude/client.ts
 * @description Cliente para Claude API usando @anthropic-ai/sdk.
 *
 * Funciones especializadas:
 * - interpretarInstruccion() → texto NL → JSON CFDI
 * - extraerConstanciaFiscal() → PDF → datos fiscales
 * - extraerComprobanteBancario() → PDF → datos de pago (para REP)
 *
 * Modelo: claude-sonnet-4-6 (balance entre precisión y costo)
 */

import Anthropic from "@anthropic-ai/sdk";
import {
  getFacturaInterpreterPrompt,
  CONSTANCIA_FISCAL_PROMPT,
  COMPROBANTE_BANCARIO_PROMPT,
} from "./prompts/factura-interpreter";
import type { FacturaInstruccion } from "@/lib/telegram/types";

// ---------------------------------------------------------------------------
// Configuración
// ---------------------------------------------------------------------------

const CLAUDE_MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 1024;

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY no está configurado en las variables de entorno");
  }
  return new Anthropic({ apiKey });
}

// ---------------------------------------------------------------------------
// Helper: parsear JSON de la respuesta de Claude
// ---------------------------------------------------------------------------

function parseClaudeJson<T>(responseText: string): T {
  // Limpiar por si llega con backticks markdown
  const clean = responseText.replace(/```json\s*|```\s*/g, "").trim();
  return JSON.parse(clean) as T;
}

// ---------------------------------------------------------------------------
// Interpretar instrucción de factura (texto NL → JSON CFDI)
// ---------------------------------------------------------------------------

export interface InterpretarResult {
  success: boolean;
  data?: FacturaInstruccion;
  error?: string;
  rawResponse?: string;
}

/**
 * Envía un mensaje de texto libre a Claude para extraer campos CFDI.
 *
 * @param mensaje - Texto del operador desde Telegram
 * @param empresasDisponibles - Lista de nombres de empresas emisoras para contexto
 */
export async function interpretarInstruccion(
  mensaje: string,
  empresasDisponibles: string[]
): Promise<InterpretarResult> {
  const client = getClient();

  try {
    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: MAX_TOKENS,
      system: getFacturaInterpreterPrompt(empresasDisponibles),
      messages: [
        { role: "user", content: mensaje },
      ],
    });

    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";

    const data = parseClaudeJson<FacturaInstruccion>(responseText);

    return { success: true, data, rawResponse: responseText };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error al interpretar instrucción con Claude",
    };
  }
}

// ---------------------------------------------------------------------------
// Extraer datos de constancia de situación fiscal (PDF)
// ---------------------------------------------------------------------------

export interface ConstanciaFiscalData {
  rfc: string | null;
  razon_social: string | null;
  regimen_fiscal: string | null;
  nombre_regimen: string | null;
  cp_fiscal: string | null;
  estado: string | null;
  municipio: string | null;
  colonia: string | null;
  calle: string | null;
  fecha_inicio_operaciones: string | null;
  estatus: string | null;
}

export interface ExtraerConstanciaResult {
  success: boolean;
  data?: ConstanciaFiscalData;
  error?: string;
}

/**
 * Envía un PDF de constancia de situación fiscal a Claude para extraer datos.
 *
 * @param pdfBuffer - Buffer del archivo PDF
 */
export async function extraerConstanciaFiscal(
  pdfBuffer: Buffer
): Promise<ExtraerConstanciaResult> {
  const client = getClient();

  try {
    const base64 = pdfBuffer.toString("base64");

    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: MAX_TOKENS,
      system: CONSTANCIA_FISCAL_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: base64,
              },
            },
            {
              type: "text",
              text: "Extrae los datos fiscales de este documento.",
            },
          ],
        },
      ],
    });

    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";

    const data = parseClaudeJson<ConstanciaFiscalData>(responseText);

    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error al extraer datos de constancia fiscal",
    };
  }
}

// ---------------------------------------------------------------------------
// Extraer datos de comprobante bancario (PDF para REP)
// ---------------------------------------------------------------------------

export interface ComprobanteBancarioData {
  fecha_pago: string | null;
  monto: number | null;
  moneda: string | null;
  banco_origen: string | null;
  cuenta_origen: string | null;
  banco_destino: string | null;
  cuenta_destino: string | null;
  referencia: string | null;
  concepto: string | null;
  nombre_ordenante: string | null;
}

export interface ExtraerComprobanteResult {
  success: boolean;
  data?: ComprobanteBancarioData;
  error?: string;
}

/**
 * Envía un PDF de comprobante bancario a Claude para extraer datos de pago.
 *
 * @param pdfBuffer - Buffer del archivo PDF
 */
export async function extraerComprobanteBancario(
  pdfBuffer: Buffer
): Promise<ExtraerComprobanteResult> {
  const client = getClient();

  try {
    const base64 = pdfBuffer.toString("base64");

    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: MAX_TOKENS,
      system: COMPROBANTE_BANCARIO_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: base64,
              },
            },
            {
              type: "text",
              text: "Extrae los datos del comprobante de pago.",
            },
          ],
        },
      ],
    });

    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";

    const data = parseClaudeJson<ComprobanteBancarioData>(responseText);

    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error al extraer datos del comprobante bancario",
    };
  }
}
