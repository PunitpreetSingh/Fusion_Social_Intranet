import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { ProfileModal } from './components/ProfileModal';
import { AppSearchModal } from './components/AppSearchModal';
import { CreateContentModal } from './components/CreateContentModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { StatusUpdateModal } from './components/StatusUpdateModal';
import { DocumentForm } from './components/DocumentForm';
import { BlogPostForm } from './components/BlogPostForm';
import { CreateSpaceForm } from './components/CreateSpaceForm';
import { useConfiguration } from './hooks/useConfiguration';
import { useUser } from './hooks/useUser';
import { useModal } from './contexts/ModalContext';

const SpaceOverview = lazy(() => import('./pages/SpaceOverview/SpaceOverview'));
const NewsList = lazy(() => import('./pages/News/NewsList'));
const NewsDetail = lazy(() => import('./pages/News/NewsDetail'));

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Something went wrong, please try again later.</div>}>
      {children}
    </Suspense>
  );
}

function App() {
  const { config } = useConfiguration();
  const { user } = useUser();
  const { openModal, closeModal, isOpen } = useModal();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAppSearchModalOpen, setIsAppSearchModalOpen] = useState(false);
  const [isGlobalSearchModalOpen, setIsGlobalSearchModalOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* ---------------- HEADER ---------------- */}
      <Header
        onPeopleClick={() => setIsProfileModalOpen(true)}
        onNotificationsClick={() => console.log('Notifications clicked')}
        onAppsClick={() => setIsAppSearchModalOpen(true)}
        onCreateClick={() => openModal('menu', { user })}
        onSearchClick={() => setIsGlobalSearchModalOpen(true)}
      />

      {/* ---------------- MODALS ---------------- */}
      {config && (
        <>
          <ProfileModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            config={config.profile_modal_config}
            user={user}
          />

          <AppSearchModal
            isOpen={isAppSearchModalOpen}
            onClose={() => setIsAppSearchModalOpen(false)}
            config={config.app_search_config}
          />

          <GlobalSearchModal
            isOpen={isGlobalSearchModalOpen}
            onClose={() => setIsGlobalSearchModalOpen(false)}
          />
        </>
      )}

      <CreateContentModal
        isOpen={isOpen('menu')}
        onClose={closeModal}
        user={user}
      />

      {isOpen('status_update') && (
        <StatusUpdateModal isOpen={true} onClose={closeModal} user={user} />
      )}

      {isOpen('document') && (
        <DocumentForm isOpen={true} onClose={closeModal} user={user} />
      )}

      {isOpen('blog_post') && (
        <BlogPostForm isOpen={true} onClose={closeModal} user={user} />
      )}

      {isOpen('space') && (
        <CreateSpaceForm isOpen={true} onClose={closeModal} user={user} />
      )}

      {/* ---------------- ROUTES ---------------- */}
      <ErrorBoundary>
        <Routes>
          {/* Default homepage → Space. Change ID anytime */}
          <Route path="/" element={<Navigate to="/space/1" replace />} />
          <Route path="/space/:spaceId" element={<SpaceOverview />} />
          <Route path="/space/:spaceId/news" element={<NewsList />} />
          <Route path="/space/:spaceId/news/:newsId" element={<NewsDetail />} />

          {/* Catch-all route */}
          <Route
            path="*"
            element={<div style={{ padding: 40 }}>Page Not Found</div>}
          />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
