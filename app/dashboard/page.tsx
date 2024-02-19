'use client';

import { useInstallationStore } from '@/app/services/stores/installation';
import { InstallationsAbsentContent } from '@/components/installations-absent-content';
import { InstallationsPresentContent } from '@/components/installations-present-content';
import { FullWidthConditionalLoading } from './installations/[id]/components/full-width-conditional-loading';
import { PageWrapper } from './installations/[id]/components/page-wrapper';

export default function DashboardPage() {
  const hasInstallations = useInstallationStore(state => state.installations).length > 0;
  const fetchedInstallations = useInstallationStore(state => state.fetchedInstallations);

  return (
    <PageWrapper>
      <FullWidthConditionalLoading isLoaded={fetchedInstallations}>
        {hasInstallations ? (
          <InstallationsPresentContent />
        ) : (
          <InstallationsAbsentContent />
        )}
      </FullWidthConditionalLoading>
    </PageWrapper>
  );
}
