import { Modal, ModalBody } from './Modal';
import { AppSearchConfig } from '../types';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface AppSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppSearchConfig;
}

export function AppSearchModal({ isOpen, onClose, config }: AppSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [includeUnsubscribed, setIncludeUnsubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleGoToAppStation = () => {
    console.log('Navigate to App Station');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="lg" position="center">
      <ModalBody className="p-0">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{config.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          <div className="relative mb-4">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={config.searchPlaceholder}
              className="w-full pl-10 pr-10 py-2.5 border-b-2 border-gray-300 focus:border-blue-500 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeUnsubscribed}
              onChange={(e) => setIncludeUnsubscribed(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{config.checkboxLabel}</span>
          </label>
        </div>

        <div className="p-6 bg-blue-50 border-b border-gray-200">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Please note:</span> {config.note}
          </p>
        </div>

        <div className="p-12 min-h-[300px] flex flex-col items-center justify-center">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <p className="text-center text-gray-600 max-w-2xl">{config.emptyMessage}</p>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-center">
          <button
            onClick={handleGoToAppStation}
            className="bg-black text-white px-8 py-2.5 rounded hover:bg-gray-800 transition-colors font-medium"
          >
            {config.footerButton}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}
