import React from 'react';
import { Heart, Share2, Bookmark } from 'lucide-react';

interface NewsCardProps {
  id: number;
  image: string;
  category: string;
  categoryColor: string;
  date: string;
  title: string;
  description: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  image,
  category,
  categoryColor,
  date,
  title,
  description,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-medium ${categoryColor}`}>{category}</span>
          <span className="text-sm text-gray-500">{date}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 transition-colors">
              <Heart size={18} />
              <span className="text-sm">Like</span>
            </button>
            <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 transition-colors">
              <Share2 size={18} />
              <span className="text-sm">Share</span>
            </button>
            <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 transition-colors">
              <Bookmark size={18} />
              <span className="text-sm">Save</span>
            </button>
          </div>
          <button className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors">
            View
          </button>
        </div>
      </div>
    </div>
  );
};
