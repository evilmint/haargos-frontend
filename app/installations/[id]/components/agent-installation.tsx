'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import { useEffect } from 'react';
import { useInstallationStore } from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';
import Code from './code';

export function AgentInstallation({ ...params }) {
  const { installationId } = params;
  const installation = useInstallationStore(state => state.installations).find(
    i => i.id == installationId,
  );
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(
    state => state.fetchObservationsForInstallation,
  );
  const { getAccessTokenSilently, user } = useAuth0();

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchObservationsForInstallation(installationId, token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [
    fetchInstallations,
    getAccessTokenSilently,
    fetchObservationsForInstallation,
    installationId,
    user,
  ]);

  const command = process.env.NEXT_PUBLIC_INSTALL_AGENT_COMMAND ?? '';

  return (
    installation && (
      <Card className="col-span-7">
        <CardHeader>
          <CardTitle>Install Haargos on {installation.name}</CardTitle>
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
