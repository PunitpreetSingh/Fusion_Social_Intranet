import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface QuickAccessCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  linkText: string;
  linkColor: string;
}

export const QuickAccessCard: React.FC<QuickAccessCardProps> = ({
  icon: Icon,
  title,
  description,
  linkText,
  linkColor,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <Icon size={24} className="text-gray-700" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <button className={`flex items-center gap-1 ${linkColor} hover:underline font-medium text-sm`}>
        {linkText}
        <ArrowRight size={16} />
      </button>
    </div>
  );
};
