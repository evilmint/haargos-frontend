'use client';
import * as React from 'react';

import { useEffect } from 'react';
import { useInstallationStore } from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';
import { Observation, Automation } from '@/app/types';
import { AutomationDataTable, AutomationTableView } from './automations-data-table';

export function AutomationsDataTableProxy({ ...params }) {
  const { installationId } = params;

  const observations = useInstallationStore(state => state.observations[installationId]);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(state => state.fetchObservationsForInstallation);
  const { getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently().then(token => {
      fetchInstallations(token)
        .then(() => fetchObservationsForInstallation(installationId, token))
        .catch(error => console.error(error));
    });
  }, [fetchInstallations, fetchObservationsForInstallation, user, getAccessTokenSilently, installationId]);

  const automations =
    observations?.length > 0 ? (observations[0].automations ?? []).map(a => mapToTableView(a, observations[0])) : [];

  return <AutomationDataTable data={automations} />;
}

function mapToTableView(automation: Automation, observation: Observation): AutomationTableView {
  return {
    id: automation.id,
    name: automation.friendly_name ?? '',
    state: automation.state ?? 'n/a',
    last_triggered: automation.last_triggered,
  };
}
