'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';

import { useEffect } from 'react';
import { useInstallationStore } from '@/app/services/stores';

export function Storage({ ...params }) {
  const { installationId } = params;

  const observations = useInstallationStore(state => state.observations[installationId]);
  const installations = useInstallationStore(state => state.installations);
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
        <CardTitle>Storage ({observations?.length > 0 ? observations[0].environment.storage.length : 0})</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>%</TableHead>
              <TableHead>Used</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Mounted on</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {observations?.length > 0 &&
              (observations[0].environment.storage ?? []).map(storage => {
                const usePercentage =  Number(storage.use_percentage.slice(0, -1));
                const isAbnormalUsePercentage = usePercentage >= 90;
                const abnormalClassName = isAbnormalUsePercentage ? 'font-medium' : '';

                return (
                  <TableRow key={storage.mounted_on} className={abnormalClassName}>
                    <TableCell className="font-medium text-xs">{storage.name}</TableCell>
                    <TableCell className="text-xs">{storage.available}</TableCell>
                    <TableCell className="text-xs">{usePercentage >= 90 ? <p className="text-red-600">{usePercentage}%</p> : <p>{usePercentage}%</p>}</TableCell>
                    <TableCell className="text-xs">{storage.used}</TableCell>
                    <TableCell className="text-xs">{storage.size}</TableCell>
                    <TableCell className="text-xs">{storage.mounted_on}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
