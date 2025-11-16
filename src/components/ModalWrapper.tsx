import { X } from 'lucide-react';
import { useModal } from '../contexts/ModalContext';
import { useEffect, ReactNode } from 'react';

interface ModalWrapperProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export function ModalWrapper({
  children,
  isOpen,
  onClose,
  size = 'md',
  closeOnBackdrop = true,
  showCloseButton = true,
  className = ''
}: ModalWrapperProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full w-full h-full'
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        style={{ zIndex: 999 }}
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 1000 }}
        role="dialog"
        aria-modal="true"
      >
        <div
          className={`bg-white rounded-lg shadow-2xl ${sizeClasses[size]} ${className} pointer-events-auto relative m-4`}
          onClick={(e) => e.stopPropagation()}
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          )}
          {children}
        </div>
      </div>
    </>
  );
}
