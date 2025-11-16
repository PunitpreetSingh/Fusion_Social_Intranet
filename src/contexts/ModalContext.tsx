import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ModalState {
  name: string | null;
  payload: any;
}

interface ModalContextType {
  currentModal: string | null;
  modalData: any;
  openModal: (modalName: string, data?: any) => void;
  closeModal: () => void;
  isOpen: (modalName: string) => boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<ModalState>({ name: null, payload: null });

  const openModal = useCallback((modalName: string, data?: any) => {
    setModalState({ name: modalName, payload: data || null });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ name: null, payload: null });
  }, []);

  const isOpen = useCallback((modalName: string) => {
    return modalState.name === modalName;
  }, [modalState.name]);

  return (
    <ModalContext.Provider
      value={{
        currentModal: modalState.name,
        modalData: modalState.payload,
        openModal,
        closeModal,
        isOpen
      }}
    >
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
