'use client';
import * as React from 'react';

import { useEffect } from 'react';
import { useInstallationStore } from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';
import { Observation, Automation, Script } from '@/app/types';
import { ScriptsDataTable, ScriptTableView } from './scripts-data-table';

export function ScriptsDataTableProxy({ ...params }) {
  const { installationId } = params;

  const observations = useInstallationStore(state => state.observations[installationId]);
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

  let scripts: ScriptTableView[] = [];

  if (observations && observations.length > 0) {
    scripts = observations[0].scripts.map(s => mapToTableView(s, observations[0]));
  }
  return <ScriptsDataTable data={scripts} />;
}

function mapToTableView(script: Script, observation: Observation): ScriptTableView {
  return {
    alias: script.alias,
    name: script.friendly_name ?? '',
    state: script.state ?? 'n/a',
    last_triggered: script.lastTriggered,
  };
}
