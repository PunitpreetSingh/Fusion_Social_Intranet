import { useState } from 'react';
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

function App() {
  const { config, loading: configLoading } = useConfiguration();
  const { user, loading: userLoading } = useUser();
  const { openModal, closeModal, isOpen } = useModal();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAppSearchModalOpen, setIsAppSearchModalOpen] = useState(false);
  const [isGlobalSearchModalOpen, setIsGlobalSearchModalOpen] = useState(false);

  const handleNotificationsClick = () => {
    console.log('Notifications clicked');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        onPeopleClick={() => setIsProfileModalOpen(true)}
        onNotificationsClick={handleNotificationsClick}
        onAppsClick={() => setIsAppSearchModalOpen(true)}
        onCreateClick={() => openModal('menu', { user })}
        onSearchClick={() => setIsGlobalSearchModalOpen(true)}
      />

      <>
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
      </>

      {isOpen('status_update') && (
        <StatusUpdateModal
          isOpen={true}
          onClose={closeModal}
          user={user}
        />
      )}

      {isOpen('document') && (
        <DocumentForm
          isOpen={true}
          onClose={closeModal}
          user={user}
        />
      )}

      {isOpen('blog_post') && (
        <BlogPostForm
          isOpen={true}
          onClose={closeModal}
          user={user}
        />
      )}

      {isOpen('space') && (
        <CreateSpaceForm
          isOpen={true}
          onClose={closeModal}
          user={user}
        />
      )}
    </div>
  );
}

export default App;
