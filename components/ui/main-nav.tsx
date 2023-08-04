'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import InstallationSwitcher from './installation-switcher';
import { useTeamStore } from '@/app/services/stores';

export function MainNav({...props }, { className }: React.HTMLAttributes<HTMLElement>) {
  const { installationId } = props;
  const dashboardClicked = useTeamStore(state => state.clearTeam);

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
    </nav>
  );
}
