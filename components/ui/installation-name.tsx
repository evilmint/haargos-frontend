'use client';

import { useEffect } from 'react';
import { useInstallationStore } from '@/app/services/stores';

export function InstallationName({ ...params }) {
  const { installationId } = params;
  const installations = useInstallationStore(state => state.installations);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);

  useEffect(() => {
    fetchInstallations().catch(error => console.error(error));
  }, [fetchInstallations, installationId]);

  return <h1 className="font-bold text-2xl">{installations.filter(i => i.id == installationId)[0]?.name ?? 'n/a'}</h1>;
}
