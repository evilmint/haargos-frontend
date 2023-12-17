'use client';

import { useInstallationStore } from '@/app/services/stores';
import { Log } from '@/app/types';
import { HALink } from '@/components/ha-link';
import { GenericDataTable } from '@/lib/generic-data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york/ui/tabs';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import CopyButton from '../copy-button';
import DownloadButton from '../download-button';
import { LogTableView, columns } from './logs-data-table-columns';

export function LogsDataTableProxy({ ...params }) {
  const { installationId } = params;

  const installations = useInstallationStore(state => state.installations);
  const logs = useInstallationStore(state => state.logsByInstallationId[installationId]);
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

  const logViews = (logs ?? []).map(mapToTableView);

  const installation = installations.find(i => i.id == installationId);
  const logFilename = `logs-${(installation?.name ?? 'default').replace(
    /[^a-zA-Z0-9\u00C0-\u017F]/g,
    '_',
  )}-${new Date().getTime()}.txt`;
  const concatenatedLogs = (logs ?? []).map((l: Log) => l.raw).join('\n');

  return (
    <>
      <Tabs defaultValue="logtable" className="space-y-4">
        <h3 className="inline ml-4 font-semibold">Logs</h3>

        <TabsList className="ml-4">
          <TabsTrigger value="logtable">Table</TabsTrigger>
          <TabsTrigger value="lograw" disabled={logs == null || logs.length == 0}>
            Raw
          </TabsTrigger>
        </TabsList>
        <div className="block">
          {installation?.urls.instance?.success_url && (
            <HALink
              installationName={installation?.name}
              actionName="Logs"
              instanceHost={installation?.urls.instance?.success_url}
              domain="logs"
            />
          )}
        </div>
        <TabsContent value="logtable" className="space-y-4">
          <GenericDataTable
            pluralEntityName="logs"
            columns={columns}
            filterColumnName="log"
            columnVisibilityKey="LogsDataTable_columnVisibility"
            data={logViews}
          />
        </TabsContent>

        <TabsContent value="lograw">
          <div className="relative mx-auto mt-4">
            {logs?.length > 0 && (
              <>
                <CopyButton textToCopy={concatenatedLogs} />
                <DownloadButton fileName={logFilename} textToCopy={concatenatedLogs} />
              </>
            )}
            <div className="bg-slate-700 text-white p-4 w-[100%] rounded-md">
              <div className="flex justify-between items-center mb-2"></div>
              <div className="">
                <pre
                  id="code"
                  className="text-gray-300 break-words w-[97%] h-[750px] text-xs leading-4 overflow-y-scroll"
                >
                  <code className=''>{concatenatedLogs}</code>
                </pre>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

function mapToTableView(log: Log): LogTableView {
  return {
    id: log.time.toString() + log.log,
    type: log.type,
    log: log.log,
    time: log.time,
    thread: log.thread,
  };
}
