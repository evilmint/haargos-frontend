'use client';

import { useInstallationStore } from '@/app/services/stores/installation';
import { useTriggersState } from '@/app/services/stores/triggers';
import { AlarmHistory } from '@/app/types';
import { GenericDataTable } from '@/lib/generic-data-table';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { AlarmIncidentTableView, columns } from './incidents-data-table-columns';

export function IncidentsDataTableProxy({ ...params }) {
  const { installationId } = params;

  const fetchIncidents = useTriggersState(state => state.fetchTriggers);
  const reloadTriggers = useTriggersState(state => state.reloadTriggers);
  const incidents = useTriggersState(
    state => state.triggersByInstallationId[installationId],
  );
  const fetchObservationsForInstallation = useInstallationStore(
    state => state.fetchObservationsForInstallation,
  );
  const { getAccessTokenSilently, user } = useAuth0();

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchIncidents(installationId, token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [
    fetchIncidents,
    getAccessTokenSilently,
    fetchObservationsForInstallation,
    installationId,
    user,
  ]);

  const incidentViews: AlarmIncidentTableView[] = (incidents ?? []).map(i =>
    mapToTableView(i),
  );

  return (
    <GenericDataTable
      pluralEntityName="entries"
      filterColumnName="type"
      columns={columns}
      columnVisibilityKey="AlarmIncidentDataTable_columnVisibility"
      data={incidentViews}
      reload={async () => {
        const token = await getAccessTokenSilently();
        await reloadTriggers(installationId, token);
      }}
    />
  );
}

function mapToTableView(history: AlarmHistory): AlarmIncidentTableView {
  return {
    alarm_configuration: history.alarm_configuration,
    state: history.state,
    triggered_at: history.triggered_at,
  };
}
