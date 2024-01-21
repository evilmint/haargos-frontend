import { useInstallationStore } from '@/app/services/stores/installation';
import { useOSStore } from '@/app/services/stores/os';
import { useSupervisorStore } from '@/app/services/stores/supervisor';
import { InstallationLink } from '@/components/installation-link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useAuth0 } from '@auth0/auth0-react';
import { ReactElement, useEffect } from 'react';

type SupervisorParams = {
  installationId: string;
};

type Field = { name: string; value: string | boolean | ReactElement };

export function Supervisor({ installationId }: SupervisorParams) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supervisor</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className={'max-w-[350px]'}>
          <TableBody>
            <SupervisorSection installationId={installationId} />
            <TableCell></TableCell>
            <OSSection installationId={installationId} />
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function SupervisorSection({ installationId }: { installationId: string }) {
  const fetchSupervisor = useSupervisorStore(state => state.fetchSupervisor);
  const supervisorInfo = useSupervisorStore(
    state => state.supervisorByInstallationId[installationId],
  );
  const { getAccessTokenSilently } = useAuth0();

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchSupervisor(installationId, token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [installationId]);

  if (supervisorInfo == null) {
    return null;
  }

  const fields: Field[] = [
    {
      name: 'Supervisor update',
      value: supervisorInfo.update_available ? (
        <InstallationLink installationId={installationId} path="/config/updates" />
      ) : (
        'Up to date'
      ),
    },
    { name: 'Supervisor Version', value: supervisorInfo.version },
    { name: 'Supervisor Latest', value: supervisorInfo.version_latest },
    { name: 'Arch', value: supervisorInfo.arch },
    { name: 'Channel', value: supervisorInfo.channel },
    { name: 'Wait boot', value: supervisorInfo.wait_boot.toString() },
    { name: 'Healthy', value: supervisorInfo.healthy ? 'Yes' : 'No' },
    { name: 'Debug', value: supervisorInfo.debug ? 'Available' : 'Up to date' },
    { name: 'Auto update', value: supervisorInfo.auto_update ? 'Enabled' : 'Disabled' },
    { name: 'Debug block', value: supervisorInfo.debug_block ? 'Enabled' : 'Disabled' },
  ];

  return fields.map(f => (
    <TableRow>
      <TableCell className="font-medium">{f.name}</TableCell>
      <TableCell>{f.value}</TableCell>
    </TableRow>
  ));
}

function OSSection({ installationId }: { installationId: string }) {
  const fetchOS = useOSStore(state => state.fetchOS);
  const osInfo = useOSStore(state => state.osByInstallationId[installationId]);
  const { getAccessTokenSilently } = useAuth0();

  const installation = useInstallationStore(state =>
    state.installations.find(i => i.id === installationId),
  );

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchOS(installationId, token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [installationId]);

  if (osInfo == null) {
    return null;
  }

  const fields: Field[] = [
    {
      name: 'OS update',
      value: osInfo.update_available ? (
        <InstallationLink installationId={installationId} path="/config/updates">
          Available
        </InstallationLink>
      ) : (
        'Up to date'
      ),
    },
    { name: 'OS Version', value: osInfo.version },
    { name: 'OS Latest', value: osInfo.version_latest },
  ];

  return fields.map(f => (
    <TableRow>
      <TableCell className="font-medium">{f.name}</TableCell>
      <TableCell>{f.value}</TableCell>
    </TableRow>
  ));
}
