import { PrimaryButton } from '@/components/primary-button';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react';
import { useRouter } from 'next/navigation';
import { ConfigurationsDataTableProxy } from './configurations/configurations-data-table-proxy';
import { IncidentsDataTableProxy } from './incidents/incidents-data-table-proxy';

interface AlarmProps {
  installationId: string;
}

export function Alarms(props: AlarmProps) {
  const router = useRouter();

  return (
    <div>
      <PrimaryButton
        onClick={() => {
          router.push(`/dashboard/installations/${props.installationId}/alarms/create`);
        }}
      >
        <PlusCircledIcon className="w-5 h-5 mr-2" /> New Alarm
      </PrimaryButton>

      <TabGroup>
        <TabList className="mt-2">
          <Tab>Alarms</Tab>
          <Tab>Incidents</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ConfigurationsDataTableProxy installationId={props.installationId} />
          </TabPanel>
          <TabPanel>
            <IncidentsDataTableProxy installationId={props.installationId} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
