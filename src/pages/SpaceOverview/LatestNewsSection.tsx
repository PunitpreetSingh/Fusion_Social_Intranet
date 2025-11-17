import React from 'react';
import { NewsCard } from './NewsCard';

export const LatestNewsSection: React.FC = () => {
  const newsItems = [
    {
      id: 1,
      image: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'DTA News',
      categoryColor: 'text-red-600',
      date: '2024-01-15',
      title: 'DTA News: Q4 Performance Update',
      description: 'Quarterly performance results and strategic initiatives for the upcoming year.',
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'DICV News',
      categoryColor: 'text-red-600',
      date: '2024-01-12',
      title: 'DICV News: New Manufacturing Facility',
      description: 'Expansion of manufacturing capabilities with new state-of-the-art facility.',
    },
    {
      id: 3,
      image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'CEO Communications',
      categoryColor: 'text-red-600',
      date: '2024-01-10',
      title: 'CEO Communications: Vision 2025',
      description: 'Strategic vision and roadmap for FUSO\'s future growth and innovation.',
    },
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
        <button className="text-gray-600 hover:text-gray-900 font-medium text-sm px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          View All
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {newsItems.map((item) => (
          <NewsCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};
