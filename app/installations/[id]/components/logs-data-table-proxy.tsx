'use client';
import * as React from 'react';

import { useEffect } from 'react';
import { useInstallationStore } from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';
import { Log } from '@/app/types';
import { LogsDataTable, LogTableView } from './logs-data-table';

export function LogsDataTableProxy({ ...params }) {
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

  const logs = (useInstallationStore(state => state.logsByInstallationId[installationId]) ?? []).map(log =>
    mapToTableView(log),
  );

  return <LogsDataTable data={logs} />;
}

function mapToTableView(log: Log): LogTableView {
  return {
    id: log.time,
    type: log.type,
    log: log.log,
    time: new Date(log.time),
    thread: log.thread,
  };
}
