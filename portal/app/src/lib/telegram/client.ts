/**
 * @file lib/telegram/client.ts
 * @description Cliente para la Telegram Bot API.
 *
 * Funciones para enviar mensajes, responder callbacks y descargar archivos.
 * Usa fetch nativo — sin dependencias externas.
 */

import type {
  SendMessageOptions,
  InlineKeyboardMarkup,
} from "./types";

// ---------------------------------------------------------------------------
// Configuración
// ---------------------------------------------------------------------------

const TELEGRAM_API_BASE = "https://api.telegram.org";

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN no está configurado en las variables de entorno");
  }
  return token;
}

function apiUrl(method: string): string {
  return `${TELEGRAM_API_BASE}/bot${getBotToken()}/${method}`;
}

// ---------------------------------------------------------------------------
// Tipos de respuesta de la API de Telegram
// ---------------------------------------------------------------------------

interface TelegramApiResponse<T = unknown> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
}

// ---------------------------------------------------------------------------
// Llamada genérica a la API
// ---------------------------------------------------------------------------

async function callTelegramApi<T = unknown>(
  method: string,
  body: Record<string, unknown>
): Promise<T> {
  const response = await fetch(apiUrl(method), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data: TelegramApiResponse<T> = await response.json();

  if (!data.ok) {
    throw new Error(
      `Telegram API error [${method}]: ${data.description ?? "Error desconocido"} (código ${data.error_code})`
    );
  }

  return data.result as T;
}

// ---------------------------------------------------------------------------
// Enviar mensaje de texto
// ---------------------------------------------------------------------------

/**
 * Envía un mensaje de texto a un chat de Telegram.
 * Soporta HTML parse_mode y inline keyboard.
 */
export async function sendMessage(options: SendMessageOptions): Promise<void> {
  await callTelegramApi("sendMessage", {
    chat_id: options.chat_id,
    text: options.text,
    parse_mode: options.parse_mode ?? "HTML",
    ...(options.reply_markup ? { reply_markup: options.reply_markup } : {}),
  });
}

/**
 * Envía un mensaje con botones de confirmación (inline keyboard).
 */
export async function sendConfirmation(
  chatId: number,
  previewText: string,
  confirmData: string,
  cancelData: string
): Promise<void> {
  const keyboard: InlineKeyboardMarkup = {
    inline_keyboard: [
      [
        { text: "Confirmar", callback_data: confirmData },
        { text: "Cancelar", callback_data: cancelData },
      ],
    ],
  };

  await sendMessage({
    chat_id: chatId,
    text: previewText,
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
}

// ---------------------------------------------------------------------------
// Enviar documento (PDF) por Telegram
// ---------------------------------------------------------------------------

/**
 * Envía un archivo PDF al chat con botones de confirmación.
 * Usa multipart/form-data para subir el archivo.
 */
export async function sendDocumentWithConfirmation(
  chatId: number,
  pdfBuffer: Buffer,
  fileName: string,
  caption: string,
  confirmData: string,
  cancelData: string
): Promise<void> {
  const token = getBotToken();
  const url = `${TELEGRAM_API_BASE}/bot${token}/sendDocument`;

  const keyboard: InlineKeyboardMarkup = {
    inline_keyboard: [
      [
        { text: "Confirmar timbrado", callback_data: confirmData },
        { text: "Cancelar", callback_data: cancelData },
      ],
    ],
  };

  // Construir FormData manualmente con Blob
  const formData = new FormData();
  formData.append("chat_id", String(chatId));
  formData.append("document", new Blob([pdfBuffer as BlobPart], { type: "application/pdf" }), fileName);
  formData.append("caption", caption);
  formData.append("parse_mode", "HTML");
  formData.append("reply_markup", JSON.stringify(keyboard));

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!data.ok) {
    throw new Error(
      `Telegram API error [sendDocument]: ${data.description ?? "Error desconocido"} (codigo ${data.error_code})`
    );
  }
}

// ---------------------------------------------------------------------------
// Responder a callback queries (botones inline)
// ---------------------------------------------------------------------------

/**
 * Responde a un callback_query para quitar el "relojito" del botón.
 */
export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string
): Promise<void> {
  await callTelegramApi("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    ...(text ? { text, show_alert: false } : {}),
  });
}

// ---------------------------------------------------------------------------
// Editar mensaje existente (para actualizar el estado post-confirmación)
// ---------------------------------------------------------------------------

/**
 * Edita el texto de un mensaje existente (quita los botones).
 */
export async function editMessageText(
  chatId: number,
  messageId: number,
  text: string
): Promise<void> {
  await callTelegramApi("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "HTML",
  });
}

// ---------------------------------------------------------------------------
// Descargar archivo (para PDFs enviados por el usuario)
// ---------------------------------------------------------------------------

interface TelegramFile {
  file_id: string;
  file_unique_id: string;
  file_size?: number;
  file_path?: string;
}

/**
 * Obtiene la ruta de descarga de un archivo y lo descarga como Buffer.
 * Útil para recibir PDFs de constancias fiscales o comprobantes bancarios.
 */
export async function downloadFile(fileId: string): Promise<Buffer> {
  // Obtener file_path
  const file = await callTelegramApi<TelegramFile>("getFile", {
    file_id: fileId,
  });

  if (!file.file_path) {
    throw new Error("Telegram no proporcionó file_path para el archivo");
  }

  // Descargar el archivo
  const downloadUrl = `${TELEGRAM_API_BASE}/file/bot${getBotToken()}/${file.file_path}`;
  const response = await fetch(downloadUrl);

  if (!response.ok) {
    throw new Error(`Error al descargar archivo de Telegram: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// ---------------------------------------------------------------------------
// Configurar webhook (utilidad para setup inicial)
// ---------------------------------------------------------------------------

/**
 * Configura el webhook de Telegram apuntando a nuestra API Route.
 * Se llama una sola vez al hacer deploy o cambiar de dominio.
 *
 * @param webhookUrl - URL completa del endpoint (ej: https://tudominio.vercel.app/api/webhook/telegram)
 */
export async function setWebhook(webhookUrl: string): Promise<void> {
  const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secretToken) {
    throw new Error("TELEGRAM_WEBHOOK_SECRET no está configurado");
  }

  await callTelegramApi("setWebhook", {
    url: webhookUrl,
    secret_token: secretToken,
    allowed_updates: ["message", "callback_query"],
  });
}
