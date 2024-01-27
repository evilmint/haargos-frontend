import { useInstallationStore } from '@/app/services/stores/installation';
import { useOSStore } from '@/app/services/stores/os';
import { useSupervisorStore } from '@/app/services/stores/supervisor';
import { Icons } from '@/components/icons';
import { InstallationLink } from '@/components/installation-link';
import { RemoteAction, RemoteActionType } from '@/components/remote-action';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/new-york/ui/dropdown-menu';
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
        <div className="inline">
          <SupervisorRemoteActions installationId={installationId} />
          <CoreRemoteActions installationId={installationId} />
        </div>
        <Table className={'max-w-[450px]'}>
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

type RemoteActionDropdownItem = {
  type: RemoteActionType;
  visual: 'link' | 'button';
  text: string;
};

function CoreRemoteActions({ installationId }: SupervisorParams) {
  const coreActions: RemoteActionDropdownItem[] = [
    { type: 'core_restart', visual: 'link', text: 'Restart' },
    { type: 'core_stop', visual: 'link', text: 'Stop' },
    { type: 'core_start', visual: 'link', text: 'Start' },
    { type: 'core_update', visual: 'link', text: 'Update' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          className="ml-2 bg-sr-600 hover:bg-sr-700 whitespace-nowrap"
        >
          <Icons.signal className="w-4 h-4 mr-1" /> Core Remote
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Core Remote</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {coreActions.map(action => (
            <DropdownMenuItem key={action.type}>
              <RemoteAction
                type={action.type}
                visual={action.visual}
                text={action.text}
                installationId={installationId}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SupervisorRemoteActions({ installationId }: SupervisorParams) {
  const supervisorActions: RemoteActionDropdownItem[] = [
    { type: 'supervisor_restart', visual: 'link', text: 'Restart' },
    { type: 'supervisor_reload', visual: 'link', text: 'Reload' },
    { type: 'supervisor_repair', visual: 'link', text: 'Repair' },
    { type: 'supervisor_update', visual: 'link', text: 'Update' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="bg-sr-600 hover:bg-sr-700 whitespace-nowrap">
          <Icons.signal className="w-4 h-4 mr-1" /> Supervisor Remote
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Supervisor Remote</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {supervisorActions.map(action => (
            <DropdownMenuItem key={action.type}>
              <RemoteAction
                type={action.type}
                visual={action.visual}
                text={action.text}
                installationId={installationId}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
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
        <InstallationLink installationId={installationId} path="/config/updates">
          Available
        </InstallationLink>
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
    <TableRow key={f.name}>
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
        <div>
          <InstallationLink installationId={installationId} path="/config/updates">
            Available
          </InstallationLink>

          <RemoteAction installationId={installationId} type="update_os" />
        </div>
      ) : (
        'Up to date'
      ),
    },
    { name: 'OS Version', value: osInfo.version },
    { name: 'OS Latest', value: osInfo.version_latest },
  ];

  return fields.map(f => (
    <TableRow key={f.name}>
      <TableCell className="font-medium">{f.name}</TableCell>
      <TableCell>{f.value}</TableCell>
    </TableRow>
  ));
}
