import { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';

interface ModalContextType {
  currentModal: string | null;
  modalData: any;
  openModal: (modalName: string, data?: any) => void;
  closeModal: () => void;
  isOpen: (modalName: string) => boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const isOpeningRef = useRef(false);

  const openModal = useCallback((modalName: string, data?: any) => {
    if (isOpeningRef.current || currentModal === modalName) return;

    isOpeningRef.current = true;
    setCurrentModal(modalName);
    setModalData(data || null);

    setTimeout(() => {
      isOpeningRef.current = false;
    }, 300);
  }, [currentModal]);

  const closeModal = useCallback(() => {
    setCurrentModal(null);
    setModalData(null);
  }, []);

  const isOpen = useCallback((modalName: string) => {
    return currentModal === modalName;
  }, [currentModal]);

  return (
    <ModalContext.Provider value={{ currentModal, modalData, openModal, closeModal, isOpen }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
}
