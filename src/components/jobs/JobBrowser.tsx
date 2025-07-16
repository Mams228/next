import React, { useState } from 'react';
import { Search, Filter, MapPin, Clock, DollarSign, Heart } from 'lucide-react';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';

export const JobBrowser: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const mockJobs = [
    {
      id: '1',
      title: 'React Developer for E-commerce Platform',
      description: 'We need an experienced React developer to build a modern e-commerce platform with advanced features like real-time inventory, payment integration, and user analytics.',
      client: {
        name: 'TechCorp Inc.',
        avatar: '',
        rating: 4.8,
        location: 'San Francisco, CA'
      },
      budget: {
        type: 'fixed',
        amount: 2500,
        currency: 'USD'
      },
      skills: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
      postedTime: '2 hours ago',
      proposals: 12,
      category: 'Web Development'
    },
    {
      id: '2',
      title: 'Mobile App UI/UX Design',
      description: 'Looking for a talented UI/UX designer to create beautiful and intuitive designs for our fitness tracking mobile application.',
      client: {
        name: 'FitLife Studio',
        avatar: '',
        rating: 4.9,
        location: 'New York, NY'
      },
      budget: {
        type: 'hourly',
        amount: 35,
        currency: 'USD'
      },
      skills: ['Figma', 'Sketch', 'Prototyping', 'User Research'],
      postedTime: '5 hours ago',
      proposals: 8,
      category: 'UI/UX Design'
    },
    {
      id: '3',
      title: 'Content Writer for Tech Blog',
      description: 'We are seeking a skilled content writer to create engaging blog posts about emerging technologies, programming tutorials, and industry trends.',
      client: {
        name: 'DevBlog Media',
        avatar: '',
        rating: 4.7,
        location: 'Remote'
      },
      budget: {
        type: 'fixed',
        amount: 800,
        currency: 'USD'
      },
      skills: ['Technical Writing', 'SEO', 'Research', 'Programming'],
      postedTime: '1 day ago',
      proposals: 15,
      category: 'Content Writing'
    }
  ];

  const categories = [
    'All Categories',
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Content Writing',
    'Digital Marketing',
    'Data Science'
  ];

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'All Categories' || 
                           job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-3 pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Browse Jobs</h1>
        <p className="text-sm text-gray-600">Find your next opportunity</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-2 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        
        <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 active:scale-95 ${
                selectedCategory === category || (!selectedCategory && category === 'All Categories')
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200">
            {/* Job Header */}
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-800 text-base flex-1 mr-2 line-clamp-2">{job.title}</h3>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Heart className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Job Description */}
            <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{job.description}</p>

            {/* Budget and Time */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex items-center text-green-600">
                <DollarSign className="w-4 h-4 mr-1" />
                <span className="font-semibold text-sm">
                  ${job.budget.amount}{job.budget.type === 'hourly' ? '/hr' : ''}
                </span>
              </div>
              <div className="flex items-center text-gray-500 text-xs">
                <Clock className="w-4 h-4 mr-1" />
                <span>{job.postedTime}</span>
              </div>
              <div className="text-gray-500 text-xs">
                {job.proposals} proposals
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {job.skills.slice(0, 3).map(skill => (
                <span key={skill} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                  {skill}
                </span>
              ))}
              {job.skills.length > 3 && (
                <span className="text-gray-500 text-xs">+{job.skills.length - 3} more</span>
              )}
            </div>

            {/* Client Info */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center">
                <Avatar 
                  src={job.client.avatar} 
                  name={job.client.name} 
                  size="sm" 
                />
                <div className="ml-2">
                  <p className="font-medium text-gray-800 text-xs">{job.client.name}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{job.client.location}</span>
                    <span className="mx-2">•</span>
                    <span>★ {job.client.rating}</span>
                  </div>
                </div>
              </div>
              
              <Button size="sm">
                Apply Now
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-base font-medium text-gray-800 mb-1">No jobs found</h3>
          <p className="text-sm text-gray-600">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
};