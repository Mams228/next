import React from 'react';
import { User, Briefcase, Shield, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useTelegram } from '../../hooks/useTelegram';
import { TELEGRAM_CONFIG } from '../../config/telegram';

export const RoleSelection: React.FC = () => {
  const { login } = useAuth();
  const { user: telegramUser, hapticFeedback } = useTelegram();

  const handleRoleSelect = async (role: 'client' | 'freelancer') => {
    hapticFeedback('impact', 'light');
    if (telegramUser) {
      await login(telegramUser, role);
    }
  };

  // Show warning if bot token is not configured
  if (!TELEGRAM_CONFIG.BOT_TOKEN) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-3">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-800 mb-2">Bot Token Required</h1>
            <p className="text-sm text-gray-600 mb-3">
              Add your bot token to .env file
            </p>
            <div className="bg-gray-100 rounded-lg p-3 text-left">
              <code className="text-xs text-gray-700">
                VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-3">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-800 mb-1">FreelanceHub</h1>
          <p className="text-sm text-gray-600">Choose your role to get started</p>
        </div>

        <div className="space-y-3">
          <div 
            className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-150 active:scale-95"
            onClick={() => handleRoleSelect('client')}
          >
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">I'm a Client</h3>
                <p className="text-sm text-gray-600">I want to hire freelancers</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Post projects, find talented freelancers, and manage your team.
            </p>
          </div>

          <div 
            className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-150 active:scale-95"
            onClick={() => handleRoleSelect('freelancer')}
          >
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">I'm a Freelancer</h3>
                <p className="text-sm text-gray-600">I want to find work</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Browse projects, showcase your skills, and grow your business.
            </p>
          </div>
        </div>

        {telegramUser && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center text-xs text-gray-600">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <span>Logged in as {telegramUser.first_name}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};