'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';

import { SVGWithText } from './SVGWithText';
import { useEffect } from 'react';
import { useInstallationStore } from '@/app/services/stores';
import { ZigbeeDevice } from '@/app/types';

export function Zigbee({ ...params }) {
  const { installationId } = params;
  const observations = useInstallationStore(state => state.observations[installationId]);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(state => state.fetchObservationsForInstallation);

  useEffect(() => {
    fetchInstallations()
      .then(() => fetchObservationsForInstallation(installationId))
      .catch(error => console.error(error));
  }, [fetchInstallations, fetchObservationsForInstallation, installationId]);

  return (
    <Card className="col-span-8">
      <CardHeader>
        <CardTitle>Zigbee devices ({observations.length > 0 ? (observations[0].zigbee?.devices.length ?? 0) : 0})</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">IEEE</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Entity name</TableHead>
              <TableHead>Last updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {observations.length > 0 && observations[0].zigbee && observations[0].zigbee.devices.length > 0 &&
              (observations[0].zigbee.devices ?? []).map((device: ZigbeeDevice) => (
                <TableRow key={device.ieee}>
                  <TableCell className="font-medium text-xs">{device.ieee}</TableCell>
                  <TableCell className="text-xs">{device.brand}</TableCell>
                  <TableCell className="text-xs">{device.entity_name}</TableCell>
                  <TableCell className="text-xs">{new Date(device.last_updated).toLocaleString()}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
