'use client';
import { useInstallationStore } from '@/app/services/stores/installation';
import { useLogsStore } from '@/app/services/stores/logs';
import { Log, LogSource } from '@/app/types';
import { HALink } from '@/components/ha-link';
import { GenericDataTable } from '@/lib/generic-data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york/ui/tabs';
import { useAuth0 } from '@auth0/auth0-react';
import { strip } from 'ansicolor';
import { useEffect } from 'react';
import CopyButton from '../../copy-button';
import DownloadButton from '../../download-button';
import { LogTableView, columns } from './logs-data-table-columns';

interface LogsDataTableProxyParams {
  installationId: string;
  logSource: LogSource;
}

export function LogsDataTableProxy(params: LogsDataTableProxyParams) {
  const installations = useInstallationStore(state => state.installations);
  const fetchLogs = useLogsStore(state => state.fetchLogs);
  const logs = useLogsStore(state => state.logsByInstallationId[params.installationId]);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(
    state => state.fetchObservationsForInstallation,
  );
  const { getAccessTokenSilently, user } = useAuth0();

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchLogs(params.installationId, params.logSource, token, false);
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
    params.installationId,
    user,
  ]);

  const logViews =
    logs && logs[params.logSource] ? logs[params.logSource].map(mapToTableView) : [];

  const installation = installations.find(i => i.id == params.installationId);
  const logFilename = `logs-${(installation?.name ?? 'default').replace(
    /[^a-zA-Z0-9\u00C0-\u017F]/g,
    '_',
  )}-${params.logSource}-${new Date().getTime()}.txt`;
  const concatenatedLogs =
    logs && logs[params.logSource]
      ? logs[params.logSource].map(l => l.raw).join('\n')
      : '';

  return (
    <>
      <Tabs defaultValue="logtable" className="space-y-4">
        <TabsList className="ml-4">
          <TabsTrigger value="logtable">Table</TabsTrigger>
          <TabsTrigger
            value="lograw"
            disabled={logs == null || logs[params.logSource]?.length == 0}
          >
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
            defaultColumnVisibility={{ type: false }}
            columnVisibilityKey="LogsDataTable_columnVisibility"
            data={logViews}
            reload={async () => {
              const token = await getAccessTokenSilently();
              await fetchLogs(params.installationId, params.logSource, token, true);
            }}
          />
        </TabsContent>

        <TabsContent value="lograw">
          <div className="relative mx-auto mt-4">
            {logs && logs[params.logSource]?.length > 0 && (
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
                  <code className="">{strip(concatenatedLogs)}</code>
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
    id: (log.time?.toString() ?? '') + log.log,
    type: log.type,
    log: { content: log.log, color: log.color ?? null },
    time: log.time,
    thread: log.thread,
    color: log.color ?? null,
  };
}
