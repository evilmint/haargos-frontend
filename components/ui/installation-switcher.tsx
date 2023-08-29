'use client';

import * as React from 'react';
import { CaretSortIcon, CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/new-york/ui/dialog';
import { Input } from '@/registry/new-york/ui/input';
import { Label } from '@/registry/new-york/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/new-york/ui/popover';
import { usePathname, useRouter } from 'next/navigation';
import { useInstallationStore, useInstallationSwitcherStore } from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import { Skeleton } from '@/registry/new-york/ui/skeleton';
import { Dot } from './dots';
import { Installation } from '@/app/types';

interface InstallationSwitcherProps {
  installationId: string;
  className: string;
}

export default function InstallationSwitcher({ className = '', installationId }: InstallationSwitcherProps) {
  const installations = useInstallationStore(state => state.installations);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const [open, setOpen] = React.useState(false);
  const [groups, setGroups] = React.useState<any[]>([]);
  const [showNewTeamDialog, setShowNewInstallationDialog] = React.useState(false);
  const [isVisible, setVisible] = React.useState<boolean>(true);

  const createInstallation = useInstallationStore(state => state.createInstallation);

  const selectedInstallation = useInstallationSwitcherStore(state => {
    return state.selectedInstallation;
  });

  const setSelectedTeam = useInstallationSwitcherStore(state => state.setSelectedInstallation);
  const { getAccessTokenSilently, user } = useAuth0();

  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isUpdating, setUpdating] = useState<boolean>(false);
  const pathname = usePathname();

  const [nameValue, setNameValue] = useState('');
  const [instanceValue, setInstanceValue] = useState('');
  const handleChange = (event: any) => {
    if (event.target.id == 'url') {
      setInstanceValue(event.target.value);
    } else if (event.target.id == 'name') {
      setNameValue(event.target.value);
    }
  };

  const handleSubmit = async () => {
    if (nameValue.trim().length > 0) {
      setUpdating(true);

      try {
        const accessToken = await getAccessTokenSilently();
        const installation = await createInstallation(accessToken, instanceValue, nameValue);

        if (installation != null) {
          setSelectedTeam(installation);
          setOpen(false);

          router.push('/installations/' + installation.id + '#install');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setShowNewInstallationDialog(false);
        setUpdating(false);
      }
    }
  };

  const fetchAndSetInstallations = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchInstallations(token);

      setGroups([
        {
          label: 'Installation',
          installations: installations,
        },
      ]);

      const paramInstallation = installations.filter(i => i.id === installationId);
      if (paramInstallation.length > 0 && paramInstallation[0] != null && selectedInstallation == null) {
        setSelectedTeam(paramInstallation[0]);
      }
    } catch {
      setVisible(false);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAndSetInstallations();
  }, [
    fetchInstallations,
    user,
    getAccessTokenSilently,
    installations,
    selectedInstallation,
    setSelectedTeam,
    installationId,
  ]);

  React.useEffect(() => {
    console.log(pathname);

    if (pathname == '/') {
      setSelectedTeam(null);
    }
  }, [pathname]);

  return isLoading ? (
    <Skeleton className="h-8 w-[150px]" />
  ) : isVisible ? (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewInstallationDialog}>
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
                {selectedInstallation?.healthy.is_healthy ? (
                  <div className="w-2 h-2 bg-green-600 rounded-full inline-block mr-2"></div>
                ) : (
                  <div className="w-2 h-2 bg-red-600 rounded-full inline-block mr-2"></div>
                )}
                {selectedInstallation.name}
              </>
            ) : (
              'Choose installation'
            )}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
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
                        setSelectedTeam(installation);
                        setOpen(false);

                        router.push('/installations/' + installation.id);
                      }}
                      className="text-sm"
                    >
                      {installation?.healthy.is_healthy ? <Dot.green /> : <Dot.red />}
                      {installation.name}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedInstallation?.id === installation.id ? 'opacity-100' : 'opacity-0',
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create installation</DialogTitle>
          <DialogDescription>Add a new HomeAssistant installation</DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" onChange={handleChange} placeholder="My Parents' Home" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Public HomeAssistant URL (optional)</Label>
              <Input id="url" onChange={handleChange} placeholder="https://my.homeassistant.url" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isUpdating} variant="outline" onClick={() => setShowNewInstallationDialog(false)}>
            Cancel
          </Button>
          <Button disabled={isUpdating} type="submit" onClick={handleSubmit}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <></>
  );
}
