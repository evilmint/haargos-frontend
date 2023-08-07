'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import TimeAgo from 'react-timeago';
import { useEffect } from 'react';
import { useInstallationStore } from '@/app/services/stores';
import { ZigbeeDevice } from '@/app/types';
import { useAuth0 } from '@auth0/auth0-react';

export function Zigbee({ ...params }) {
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
              <TableHead>Device</TableHead>
              {/* <TableHead>Entity name</TableHead> */}
              <TableHead>LQI</TableHead>
              <TableHead className="text-right">Last updated</TableHead>
              <TableHead className="text-right">Δ Observation</TableHead>
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
                const isAbnormalLQI = device.lqi <= 32 && device.integration_type == 'zha';
                const abnormalClassName = isAbnormalLQI ? 'font-medium' : '';
                const lqiName = device.integration_type == 'zha' ? device.lqi : '-';

                return (
                  <TableRow className={abnormalClassName} key={device.ieee}>
                    <TableCell className="font-medium text-xs">{device.ieee}</TableCell>
                    <TableCell className="text-xs">{device.brand} {device.entity_name}</TableCell>
                    {/* <TableCell className="text-xs"></TableCell> */}
                    <TableCell className="text-x">
                      {isAbnormalLQI ? <b className="text-red-600">{lqiName}</b> : <p>{lqiName}</p>}
                    </TableCell>
                    <TableCell className="text-xs text-right">{new Date(device.last_updated).toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-right">
                      <TimeAgo date={device.last_updated} now={() => new Date(observations[0].timestamp).getTime()} />
                    </TableCell>
                    <TableCell className="text-xs flex justify-center items-center ">
                      {device.power_source == 'Battery' ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"></path>
                          <line x1="23" y1="13" x2="23" y2="11"></line>
                          <polyline points="11 6 7 12 13 12 9 18"></polyline>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                      )}
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
