'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import InstallationSwitcher from './installation-switcher';
import {
  useInstallationStore,
  useInstallationSwitcherStore,
  useUserStore,
} from '@/app/services/stores';
import { Button } from '@/registry/new-york/ui/button';
import { ModeToggle } from './mode-toggle';
import { Icons } from '../icons';
import { LucideExternalLink } from 'lucide-react';

export function MainNav({ ...props }, { className }: React.HTMLAttributes<HTMLElement>) {
  const { installationId } = props;
  const dashboardClicked = useInstallationSwitcherStore(state => state.clearInstallation);

  const { user } = useUserStore(state => state);
  const installations = useInstallationStore(state => state.installations);

  const installation = installations.find(i => i.id == installationId);
  const installationInstanceLink = installation?.urls?.instance;

  return (
    <nav className={cn('flex items-center w-auto space-x-3', className)}>
      {user && (
        <>
          <Link
            href="/"
            onClick={() => dashboardClicked()}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            <Icons.home className="w-5 h-5" />
          </Link>

          <InstallationSwitcher installationId={installationId} />
        </>
      )}

      {installationInstanceLink && (
        <Button
          variant="outline"
          onClick={() => {
            window.open(installationInstanceLink, '_blank');
          }}
        >
          <LucideExternalLink className="h-4 w-4" />
        </Button>
      )}

      <ModeToggle />
    </nav>
  );
}
