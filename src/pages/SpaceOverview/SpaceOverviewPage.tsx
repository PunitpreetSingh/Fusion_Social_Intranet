import React from 'react';
import { SpaceHeader } from './SpaceHeader';
import { QuickAccessGrid } from './QuickAccessGrid';
import { LatestNewsSection } from './LatestNewsSection';

export const SpaceOverviewPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <SpaceHeader />
        <QuickAccessGrid />
        <LatestNewsSection />
      </div>

      <footer className="border-t border-gray-200 mt-20 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500">
          © 2025 FUSO. Part of Daimler Truck. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
