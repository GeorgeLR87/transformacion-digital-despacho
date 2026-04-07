/**
 * @file lib/telegram/types.ts
 * @description Tipos TypeScript para la Telegram Bot API.
 * Solo los tipos necesarios para el flujo de facturación.
 */

// ---------------------------------------------------------------------------
// Update — objeto raíz que Telegram envía al webhook
// ---------------------------------------------------------------------------

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

// ---------------------------------------------------------------------------
// Message
// ---------------------------------------------------------------------------

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface TelegramChat {
  id: number;
  type: "private" | "group" | "supergroup" | "channel";
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface TelegramDocument {
  file_id: string;
  file_unique_id: string;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}

export interface TelegramPhotoSize {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  document?: TelegramDocument;
  photo?: TelegramPhotoSize[];
  caption?: string;
}

// ---------------------------------------------------------------------------
// Callback Query — respuesta a inline keyboard buttons
// ---------------------------------------------------------------------------

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

// ---------------------------------------------------------------------------
// Inline Keyboard — botones interactivos
// ---------------------------------------------------------------------------

export interface InlineKeyboardButton {
  text: string;
  callback_data?: string;
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}

// ---------------------------------------------------------------------------
// Opciones para enviar mensajes
// ---------------------------------------------------------------------------

export interface SendMessageOptions {
  chat_id: number;
  text: string;
  parse_mode?: "HTML" | "Markdown" | "MarkdownV2";
  reply_markup?: InlineKeyboardMarkup;
}

// ---------------------------------------------------------------------------
// Datos extraídos por Claude — instrucción de factura
// ---------------------------------------------------------------------------

export interface FacturaInstruccion {
  rfc_receptor: string | null;
  nombre_receptor: string | null;
  descripcion: string;
  monto: number;
  cantidad: number;
  metodo_pago: "PUE" | "PPD";
  forma_pago: string;
  empresa_emisora: string | null;
  sku: string | null;
}

// ---------------------------------------------------------------------------
// Estado de conversación pendiente de confirmación
// ---------------------------------------------------------------------------

export interface PendingConfirmation {
  chat_id: number;
  instruccion: FacturaInstruccion;
  /** ID de la empresa emisora en billing_empresas_emisoras */
  empresa_id: string;
  /** UID hex del receptor en factura.com */
  receptor_uid: string;
  /** ID del receptor en billing_receptores */
  receptor_id: string;
  /** UID numérico de la serie en factura.com */
  serie_uid: number;
  /** Letra de la serie (para mostrar en preview) */
  serie_letra: string;
  /** Nombre de la empresa emisora (para mostrar en preview) */
  empresa_nombre: string;
  /** Nombre/razón social del receptor (para mostrar en preview) */
  receptor_nombre: string;
  /** RFC del receptor */
  receptor_rfc: string;
  /** UsoCFDI resuelto */
  uso_cfdi: string;
  /** Timestamp de creación — para limpiar pendientes viejos */
  created_at: number;
}
