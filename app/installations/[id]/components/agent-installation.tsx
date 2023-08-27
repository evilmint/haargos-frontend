'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import { useEffect, useState } from 'react';
import { useInstallationStore } from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';
import Code from './code';

export function AgentInstallation({ ...params }) {
  const { installationId } = params;
  const observations = useInstallationStore(state => state.observations[installationId]);
  const installations = useInstallationStore(state => state.installations);
  const installation = installations.find(i => i.id == installationId);
  const highestStorage = useInstallationStore(state => state.highestStorageByInstallationId[installationId]);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(state => state.fetchObservationsForInstallation);
  const latestHaRelease = useInstallationStore(state => state.latestHaRelease);
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getAccessTokenSilently().then(token => {
      fetchInstallations(token)
        .then(() => fetchObservationsForInstallation(installationId, token))
        .then(() => setLoading(false))
        .catch(error => console.error(error));
    });
  }, [fetchInstallations, getAccessTokenSilently, user, fetchObservationsForInstallation, installationId]);

  const command = 'curl -Ls http://dist.haargos.smartrezydencja.pl/install.sh -o install.sh && sudo bash install.sh';

  return (
    installation && (
      <Card className="col-span-7">
        <CardHeader>
          <CardTitle>Install Haargos</CardTitle>
        </CardHeader>
        <CardContent>
          <h5>Agent token</h5>
          <Code>{installation.agent_token}</Code>
          <h5 className="mt-6">Install script</h5>
          <Code>{command}</Code>
        </CardContent>
      </Card>
    )
  );
}
