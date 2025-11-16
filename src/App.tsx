import { useState } from 'react';
import { Header } from './components/Header';
import { ProfileModal } from './components/ProfileModal';
import { AppSearchModal } from './components/AppSearchModal';
import { CreateContentModal } from './components/CreateContentModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { useConfiguration } from './hooks/useConfiguration';
import { useUser } from './hooks/useUser';

function App() {
  const { config, loading: configLoading } = useConfiguration();
  const { user, loading: userLoading } = useUser();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAppSearchModalOpen, setIsAppSearchModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
        onCreateClick={() => setIsCreateModalOpen(true)}
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
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          user={user}
        />
      </>
    </div>
  );
}

export default App;
