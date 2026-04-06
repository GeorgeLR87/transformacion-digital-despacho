/**
 * @file lib/api/helpers.ts
 * @description Utilidades compartidas para todos los Route Handlers del dashboard.
 *
 * Patrón de uso en cada route:
 *   const user = await requireAuth()
 *   // ... lógica ...
 *   return apiSuccess(data)
 *
 * Para operaciones con factura.com:
 *   const creds = await getFacturaComCredentials(empresaId)
 *   const client = createFacturaComClient(creds)
 */

import { createClient, createAdminClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Tipos de respuesta estándar (convención del proyecto)
// ---------------------------------------------------------------------------

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ---------------------------------------------------------------------------
// Respuestas formateadas
// ---------------------------------------------------------------------------

/** Respuesta exitosa con formato estándar { success, data, meta } */
export function apiSuccess<T>(data: T, meta?: Record<string, unknown>): Response {
  const body: ApiSuccessResponse<T> = { success: true, data };
  if (meta) body.meta = meta;
  return Response.json(body);
}

/** Respuesta de error con formato estándar { success, error } */
export function apiError(message: string, status: number, code?: string): Response {
  const body: ApiErrorResponse = {
    success: false,
    error: { message, ...(code ? { code } : {}) },
  };
  return Response.json(body, { status });
}

// ---------------------------------------------------------------------------
// Autenticación — verificar sesión del usuario
// ---------------------------------------------------------------------------

/**
 * Verifica que el request tenga una sesión válida de Supabase.
 * Retorna el usuario autenticado o null si no hay sesión.
 *
 * Uso:
 *   const user = await requireAuth()
 *   if (!user) return apiError("No autenticado", 401)
 */
export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// ---------------------------------------------------------------------------
// Credenciales factura.com — acceso vía service_role
// ---------------------------------------------------------------------------

export interface FacturaComCreds {
  apiKey: string;
  secretKey: string;
}

/**
 * Obtiene las credenciales de factura.com para una empresa emisora.
 * Usa createAdminClient() (service_role) porque billing_empresas_api_keys
 * está protegida con RLS que bloquea acceso desde anon.
 *
 * @returns { apiKey, secretKey } o null si no existen
 */
export async function getFacturaComCredentials(
  empresaId: string
): Promise<FacturaComCreds | null> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("billing_empresas_api_keys")
    .select("api_key, secret_key")
    .eq("empresa_id", empresaId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    apiKey: data.api_key,
    secretKey: data.secret_key,
  };
}

// ---------------------------------------------------------------------------
// Parseo seguro de body JSON
// ---------------------------------------------------------------------------

/**
 * Parsea el body del request como JSON.
 * Retorna null si el body no es JSON válido.
 */
export async function parseJsonBody<T = unknown>(
  request: Request
): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}
