// Telegram Bot Configuration
export const TELEGRAM_CONFIG = {
  BOT_TOKEN: import.meta.env.VITE_TELEGRAM_BOT_TOKEN,
  BOT_USERNAME: import.meta.env.VITE_TELEGRAM_BOT_USERNAME,
  APP_URL: import.meta.env.VITE_APP_URL,
  WEBHOOK_URL: import.meta.env.VITE_WEBHOOK_URL,
};

// Telegram Bot API endpoints
export const TELEGRAM_API = {
  BASE_URL: 'https://api.telegram.org/bot',
  getUpdates: (token: string) => `${TELEGRAM_API.BASE_URL}${token}/getUpdates`,
  sendMessage: (token: string) => `${TELEGRAM_API.BASE_URL}${token}/sendMessage`,
  setWebhook: (token: string) => `${TELEGRAM_API.BASE_URL}${token}/setWebhook`,
  getMe: (token: string) => `${TELEGRAM_API.BASE_URL}${token}/getMe`,
};

// Validate bot token format
export const validateBotToken = (token: string): boolean => {
  const tokenRegex = /^\d+:[A-Za-z0-9_-]{35}$/;
  return tokenRegex.test(token);
};

// Generate Mini App URL
export const generateMiniAppUrl = (botUsername: string, appUrl: string): string => {
  return `https://t.me/${botUsername}?start=webapp&web_app=${encodeURIComponent(appUrl)}`;
};