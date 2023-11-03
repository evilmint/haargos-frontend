'use client';

import HomeComponent from '@/components/home-component';
import { InstallationsAbsentContent } from '@/components/installations-absent-content';
import { InstallationsPresentContent } from '@/components/installations-present-content';
import { MainNav } from '@/components/ui/main-nav';
import { UserNav } from '@/components/ui/user-nav';
import { useInstallationStore, useUserStore } from './services/stores';

export default function DashboardPage() {
  const user = useUserStore(state => state.user);
  const hasInstallations = useInstallationStore(state => state.installations).length > 0;

  const Dashboard = (
    <div className="flex-col sm:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>

      {user &&
        (hasInstallations ? (
          <InstallationsPresentContent />
        ) : (
          <InstallationsAbsentContent />
        ))}

    </div>
  );

  if (user) {
    return Dashboard
  } else {
    return <HomeComponent />
  }
}
