'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';

import { SVGWithText } from './svg-with-text';
import { useEffect } from 'react';
import { useInstallationStore } from '@/app/services/stores';
import { ZigbeeDevice } from '@/app/types';
import { useAuth0 } from '@auth0/auth0-react';

export function Zigbee({ ...params }) {
  const { installationId } = params;
  const observations = useInstallationStore(state => state.observations[installationId]);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(state => state.fetchObservationsForInstallation);
  const { getAccessTokenSilently, getIdTokenClaims, user, logout, isAuthenticated } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently().then(token => {
      fetchInstallations(token)
        .then(() => fetchObservationsForInstallation(installationId, token))
        .catch(error => console.error(error));
    });
  }, [fetchInstallations, fetchObservationsForInstallation, user, getAccessTokenSilently, installationId]);

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
              <TableHead className="w-[100px]">IEEE</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Entity name</TableHead>
              <TableHead>LQI</TableHead>
              <TableHead>Integration</TableHead>
              <TableHead>Last updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {observations &&
              observations.length > 0 &&
              observations[0].zigbee &&
              observations[0].zigbee.devices.length > 0 &&
              (observations[0].zigbee.devices ?? []).map((device: ZigbeeDevice) => {
                const isAbnormalLQI = device.lqi <= 32 && device.integration_type == 'zha';
                const abnormalClassName = isAbnormalLQI ? 'font-medium' : '';
                const lqiName = device.integration_type == 'zha' ? device.lqi : '-';

                return (
                  <TableRow className={abnormalClassName} key={device.ieee}>
                    <TableCell className="font-medium text-xs">{device.ieee}</TableCell>
                    <TableCell className="text-xs">{device.brand}</TableCell>
                    <TableCell className="text-xs">{device.entity_name}</TableCell>
                    <TableCell className="text-xs">
                      {isAbnormalLQI ? <b className="text-red-600">{lqiName}</b> : <p>{lqiName}</p>}
                    </TableCell>
                    <TableCell className="text-xs">{device.integration_type.toUpperCase()}</TableCell>
                    <TableCell className="text-xs">{new Date(device.last_updated).toLocaleString()}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
