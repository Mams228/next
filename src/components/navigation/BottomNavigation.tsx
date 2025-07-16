import React from 'react';
import { Home, Search, Plus, MessageSquare, User, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const { user } = useAuth();

  const clientTabs = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'post-job', icon: Plus, label: 'Post Job' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const freelancerTabs = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'browse-jobs', icon: Search, label: 'Browse Jobs' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const tabs = user?.role === 'client' ? clientTabs : freelancerTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1">
      <div className="flex justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-1 rounded-lg transition-all duration-150 active:scale-95 min-w-0 flex-1 ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`text-xs font-medium truncate ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};