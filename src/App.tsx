import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTelegram } from './hooks/useTelegram';
import { RoleSelection } from './components/auth/RoleSelection';
import { BottomNavigation } from './components/navigation/BottomNavigation';
import { ClientDashboard } from './components/dashboard/ClientDashboard';
import { FreelancerDashboard } from './components/dashboard/FreelancerDashboard';
import { JobPostForm } from './components/jobs/JobPostForm';
import { JobBrowser } from './components/jobs/JobBrowser';
import { UserProfile } from './components/profile/UserProfile';
import { ChatWindow } from './components/chat/ChatWindow';
import { QRPaymentUpload } from './components/payments/QRPaymentUpload';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { webApp } = useTelegram();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showJobPostForm, setShowJobPostForm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showPayments, setShowPayments] = useState(false);

  // Simplified loading check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <RoleSelection />;
  }

  if (showJobPostForm && user.role === 'client') {
    return <JobPostForm onBack={() => setShowJobPostForm(false)} />;
  }

  if (showChat) {
    // Mock other user for demo
    const mockOtherUser = {
      id: 'other-user',
      first_name: 'John',
      last_name: 'Doe',
      role: user.role === 'client' ? 'freelancer' : 'client',
      photo_url: ''
    };
    return (
      <ChatWindow 
        jobId="mock-job-id" 
        otherUser={mockOtherUser as any} 
        onBack={() => setShowChat(false)} 
      />
    );
  }
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return user.role === 'client' ? <ClientDashboard /> : <FreelancerDashboard />;
      case 'post-job':
        setShowJobPostForm(true);
        return null;
      case 'browse-jobs':
        return <JobBrowser />;
      case 'messages':
        setShowChat(true);
        return null;
      case 'payments':
        return (
          <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Payments</h1>
            <QRPaymentUpload 
              payment={{
                id: 'mock-payment',
                amount: 500,
                currency: 'USD',
                status: 'pending'
              } as any}
              onUpdate={() => {}}
              userRole={user.role}
            />
          </div>
        );
      case 'profile':
        return <UserProfile />;
      default:
        return user.role === 'client' ? <ClientDashboard /> : <FreelancerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {renderContent()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;