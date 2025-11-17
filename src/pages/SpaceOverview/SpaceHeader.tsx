import React from 'react';
import { Plus } from 'lucide-react';

export const SpaceHeader: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            FUSO Social Intranet
          </h1>
          <p className="text-gray-600">12,450 followers</p>
        </div>
        <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors">
          <Plus size={20} />
          Follow
        </button>
      </div>
    </div>
  );
};
