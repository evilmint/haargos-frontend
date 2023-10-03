'use client';
import * as React from 'react';

import { useEffect } from 'react';
import { useInstallationStore } from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';
import { Automation } from '@/app/types';
import { AutomationTableView, columns } from './automations-data-table-columns';
import { GenericDataTable } from '@/lib/generic-data-table';

export function AutomationsDataTableProxy({ ...params }) {
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
      await fetchObservationsForInstallation(installationId, token, false);
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

  let automations: AutomationTableView[] = [];

  if (observations && observations.length > 0) {
    automations = observations[0].automations.map(mapToTableView);
  }
  
  return <GenericDataTable
    columns={columns}
    columnVisibilityKey="AutomationDataTable_columnVisibility"
    data={automations}
  />;
}

function mapToTableView(automation: Automation): AutomationTableView {
  return {
    id: automation.id,
    name: automation.friendly_name ?? '',
    state: automation.state ?? 'n/a',
    last_triggered: automation.last_triggered,
  };
}
