/**
 * @file api/webhook/telegram/route.ts
 * @description Webhook receptor de updates de Telegram.
 *
 * Telegram envía un POST con cada mensaje o callback_query.
 * Verifica el secret_token en el header X-Telegram-Bot-Api-Secret-Token
 * y delega el procesamiento al handler principal.
 *
 * Configuración del webhook (una sola vez):
 *   POST https://api.telegram.org/bot{TOKEN}/setWebhook
 *   { "url": "https://tudominio.vercel.app/api/webhook/telegram",
 *     "secret_token": "TU_WEBHOOK_SECRET",
 *     "allowed_updates": ["message", "callback_query"] }
 */

import { NextRequest } from "next/server";
import { handleTelegramUpdate } from "@/lib/telegram/handler";
import type { TelegramUpdate } from "@/lib/telegram/types";

// ---------------------------------------------------------------------------
// POST /api/webhook/telegram
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<Response> {
  // Verificar secret token
  const secretToken = request.headers.get("x-telegram-bot-api-secret-token");
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (expectedSecret && secretToken !== expectedSecret) {
    return Response.json(
      { success: false, error: { message: "Secret token inválido", code: "UNAUTHORIZED" } },
      { status: 401 }
    );
  }

  // Parsear el update
  let update: TelegramUpdate;
  try {
    update = (await request.json()) as TelegramUpdate;
  } catch {
    return Response.json(
      { success: false, error: { message: "Body JSON inválido", code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  // Procesar en background — Telegram espera respuesta rápida (< 60s)
  // Respondemos 200 inmediatamente y procesamos el update async
  // En Edge Runtime o Node, el procesamiento continúa después del response
  handleTelegramUpdate(update).catch((err) => {
    console.error("[webhook/telegram] Error procesando update:", err);
  });

  return Response.json({ success: true, data: { ok: true } });
}
