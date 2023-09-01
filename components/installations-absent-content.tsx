'use client';

import { Button } from '@/registry/new-york/ui/button';
import { CreateInstallationForm } from './ui/create-installation-form';
import { useInstallationSwitcherStore } from '@/app/services/stores';
import { useRouter } from 'next/navigation';
import React from 'react';

export function InstallationsAbsentContent() {
  const setSelectedTeam = useInstallationSwitcherStore(
    state => state.setSelectedInstallation,
  );
  const [showNewInstallationDialog, setShowNewInstallationDialog] = React.useState(false);
  const router = useRouter();

  return (
    <div className="container w-max items-center flex pt-40 pb-40 w-[40%] mt-20 rounded-lg h-full block flex-col gap-5 justify-center border-dashed border-2 border-gray-200 p-5">
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
  );
}
