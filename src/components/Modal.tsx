import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'center' | 'top-right';
  /**
   * When true (default) pressing Escape will close the modal.
   */
  closeOnEsc?: boolean;
  /**
   * When true (default) clicking the overlay will close the modal.
   */
  closeOnOutsideClick?: boolean;
}

const WIDTH_CLASSES: Record<NonNullable<ModalProps['width']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
};

const POSITION_CLASSES: Record<NonNullable<ModalProps['position']>, string> = {
  center: 'items-center justify-center',
  'top-right': 'items-start justify-end pt-20 pr-4',
};

/**
 * Simple reference-counted body-scroll lock.
 * This prevents restoring scroll when there are nested modals.
 */
function incrementBodyLock() {
  // @ts-ignore attach counter to window (safe for dev)
  const key = '__fusion_modal_open_count';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const count = (window[key] = (window[key] || 0) + 1);
  if (count === 1) {
    document.body.style.overflow = 'hidden';
  }
}

function decrementBodyLock() {
  // @ts-ignore
  const key = '__fusion_modal_open_count';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const count = Math.max(0, (window[key] || 1) - 1);
  // @ts-ignore
  window[key] = count;
  if (count === 0) {
    document.body.style.overflow = 'unset';
  }
}

export function Modal({
  isOpen,
  onClose,
  children,
  width = 'md',
  position = 'center',
  closeOnEsc = true,
  closeOnOutsideClick = true,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save focus and move focus into modal
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);

    // Escape handler
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEsc) {
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', onKey);
    incrementBodyLock();

    return () => {
      window.removeEventListener('keydown', onKey);
      decrementBodyLock();
      // restore focus
      try {
        previouslyFocused.current?.focus();
      } catch {
        /* ignore */
      }
    };
    // only attach when opening
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (closeOnOutsideClick) onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex ${POSITION_CLASSES[position]} bg-black bg-opacity-50`}
      // overlay receives clicks
      onClick={handleOverlayClick}
      aria-hidden={!isOpen}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={`bg-white rounded-lg shadow-xl ${WIDTH_CLASSES[width]} w-full mx-4 max-h-[90vh] overflow-y-auto pointer-events-auto`}
        // stop clicks inside from reaching overlay
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  /**
   * Optionally show/hide the close button.
   */
  showClose?: boolean;
}

export function ModalHeader({ title, onClose, showClose = true }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {showClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      )}
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
