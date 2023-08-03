'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import InstallationSwitcher from './installation-switcher';
import { useTeamStore } from '@/app/services/stores';

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const dashboardClicked = useTeamStore(state => state.clearTeam);

  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      <Link
        href="/"
        onClick={() => dashboardClicked()}
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Dashboard
      </Link>
      <InstallationSwitcher />
    </nav>
  );
}
