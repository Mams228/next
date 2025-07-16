import React from 'react';
import { Plus, Eye, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { Button } from '../common/Button';

export const ClientDashboard: React.FC = () => {
  const mockJobs = [
    {
      id: '1',
      title: 'React Developer for E-commerce Site',
      applications: 12,
      status: 'open',
      budget: 2500,
      postedDate: '2 days ago'
    },
    {
      id: '2',
      title: 'UI/UX Designer for Mobile App',
      applications: 8,
      status: 'in_progress',
      budget: 1800,
      postedDate: '1 week ago'
    },
    {
      id: '3',
      title: 'Content Writer for Blog Posts',
      applications: 15,
      status: 'completed',
      budget: 500,
      postedDate: '2 weeks ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-green-600 bg-green-50 border-green-200';
      case 'in_progress': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Eye className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="p-3 pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-600">Manage projects & find talent</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs">Active Jobs</p>
              <p className="text-xl font-bold">3</p>
            </div>
            <Eye className="w-5 h-5 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs">Messages</p>
              <p className="text-xl font-bold">12</p>
            </div>
            <MessageSquare className="w-5 h-5 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-800 mb-2">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" className="flex items-center justify-center">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
          <Button variant="outline" size="sm" className="flex items-center justify-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </Button>
        </div>
      </div>

      {/* Recent Jobs */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-2">Your Jobs</h2>
        <div className="space-y-2">
          {mockJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-800 flex-1 mr-2 text-sm line-clamp-2">{job.title}</h3>
                <span className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusColor(job.status)}`}>
                  {getStatusIcon(job.status)}
                  <span className="ml-1 capitalize text-xs">{job.status.replace('_', ' ')}</span>
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <div className="flex items-center space-x-4">
                  <span>{job.applications} applications</span>
                  <span>${job.budget.toLocaleString()}</span>
                </div>
                <span>{job.postedDate}</span>
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  View Details
                </Button>
                {job.status === 'open' && (
                  <Button size="sm" className="flex-1">
                    View Applications
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};