'use client';

import { Button } from '@/registry/new-york/ui/button';
import { useRouter } from 'next/navigation';
import TimeAgo from 'react-timeago';

import { useInstallationStore } from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

export function Installations() {
  const installations = useInstallationStore(state => state.installations);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const { getAccessTokenSilently } = useAuth0();

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchInstallations(token, false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [fetchInstallations, getAccessTokenSilently]);

  const router = useRouter();

  return installations.map((installation: any) => {
    return (
      <div className="flex items-center space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">{installation.name}</p>
          <p className="text-sm text-muted-foreground">
            Last agent activity: <TimeAgo date={installation.last_agent_connection} />
          </p>
        </div>
        <div className="ml-auto space-x-2 font-medium">
          <Button
            onClick={() => {
              router.push('/dashboard/installations/' + installation.id);
            }}
          >
            Open
          </Button>
          <Button
            onClick={() => {
              //window.open(installation.urls.instance, "_blank");
            }}
          >
            HA
          </Button>
        </div>
      </div>
    );
  });
}
