'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import TimeAgo from 'react-timeago';
import { useEffect } from 'react';
import { useInstallationStore } from '@/app/services/stores';
import { ZigbeeDevice } from '@/app/types';
import { useAuth0 } from '@auth0/auth0-react';
import { Icons } from '@/components/icons';

export function Zigbee({ ...params }) {
  const { installationId } = params;
  const observations = useInstallationStore(state => state.observations[installationId]);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(state => state.fetchObservationsForInstallation);
  const { getAccessTokenSilently, user } = useAuth0();

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchObservationsForInstallation(installationId, token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [fetchInstallations, getAccessTokenSilently, fetchObservationsForInstallation, installationId, user]);

  return (
    <Card className="col-span-8">
      <CardHeader>
        <CardTitle>
          Zigbee devices ({observations && observations.length > 0 ? observations[0].zigbee?.devices.length ?? 0 : 0})
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">IEEE</TableHead>
              <TableHead>Name by user</TableHead>
              {/* <TableHead>Entity name</TableHead> */}
              <TableHead>LQI</TableHead>
              <TableHead className="text-right">Last updated</TableHead>
              <TableHead className="text-right">Δ Observation</TableHead>
              <TableHead className="text-right">Device</TableHead>
              <TableHead className="text-center">Power</TableHead>
              <TableHead className="text-right">Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {observations &&
              observations.length > 0 &&
              observations[0].zigbee &&
              observations[0].zigbee.devices.length > 0 &&
              (observations[0].zigbee.devices ?? []).map((device: ZigbeeDevice) => {
                const abnormalClassName = device.has_low_lqi ? 'font-medium' : '';
                const lqiName = device.integration_type == 'zha' ? device.lqi : '-';

                return (
                  <TableRow className={abnormalClassName} key={device.ieee}>
                    <TableCell className="font-medium text-xs">{device.ieee}</TableCell>
                    <TableCell className="text-xs">{device.name_by_user ?? '-'}</TableCell>
                    {/* <TableCell className="text-xs"></TableCell> */}
                    <TableCell className="text-x">
                      {device.has_low_lqi ? <b className="text-red-600">{lqiName}</b> : <p>{lqiName}</p>}
                    </TableCell>
                    <TableCell className="text-xs text-right">
                      {new Date(device.last_updated).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs text-right">
                      <TimeAgo date={device.last_updated} now={() => new Date(observations[0].timestamp).getTime()} />
                    </TableCell>
                    <TableCell className="text-xs text-right">{`${device.brand} ${device.entity_name}`}</TableCell>
                    <TableCell className="text-xs flex justify-center items-center">
                      {device.power_source == 'Battery' ? <Icons.battery /> : <Icons.zap />}
                    </TableCell>
                    <TableCell className="text-xs w-0.5 text-right">{device.integration_type.toUpperCase()}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
