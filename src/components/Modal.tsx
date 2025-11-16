import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'center' | 'top-right';
}

export function Modal({ isOpen, onClose, children, width = 'md', position = 'center' }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  const positionClasses = {
    center: 'items-center justify-center',
    'top-right': 'items-start justify-end pt-20 pr-4',
  };

  return (
    <div className={`fixed inset-0 z-50 flex ${positionClasses[position]} bg-black bg-opacity-50`}>
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl ${widthClasses[width]} w-full mx-4 max-h-[90vh] overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  );
}

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close"
      >
        <X size={24} />
      </button>
    </div>
  );
}

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalBody({ children, className = '' }: ModalBodyProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

interface ModalFooterProps {
  children: React.ReactNode;
}

export function ModalFooter({ children }: ModalFooterProps) {
  return <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">{children}</div>;
}
