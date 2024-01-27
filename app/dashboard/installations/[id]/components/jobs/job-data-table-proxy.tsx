'use client';

import { useInstallationStore } from '@/app/services/stores/installation';
import { useJobsStore } from '@/app/services/stores/jobs';
import { Job } from '@/app/types';
import { GenericDataTable } from '@/lib/generic-data-table';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { JobTableView, columns } from './job-data-table-columns';

export function JobsDataTableProxy({ ...params }) {
  const { installationId } = params;

  const fetchJobs = useJobsStore(state => state.fetchJobs);
  const reloadJobs = useJobsStore(state => state.reloadJobs);
  const jobs = useJobsStore(state => state.jobsByInstallationId[installationId]);
  const fetchObservationsForInstallation = useInstallationStore(
    state => state.fetchObservationsForInstallation,
  );
  const { getAccessTokenSilently, user } = useAuth0();

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchJobs(installationId, token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [
    fetchJobs,
    getAccessTokenSilently,
    fetchObservationsForInstallation,
    installationId,
    user,
  ]);

  if (!jobs) {
    return null;
  }

  const jobViews = jobs.map(j => mapToTableView(j));

  return (
    <>
      <GenericDataTable
        pluralEntityName="jobs"
        filterColumnName="type"
        columns={columns}
        columnVisibilityKey="JobDataTable_columnVisibility"
        data={jobViews}
        reload={async () => {
          const token = await getAccessTokenSilently();
          await reloadJobs(installationId, token);
        }}
      />
    </>
  );
}

function mapToTableView(job: Job): JobTableView {
  return {
    id: job.id,
    type: job.type,
    status: job.status_installation_id.split('_')[0],
    created_at: job.created_at,
  };
}
