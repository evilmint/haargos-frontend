import { useInstallationStore } from '@/app/services/stores';
import { LogSource } from '@/app/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york/ui/tabs';
import { LogsDataTableProxy } from './logs-data-table-proxy';

interface LogSwitcherParams {
  installationId: string;
}

export function LogSwitcher(params: LogSwitcherParams) {
  const { observations } = useInstallationStore(state => ({
    observations: state.observations[params.installationId],
    fetchObservationsForInstallation: state.fetchObservationsForInstallation,
  }));

  let logTypesAvailable: { source: LogSource; name: string }[] = [
    { source: 'core', name: 'Core' },
  ];

  if (observations?.[0]?.agent_type === 'addon') {
    logTypesAvailable.push(
      { source: 'supervisor', name: 'Supervisor' },
      { source: 'host', name: 'Host' },
    );
  }

  return (
    <div>
      <h3 className="ml-4 font-semibold mb-4 block">Logs</h3>
      <Tabs
        onValueChange={() => {
          console.log('tab changed');
        }}
        defaultValue="core"
        className="space-y-4"
      >
        <TabsList className="ml-4">
          {logTypesAvailable.map(t => (
            <TabsTrigger value={t.source}>{t.name}</TabsTrigger>
          ))}
        </TabsList>
        {logTypesAvailable.map(t => (
          <TabsContent value={t.source} className="space-y-4">
            <LogsDataTableProxy
              logSource={t.source}
              installationId={params.installationId}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
