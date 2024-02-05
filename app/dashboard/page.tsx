'use client';

import { useInstallationStore } from '@/app/services/stores/installation';
import { useUserStore } from '@/app/services/stores/user';
import { InstallationsAbsentContent } from '@/components/installations-absent-content';
import { InstallationsPresentContent } from '@/components/installations-present-content';
import { PageWrapper } from './installations/[id]/components/page-wrapper';

export default function DashboardPage() {
  const user = useUserStore(state => state.user);
  const hasInstallations = useInstallationStore(state => state.installations).length > 0;

  return (
    <PageWrapper>
      {user &&
        (hasInstallations ? (
          <InstallationsPresentContent />
        ) : (
          <InstallationsAbsentContent />
        ))}
    </PageWrapper>
  );
}
