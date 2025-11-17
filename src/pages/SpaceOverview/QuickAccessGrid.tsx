import React from 'react';
import { QuickAccessCard } from './QuickAccessCard';
import { Users, UserCheck, MessageSquare } from 'lucide-react';

export const QuickAccessGrid: React.FC = () => {
  const quickAccessItems = [
    {
      icon: Users,
      title: 'HR Connect',
      description: 'Access HR policies, benefits, and employee services',
      linkText: 'Open',
      linkColor: 'text-red-600',
    },
    {
      icon: UserCheck,
      title: 'People Connect',
      description: 'Find and connect with colleagues across departments',
      linkText: 'View',
      linkColor: 'text-red-600',
    },
    {
      icon: MessageSquare,
      title: 'Communities',
      description: 'Join department groups and discussion forums',
      linkText: 'Join',
      linkColor: 'text-red-600',
    },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickAccessItems.map((item, index) => (
          <QuickAccessCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};
