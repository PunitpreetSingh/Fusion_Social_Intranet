import { Modal, ModalBody } from './Modal';
import { ProfileModalConfig, User } from '../types';
import { ExternalLink } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ProfileModalConfig;
  user: User | null;
}

export function ProfileModal({ isOpen, onClose, config, user }: ProfileModalProps) {
  if (!user) return null;

  const handleSignOut = () => {
    console.log('Sign out clicked');
  };

  const handleItemClick = (label: string) => {
    console.log(`${label} clicked`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="sm" position="top-right">
      <ModalBody className="p-0">
        <div className="bg-black text-white p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {user.profile_image_url ? (
                  <img src={user.profile_image_url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <svg viewBox="0 0 24 24" className="w-12 h-12 text-gray-500" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center border-2 border-white">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">{user.name}</h3>
              <p className="text-sm text-gray-300 mb-3">{user.department}</p>
              <button className="flex items-center gap-2 text-sm text-white border border-white px-4 py-1.5 rounded hover:bg-white hover:text-black transition-colors">
                Directory
                <ExternalLink size={14} />
              </button>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {config.section1.items.map((item) => (
              <button
                key={item}
                onClick={() => handleItemClick(item)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-800 rounded transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={handleSignOut}
            className="w-full bg-white text-black font-semibold py-2.5 rounded hover:bg-gray-100 transition-colors"
          >
            {config.section1.button}
          </button>
        </div>

        <div className="p-4 space-y-1 max-h-80 overflow-y-auto">
          {config.section2.items.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item.label)}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </ModalBody>
    </Modal>
  );
}
