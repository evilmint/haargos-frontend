'use client';
import * as React from 'react';

import { useEffect } from 'react';
import { useInstallationStore } from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';
import { Log } from '@/app/types';
import { LogsDataTable, LogTableView } from './logs-data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york/ui/tabs';
import CopyButton from '../copy-button';
import DownloadButton from '../download-button';

export function LogsDataTableProxy({ ...params }) {
  const { installationId } = params;

  const installations = useInstallationStore(state => state.installations);
  const logs = useInstallationStore(state => state.logsByInstallationId[installationId]);
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

  const logViews = (useInstallationStore(state => state.logsByInstallationId[installationId]) ?? []).map(log =>
    mapToTableView(log),
  );

  const installation = installations.find(i => i.id == installationId);
  const logFilename = `logs-${(installation?.name ?? 'default').replace(
    /[^a-zA-Z0-9\u00C0-\u017F]/g,
    '_',
  )}-${new Date().getTime()}.txt`;

  return (
    <Tabs defaultValue="logtable" className="space-y-4">
      <h3 className="inline ml-4 font-semibold">Logs</h3>
      <TabsList className="ml-4">
        <TabsTrigger value="logtable">Table</TabsTrigger>
        <TabsTrigger value="lograw">Raw</TabsTrigger>
      </TabsList>
      <TabsContent value="logtable" className="space-y-4">
        <LogsDataTable data={logViews} />
      </TabsContent>

      <TabsContent value="lograw">
        <div className="relative mx-auto mt-4">
          <CopyButton textToCopy={(logs ?? []).map((l: Log) => l.raw).join('\n')} />
          <DownloadButton fileName={logFilename} textToCopy={(logs ?? []).map((l: Log) => l.raw).join('\n')} />
          <div className="bg-slate-950 text-white p-4 rounded-md">
            <div className="flex justify-between items-center mb-2"></div>
            <div className="overflow-x-auto">
              <pre id="code" className="text-gray-300 text-xs leading-4">
                <code>{(logs ?? []).map((l: Log) => l.raw).join('\n')}</code>
              </pre>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function mapToTableView(log: Log): LogTableView {
  return {
    id: log.time,
    type: log.type,
    log: log.log,
    time: log.time,
    thread: log.thread,
  };
}
