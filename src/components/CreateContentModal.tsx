import { User } from '../types';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useModal } from '../contexts/ModalContext';
import { StatusUpdateModal } from './StatusUpdateModal';
import { DocumentForm } from './DocumentForm';
import { BlogPostForm } from './BlogPostForm';
import { CreateSpaceForm } from './CreateSpaceForm';

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function CreateContentModal({ isOpen, onClose, user }: CreateContentModalProps) {
  const { openModal, isOpen: isModalOpen } = useModal();
  const [menuConfig, setMenuConfig] = useState<any>(null);

  useEffect(() => {
    fetch('/formLabels.json')
      .then(res => res.json())
      .then(data => setMenuConfig(data.createMenu))
      .catch(() => {});
  }, []);

  const handleItemClick = (itemId: string, hasForm: boolean) => {
    if (!hasForm) {
      console.log(`${itemId} clicked - no form available`);
      return;
    }

    onClose();
    setTimeout(() => {
      openModal(itemId, { user });
    }, 100);
  };

  if (!isOpen || !menuConfig) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity duration-200"
        onClick={onClose}
      />
      <div className="fixed top-16 right-4 z-41 animate-slideInRight" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-lg shadow-2xl w-80 max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{menuConfig.title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-1 mb-4">
              {menuConfig.sections.create.map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id, item.hasForm)}
                  className="w-full flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 text-left border border-transparent hover:border-gray-200"
                >
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 px-2">More:</h3>
              <div className="space-y-1">
                {menuConfig.sections.more.map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id, item.hasForm)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                    </div>
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 px-2">Communities:</h3>
              <div className="space-y-1">
                {menuConfig.sections.communities.map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id, item.hasForm)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                    </div>
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen('status_update') && (
        <StatusUpdateModal
          isOpen={true}
          onClose={() => {
            openModal('menu', { user });
          }}
          user={user}
        />
      )}

      {isModalOpen('document') && (
        <DocumentForm
          isOpen={true}
          onClose={() => {
            openModal('menu', { user });
          }}
          user={user}
        />
      )}

      {isModalOpen('blog_post') && (
        <BlogPostForm
          isOpen={true}
          onClose={() => {
            openModal('menu', { user });
          }}
          user={user}
        />
      )}

      {isModalOpen('space') && (
        <CreateSpaceForm
          isOpen={true}
          onClose={() => {
            openModal('menu', { user });
          }}
          user={user}
        />
      )}

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
