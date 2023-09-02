'use client';

import { Button } from '@/registry/new-york/ui/button';
import { CreateInstallationForm } from './ui/create-installation-form';
import { useInstallationSwitcherStore } from '@/app/services/stores';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/new-york/ui/dialog';
import { Label } from '@/registry/new-york/ui/label';
import { Input } from '@/registry/new-york/ui/input';
import { Icons } from './icons';

export function InstallationsAbsentContent() {
  const setSelectedTeam = useInstallationSwitcherStore(
    state => state.setSelectedInstallation,
  );
  const [showNewInstallationDialog, setShowNewInstallationDialog] = React.useState(false);
  const router = useRouter();

  return (
    <div className="m-5">
      <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <Icons.home className="w-10 h-10" />

          <h3 className="mt-4 text-lg font-semibold">No installations added</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            You have not added any installations. Add one below.
          </p>
          <CreateInstallationForm
            onCreateInstallation={installation => {
              setSelectedTeam(installation);
              router.push('/installations/' + installation.id + '#install');
            }}
            open={showNewInstallationDialog}
            onOpenChange={setShowNewInstallationDialog}
          >
            <Button onClick={() => setShowNewInstallationDialog(true)}>Create</Button>
          </CreateInstallationForm>
        </div>
      </div>
    </div>
  );
}
/*
<div className="container w-[80%] items-center flex pt-40 pb-40 w-[40%] mt-20 rounded-lg h-full block flex-col gap-5 justify-center border-dashed border-2 border-gray-200 p-5">
      <h1 className="scroll-m-20 text-4xl font-regular tracking-tight lg:text-3xl">
        Create your first Installation
      </h1>

      <CreateInstallationForm
        onCreateInstallation={installation => {
          setSelectedTeam(installation);
          router.push('/installations/' + installation.id + '#install');
        }}
        open={showNewInstallationDialog}
        onOpenChange={setShowNewInstallationDialog}
      >
        <Button onClick={() => setShowNewInstallationDialog(true)}>Create</Button>
      </CreateInstallationForm>
    </div>
    */
