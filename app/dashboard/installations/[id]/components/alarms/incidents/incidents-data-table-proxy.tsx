'use client';

import { useInstallationStore } from '@/app/services/stores/installation';
import { useJobsStore } from '@/app/services/stores/jobs';
import { Job } from '@/app/types';
import { GenericDataTable } from '@/lib/generic-data-table';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { AlarmIncidentTableView, columns } from './incidents-data-table-columns';

export function IncidentsDataTableProxy({ ...params }) {
  const { installationId } = params;

  const fetchIncidents = useJobsStore(state => state.fetchJobs);
  const reloadJobs = useJobsStore(state => state.reloadJobs);
  const incidents = useJobsStore(state => state.jobsByInstallationId[installationId]);
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

  const incidentViews: AlarmIncidentTableView[] = []; // (incidents ?? []).map(i => mapToTableView(i));

  return (
    <GenericDataTable
      pluralEntityName="entries"
      filterColumnName="type"
      columns={columns}
      columnVisibilityKey="AlarmIncidentDataTable_columnVisibility"
      data={incidentViews}
      reload={async () => {
        const token = await getAccessTokenSilently();
        await reloadJobs(installationId, token);
      }}
    />
  );
}

function mapToTableView(job: Job): AlarmIncidentTableView {
  return {
    id: job.id,
    type: job.type,
    status: job.status_installation_id.split('_')[0],
    created_at: job.created_at,
    updated_at: job.updated_at ?? job.created_at,
  };
}
