import { User, Grid3x3, Plus, Search, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeaderProps {
  onPeopleClick: () => void;
  onNotificationsClick: () => void;
  onAppsClick: () => void;
  onCreateClick: () => void;
  onSearchClick: () => void;
}

export function Header({ onPeopleClick, onNotificationsClick, onAppsClick, onCreateClick, onSearchClick }: HeaderProps) {
  const [labels, setLabels] = useState({ appName: 'Social Intranet', centerText: 'DAIMLER TRUCK ASIA' });

  useEffect(() => {
    fetch('/uiLabels.json')
      .then(res => res.json())
      .then(data => setLabels(data.header))
      .catch(() => {});
  }, []);

  return (
    <header className="bg-white border-b border-gray-300">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-base font-normal text-black">{labels.appName}</span>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl font-normal tracking-[0.3em] text-black">{labels.centerText}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPeopleClick}
            className="p-2.5 rounded-full bg-gray-400 hover:bg-gray-500 transition-colors"
            aria-label="People"
          >
            <User size={20} className="text-white" />
          </button>
          <button
            onClick={onNotificationsClick}
            className="p-2.5 rounded-full bg-gray-400 hover:bg-gray-500 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-white" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 text-white text-xs rounded-full flex items-center justify-center font-semibold">
              0
            </span>
          </button>
          <button
            onClick={onAppsClick}
            className="p-2.5 rounded-full bg-gray-400 hover:bg-gray-500 transition-colors"
            aria-label="Apps"
          >
            <Grid3x3 size={20} className="text-white" />
          </button>
          <button
            onClick={onCreateClick}
            className="p-2.5 rounded-full bg-gray-400 hover:bg-gray-500 transition-colors"
            aria-label="Create"
          >
            <Plus size={20} className="text-white" />
          </button>
          <button
            onClick={onSearchClick}
            className="p-2.5 rounded-full bg-gray-400 hover:bg-gray-500 transition-colors"
            aria-label="Search"
          >
            <Search size={20} className="text-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
