import { useEffect, useState } from 'react';
import { TelegramWebApp } from '../types';
import { telegramBot } from '../services/telegramBot';
import { TELEGRAM_CONFIG } from '../config/telegram';

export const useTelegram = () => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<any>(null);
  const [botInfo, setBotInfo] = useState<any>(null);

  useEffect(() => {
    const app = window.Telegram?.WebApp;
    if (app) {
      app.ready();
      setWebApp(app);
      setUser(app.initDataUnsafe?.user);
      // Expand the app to full height
      app.expand();
    } else {
      // Fallback for development
      setWebApp({} as TelegramWebApp);
      setUser({
        id: 123456789,
        first_name: 'Test User',
        username: 'testuser'
      });
    }
  }, []);

  const onClose = () => {
    webApp?.close();
  };

  const onToggleMainButton = () => {
    const mainButton = webApp?.MainButton;
    if (mainButton) {
      if (mainButton.isVisible) {
        mainButton.hide();
      } else {
        mainButton.show();
      }
    }
  };

  const hapticFeedback = (type: 'impact' | 'notification' | 'selection', style?: any) => {
    if (webApp?.HapticFeedback) {
      switch (type) {
        case 'impact':
          webApp.HapticFeedback.impactOccurred(style || 'medium');
          break;
        case 'notification':
          webApp.HapticFeedback.notificationOccurred(style || 'success');
          break;
        case 'selection':
          webApp.HapticFeedback.selectionChanged();
          break;
      }
    }
  };

  return {
    webApp,
    user,
    botInfo,
    onClose,
    onToggleMainButton,
    hapticFeedback,
    isReady: true
  };
};