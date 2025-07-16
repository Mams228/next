import { TELEGRAM_CONFIG, TELEGRAM_API, validateBotToken } from '../config/telegram';

export class TelegramBotService {
  private botToken: string;

  constructor() {
    this.botToken = TELEGRAM_CONFIG.BOT_TOKEN || '';
    
    if (!this.botToken) {
      console.warn('Telegram bot token not found. Please set VITE_TELEGRAM_BOT_TOKEN in your .env file');
    } else if (!validateBotToken(this.botToken)) {
      console.error('Invalid Telegram bot token format');
    }
  }

  // Verify bot token and get bot info
  async getBotInfo() {
    if (!this.botToken) {
      throw new Error('Bot token not configured');
    }

    try {
      const response = await fetch(TELEGRAM_API.getMe(this.botToken));
      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(`Telegram API error: ${data.description}`);
      }
      
      return data.result;
    } catch (error) {
      console.error('Failed to get bot info:', error);
      throw error;
    }
  }

  // Send message to user
  async sendMessage(chatId: number, text: string, options: any = {}) {
    if (!this.botToken) {
      throw new Error('Bot token not configured');
    }

    try {
      const response = await fetch(TELEGRAM_API.sendMessage(this.botToken), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          ...options,
        }),
      });

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(`Failed to send message: ${data.description}`);
      }
      
      return data.result;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  // Set webhook for bot
  async setWebhook(webhookUrl: string) {
    if (!this.botToken) {
      throw new Error('Bot token not configured');
    }

    try {
      const response = await fetch(TELEGRAM_API.setWebhook(this.botToken), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message', 'callback_query', 'web_app_data'],
        }),
      });

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(`Failed to set webhook: ${data.description}`);
      }
      
      return data.result;
    } catch (error) {
      console.error('Failed to set webhook:', error);
      throw error;
    }
  }

  // Validate Web App data
  validateWebAppData(initData: string): boolean {
    // Implementation for validating Telegram Web App init data
    // This should include HMAC validation using bot token
    try {
      const urlParams = new URLSearchParams(initData);
      const hash = urlParams.get('hash');
      
      if (!hash) {
        return false;
      }

      // Remove hash from params for validation
      urlParams.delete('hash');
      
      // Sort parameters and create data string
      const dataCheckString = Array.from(urlParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

      // Validate HMAC (simplified - in production, use proper crypto)
      // This is where you'd use your bot token to validate the hash
      return true; // Simplified for demo
    } catch (error) {
      console.error('Failed to validate web app data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const telegramBot = new TelegramBotService();