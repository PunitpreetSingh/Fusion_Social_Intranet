import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ModalContextType {
  currentModal: string | null;
  modalData: any;
  openModal: (modalName: string, data?: any, pushRoute?: boolean) => void;
  closeModal: () => void;
  isOpen: (modalName: string) => boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [routePushed, setRoutePushed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/create/')) {
      const modalName = path.replace('/create/', '');
      if (modalName && currentModal !== modalName) {
        setCurrentModal(modalName);
        setRoutePushed(false);
      }
    } else if (path === '/create') {
      if (currentModal !== 'menu') {
        setCurrentModal('menu');
        setRoutePushed(false);
      }
    }
  }, [location.pathname]);

  const openModal = useCallback((modalName: string, data?: any, pushRoute = true) => {
    setCurrentModal(modalName);
    setModalData(data || null);
    setRoutePushed(pushRoute);

    if (pushRoute) {
      if (modalName === 'menu') {
        navigate('/create', { replace: false });
      } else {
        navigate(`/create/${modalName}`, { replace: false });
      }
    }
  }, [navigate]);

  const closeModal = useCallback(() => {
    setCurrentModal(null);
    setModalData(null);

    if (routePushed) {
      navigate(-1);
    } else {
      navigate('/');
    }
    setRoutePushed(false);
  }, [routePushed, navigate]);

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
