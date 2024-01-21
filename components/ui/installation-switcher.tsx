'use client';

import { CaretSortIcon, CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';

import { useInstallationStore } from '@/app/services/stores/installation';
import { useInstallationSwitcherStore } from '@/app/services/stores/installation-switcher';
import { Installation } from '@/app/types';
import { cn } from '@/lib/utils';
import { Button } from '@/registry/new-york/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/registry/new-york/ui/command';
import { DialogTrigger } from '@/registry/new-york/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/new-york/ui/popover';
import { Skeleton } from '@/registry/new-york/ui/skeleton';
import { useAuth0 } from '@auth0/auth0-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CreateInstallationForm } from './create-installation-form';
import { Dot } from './dots';

interface InstallationSwitcherProps {
  installationId: string;
  className?: string;
}

export default function InstallationSwitcher({
  className = '',
  installationId,
}: InstallationSwitcherProps) {
  const installations = useInstallationStore(state => state.installations);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [showNewInstallationDialog, setShowNewInstallationDialog] = useState(false);

  const selectedInstallation = useInstallationSwitcherStore(state => {
    return state.selectedInstallation;
  });

  const setSelectedInstallation = useInstallationSwitcherStore(
    state => state.setSelectedInstallation,
  );
  const { getAccessTokenSilently, user } = useAuth0();

  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();

  const fetchAndSetInstallations = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchInstallations(token, false);

      setGroups([
        {
          label: 'Installation',
          installations: installations,
        },
      ]);

      const paramInstallation = installations.filter(i => i.id === installationId);
      if (
        paramInstallation.length > 0 &&
        paramInstallation[0] != null &&
        selectedInstallation == null
      ) {
        setSelectedInstallation(paramInstallation[0]);
      }
    } catch {
      //setVisible(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetInstallations();
  }, [
    fetchInstallations,
    user,
    getAccessTokenSilently,
    installations,
    selectedInstallation,
    setSelectedInstallation,
    installationId,
  ]);

  useEffect(() => {
    if (pathname == '/dashboard') {
      setSelectedInstallation(null);
    }
  }, [pathname]);

  useEffect(() => {
    setGroups([
      {
        label: 'Installation',
        installations: installations,
      },
    ]);

    const paramInstallation = installations.filter(i => i.id === installationId);
    if (
      paramInstallation.length > 0 &&
      paramInstallation[0] != null &&
      (selectedInstallation == null ||
        selectedInstallation.name != paramInstallation[0].name)
    ) {
      setSelectedInstallation(paramInstallation[0]);
    }
  }, [installations]);

  function dotForInstallation(installation: Installation) {
    return installation && installation.health_statuses.length > 0 ? (
      installation.health_statuses[installation.health_statuses.length - 1].is_up ? (
        <Dot.green />
      ) : (
        <Dot.red />
      )
    ) : (
      <Dot.gray />
    );
  }

  return isLoading ? (
    <Skeleton className="h-8 w-[150px]" />
  ) : true ? (
    <CreateInstallationForm
      onCreateInstallation={installation => {
        setSelectedInstallation(installation);
        setOpen(false);
        router.push('/dashboard/installations/' + installation.id + '#install');
      }}
      open={showNewInstallationDialog}
      onOpenChange={setShowNewInstallationDialog}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select an installation"
            className={cn('w-[220px] justify-between', className)}
          >
            {selectedInstallation?.name != null ? (
              <>
                {dotForInstallation(selectedInstallation)}

                {selectedInstallation.name}
              </>
            ) : (
              'Choose installation'
            )}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search installation..." />
              <CommandEmpty>No installation found.</CommandEmpty>
              {groups.map(group => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.installations.map((installation: Installation) => (
                    <CommandItem
                      key={installation.id}
                      onSelect={() => {
                        setSelectedInstallation(installation);
                        setOpen(false);

                        router.push('/dashboard/installations/' + installation.id);
                      }}
                      className="text-sm"
                    >
                      {dotForInstallation(installation)}

                      {installation.name}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedInstallation?.id === installation.id
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewInstallationDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Installation
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </CreateInstallationForm>
  ) : (
    <></>
  );
}
