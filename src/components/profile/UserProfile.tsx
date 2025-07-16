import React from 'react';
import { Edit, MapPin, Star, Calendar, Award, ExternalLink } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';

export const UserProfile: React.FC = () => {
  const { user } = useAuth();

  const mockFreelancerData = {
    title: 'Full Stack Developer',
    description: 'Experienced developer with 5+ years in React, Node.js, and cloud technologies. Passionate about creating scalable web applications and helping businesses grow through technology.',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'PostgreSQL', 'Docker', 'GraphQL'],
    hourlyRate: 45,
    location: 'San Francisco, CA',
    joinDate: 'January 2020',
    completedJobs: 127,
    rating: 4.9,
    totalEarnings: 89500,
    portfolio: [
      {
        id: '1',
        title: 'E-commerce Platform',
        description: 'Built a complete e-commerce solution with React and Node.js',
        image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['React', 'Node.js', 'MongoDB']
      },
      {
        id: '2',
        title: 'Task Management App',
        description: 'Developed a collaborative task management application',
        image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
        tags: ['React', 'TypeScript', 'PostgreSQL']
      }
    ]
  };

  const mockClientData = {
    companyName: 'TechCorp Solutions',
    description: 'Leading technology company focused on innovative software solutions. We work with talented freelancers to bring cutting-edge projects to life.',
    website: 'https://techcorp.com',
    location: 'New York, NY',
    joinDate: 'March 2021',
    postedJobs: 45,
    rating: 4.8,
    totalSpent: 125000
  };

  const data = user?.role === 'freelancer' ? mockFreelancerData : mockClientData;

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex items-start space-x-4">
          <Avatar 
            src={user?.photoUrl} 
            name={`${user?.firstName} ${user?.lastName || ''}`} 
            size="xl" 
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">
              {user?.firstName} {user?.lastName}
            </h2>
            {user?.role === 'freelancer' ? (
              <p className="text-blue-600 font-medium mb-2">{mockFreelancerData.title}</p>
            ) : (
              <p className="text-blue-600 font-medium mb-2">{mockClientData.companyName}</p>
            )}
            
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{data.location}</span>
              <span className="mx-2">•</span>
              <Calendar className="w-4 h-4 mr-1" />
              <span>Joined {data.joinDate}</span>
            </div>

            <p className="text-gray-600 mb-4">{data.description}</p>

            {user?.role === 'client' && mockClientData.website && (
              <a 
                href={mockClientData.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-500 hover:text-blue-600"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                {mockClientData.website.replace('https://', '')}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">
                {user?.role === 'freelancer' ? 'Jobs Completed' : 'Jobs Posted'}
              </p>
              <p className="text-2xl font-bold">
                {user?.role === 'freelancer' ? mockFreelancerData.completedJobs : mockClientData.postedJobs}
              </p>
            </div>
            <Award className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">
                {user?.role === 'freelancer' ? 'Total Earned' : 'Total Spent'}
              </p>
              <p className="text-2xl font-bold">
                ${(user?.role === 'freelancer' ? mockFreelancerData.totalEarnings : mockClientData.totalSpent).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-300 mr-1" />
              <span className="text-lg font-bold">{data.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills (Freelancer only) */}
      {user?.role === 'freelancer' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
            <span className="text-2xl font-bold text-green-600">
              ${mockFreelancerData.hourlyRate}/hr
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {mockFreelancerData.skills.map(skill => (
              <span 
                key={skill} 
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio (Freelancer only) */}
      {user?.role === 'freelancer' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Portfolio</h3>
          <div className="grid grid-cols-1 gap-4">
            {mockFreelancerData.portfolio.map(item => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex space-x-4">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-2">{item.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};