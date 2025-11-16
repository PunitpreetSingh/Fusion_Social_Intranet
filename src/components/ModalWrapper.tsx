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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
      onClick={closeOnBackdrop ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      style={{ animation: 'fadeIn 0.2s ease-in-out' }}
    >
      <div
        className={`bg-white rounded-lg shadow-2xl ${sizeClasses[size]} ${className} transition-transform duration-300 ease-out transform`}
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideIn 0.3s ease-out' }}
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
  );
}
