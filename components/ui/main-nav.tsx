'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import InstallationSwitcher from './installation-switcher';
import { useInstallationStore, useTeamStore } from '@/app/services/stores';
import { Button } from '@/registry/new-york/ui/button';

export function MainNav({ ...props }, { className }: React.HTMLAttributes<HTMLElement>) {
  const { installationId } = props;
  const dashboardClicked = useTeamStore(state => state.clearTeam);

  const installations = useInstallationStore(state => state.installations);

  const installation = installations.find(i => i.id == installationId);
  const installationInstanceLink = installation?.urls?.instance;

  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
      <Link
        href="/"
        onClick={() => dashboardClicked()}
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Dashboard
      </Link>
      <InstallationSwitcher installationId={installationId} />

      {installationInstanceLink && (
        <Button
          onClick={() => {
            window.open(installationInstanceLink, '_blank');
          }}
        >
          Home Assistant
        </Button>
      )}
    </nav>
  );
}
