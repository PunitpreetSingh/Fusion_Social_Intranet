import { Modal, ModalBody } from './Modal';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'suggestions' | 'history' | 'bookmarks'>('suggestions');

  const mockSuggestions = [
    {
      title: '52nd Sales and Customer Service...',
      author: 'Karl Deppen',
      location: 'Daimler Truck Asia (EN)',
      type: 'Space',
    },
    {
      title: 'Dieses Profil ist leider nicht verfüg...',
      author: 'Deactivated User',
      location: 'Support',
      type: 'Space',
    },
    {
      title: 'Japan Mobility Show 2025 Recap: ...',
      author: 'Kei Takahashi',
      location: 'Mitsubishi Fuso Tr...',
      type: 'Space',
    },
  ];

  const mockSpaces = [
    { name: 'Daimler Truck Asia (EN)', type: 'Space' },
    { name: 'Daimler Truck EN', type: 'Space' },
    { name: 'Daimler Truck & Me Global', description: 'Space for Daimler truck & Me Global', type: 'Space' },
    { name: 'Daimler India Commercial Vehicles', description: 'Daimler India Commercial Vehicles (DI...', type: 'Space' },
  ];

  const mockPeople = [
    { name: 'David Blair' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="xl" position="center">
      <ModalBody className="p-0">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-10 py-3 border-b-2 border-gray-300 focus:border-blue-500 outline-none transition-colors text-lg"
              autoFocus
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`pb-2 px-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'suggestions'
                  ? 'text-gray-900 border-black'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Suggestions
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-2 px-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'history'
                  ? 'text-gray-900 border-black'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              History
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`pb-2 px-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'bookmarks'
                  ? 'text-gray-900 border-black'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Bookmarks
            </button>
            <div className="ml-auto">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Search In: Directory
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-gray-200 min-h-[400px]">
          <div className="p-4">
            <div className="space-y-2">
              {mockSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900 truncate">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    by {item.author} in {item.location}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-2">
              {mockSpaces.map((space, idx) => (
                <button
                  key={idx}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">S</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{space.name}</div>
                      {space.description && (
                        <div className="text-xs text-gray-500 truncate">{space.description}</div>
                      )}
                      <div className="text-xs text-gray-400">{space.type}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-2">
              {mockPeople.map((person, idx) => (
                <button
                  key={idx}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-500" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{person.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
