export interface User {
  id: string;
  telegramId: number;
  username?: string;
  firstName: string;
  lastName?: string;
  photoUrl?: string;
  role: 'client' | 'freelancer';
  createdAt: Date;
  updatedAt: Date;
}

export interface FreelancerProfile {
  userId: string;
  title: string;
  description: string;
  skills: string[];
  hourlyRate: number;
  portfolio: PortfolioItem[];
  rating: number;
  completedJobs: number;
}

export interface ClientProfile {
  userId: string;
  companyName?: string;
  description: string;
  website?: string;
  postedJobs: number;
  rating: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
  tags: string[];
}

export interface Job {
  id: string;
  clientId: string;
  title: string;
  description: string;
  category: string;
  budget: {
    type: 'fixed' | 'hourly';
    amount: number;
    currency: string;
  };
  skills: string[];
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  deadline?: Date;
  createdAt: Date;
  applications: Application[];
}

export interface Application {
  id: string;
  jobId: string;
  freelancerId: string;
  proposal: string;
  bidAmount: number;
  estimatedDuration: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
    };
    chat_instance?: string;
    chat_type?: string;
    auth_date: number;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isProgressVisible: boolean;
    isActive: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: () => void;
    hideProgress: () => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}