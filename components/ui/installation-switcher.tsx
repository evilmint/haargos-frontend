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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york/ui/select';
import { useRouter } from 'next/navigation';
import { useInstallationStore, useTeamStore } from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import { Skeleton } from '@/registry/new-york/ui/skeleton';
import { Dot } from './dots';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface TeamSwitcherProps extends PopoverTriggerProps {
  installationId: string;
}

export default function InstallationSwitcher({ className, installationId }: TeamSwitcherProps) {
  const installations = useInstallationStore(state => state.installations);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const [open, setOpen] = React.useState(false);
  const [groups, setGroups] = React.useState<any[]>([]);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [isVisible, setVisible] = React.useState<boolean>(true);

  const selectedTeam = useTeamStore(state => {
    return state.selectedTeam;
  });

  const setSelectedTeam = useTeamStore(state => state.setSelectedTeam);
  const { getAccessTokenSilently, user } = useAuth0();

  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);

  React.useEffect(() => {
    getAccessTokenSilently()
      .then(token => {
        fetchInstallations(token)
          .then(() => {
            setGroups([
              {
                label: 'Installation',
                teams: installations.map(i => {
                  return { label: i.name, healthy: i.healthy?.is_healthy ?? false, value: i.id };
                }),
              },
            ]);

            var paramInstallation = installations.filter(i => i.id == installationId);

            // selectedTeam == null breaks infinite loop
            if (paramInstallation.length > 0 && paramInstallation[0] != null && selectedTeam == null) {
              const i = paramInstallation[0];
              setSelectedTeam({
                label: i.name,
                healthy: i.healthy?.is_healthy ?? false,
                value: i.id,
              });
            }
          })
          .catch(() => {
            setVisible(false);
          })
          .finally(() => setLoading(false));
      })
      .catch(() => {
        setVisible(false);
        setLoading(false);
      });
  }, [fetchInstallations, user, getAccessTokenSilently, installations, selectedTeam, setSelectedTeam, installationId]);

  return isLoading ? (
    <Skeleton className="h-8 w-[150px]" />
  ) : isVisible ? (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn('w-[220px] justify-between', className)}
          >
            {selectedTeam?.label != null ? (
              <>
                {selectedTeam?.healthy ? (
                  <div className="w-2 h-2 bg-green-600 rounded-full inline-block mr-2"></div>
                ) : (
                  <div className="w-2 h-2 bg-red-600 rounded-full inline-block mr-2"></div>
                )}
                {selectedTeam.label}
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
                  {group.teams.map((installation: any) => (
                    <CommandItem
                      key={installation.value}
                      onSelect={() => {
                        setSelectedTeam(installation);
                        setOpen(false);

                        router.push('/installations/' + installation.value);
                      }}
                      className="text-sm"
                    >
                      {installation?.healthy ? <Dot.green /> : <Dot.red />}
                      {installation.label}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedTeam?.value === installation.value ? 'opacity-100' : 'opacity-0',
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
                      setShowNewTeamDialog(true);
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
          <DialogDescription>Add a new team to manage products and customers.</DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team name</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    <span className="font-medium">Free</span> -{' '}
                    <span className="text-muted-foreground">Trial for two weeks</span>
                  </SelectItem>
                  <SelectItem value="pro">
                    <span className="font-medium">Pro</span> -{' '}
                    <span className="text-muted-foreground">$9/month per user</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <></>
  );
}
