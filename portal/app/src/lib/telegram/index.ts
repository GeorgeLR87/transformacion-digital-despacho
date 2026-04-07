/**
 * @file lib/telegram/index.ts
 * @description Re-exports del módulo Telegram
 */

export {
  sendMessage,
  sendConfirmation,
  answerCallbackQuery,
  editMessageText,
  downloadFile,
  setWebhook,
  sendDocumentWithConfirmation,
} from "./client";

export { handleTelegramUpdate } from "./handler";

export type {
  TelegramUpdate,
  TelegramMessage,
  TelegramCallbackQuery,
  TelegramUser,
  TelegramChat,
  TelegramDocument,
  TelegramPhotoSize,
  SendMessageOptions,
  InlineKeyboardMarkup,
  InlineKeyboardButton,
  FacturaInstruccion,
} from "./types";
