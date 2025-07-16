import React from 'react';
import { Search, Send, Clock, CheckCircle, MessageSquare, Star } from 'lucide-react';
import { Button } from '../common/Button';

export const FreelancerDashboard: React.FC = () => {
  const mockProposals = [
    {
      id: '1',
      jobTitle: 'React Developer for E-commerce Site',
      clientName: 'TechCorp Inc.',
      bidAmount: 2200,
      status: 'pending',
      sentDate: '2 days ago'
    },
    {
      id: '2',
      jobTitle: 'UI/UX Designer for Mobile App',
      clientName: 'StartupXYZ',
      bidAmount: 1500,
      status: 'accepted',
      sentDate: '1 week ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'accepted': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="p-3 pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-600">Track proposals & find opportunities</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs">Active Proposals</p>
              <p className="text-xl font-bold">5</p>
            </div>
            <Send className="w-5 h-5 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-3 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-xs">Messages</p>
              <p className="text-xl font-bold">8</p>
            </div>
            <MessageSquare className="w-5 h-5 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-4 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Profile Strength</h3>
            <p className="text-xs text-gray-600">Complete profile for more jobs</p>
          </div>
          <div className="text-right">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="font-semibold text-gray-800 text-sm">4.8</span>
            </div>
            <p className="text-xs text-gray-600">85% complete</p>
          </div>
        </div>
        <div className="mt-2 bg-white rounded-full h-1.5">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500" style={{ width: '85%' }}></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-800 mb-2">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" className="flex items-center justify-center">
            <Search className="w-4 h-4 mr-2" />
            Browse Jobs
          </Button>
          <Button variant="outline" size="sm" className="flex items-center justify-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </Button>
        </div>
      </div>

      {/* Recent Proposals */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-2">Recent Proposals</h2>
        <div className="space-y-2">
          {mockProposals.map((proposal) => (
            <div key={proposal.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 mr-2">
                  <h3 className="font-medium text-gray-800 mb-0.5 text-sm line-clamp-2">{proposal.jobTitle}</h3>
                  <p className="text-xs text-gray-600">by {proposal.clientName}</p>
                </div>
                <span className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusColor(proposal.status)}`}>
                  {getStatusIcon(proposal.status)}
                  <span className="ml-1 capitalize">{proposal.status}</span>
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span className="font-medium">${proposal.bidAmount.toLocaleString()}</span>
                <span>{proposal.sentDate}</span>
              </div>
              
              <Button size="sm" variant="outline" className="w-full">
                View Details
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};