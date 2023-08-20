'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { useInstallationStore } from '@/app/services/stores';
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export function Environment({ ...params }) {
  const { installationId } = params;
  const observations = useInstallationStore(state => state.observations[installationId]);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(state => state.fetchObservationsForInstallation);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently().then(token => {
      fetchInstallations(token)
        .then(() => fetchObservationsForInstallation(installationId, token))
        .catch(error => console.error(error));
    });
  }, [fetchInstallations, fetchObservationsForInstallation, installationId]);

  return observations[0].environment.cpu && (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">Model name</TableHead>
          <TableHead>Architecture</TableHead>
          <TableHead>Load</TableHead>
          <TableHead>MHz</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {observations && observations.length > 0 && (
          <TableRow key={observations[0].environment.cpu.model_name}>
            <TableCell className="font-medium text-xs">{observations[0].environment.cpu.model_name}</TableCell>
            <TableCell className="text-xs">{observations[0].environment.cpu.architecture}</TableCell>
            <TableCell className="text-xs">{observations[0].environment.cpu.load}</TableCell>
            <TableCell className="text-xs">{observations[0].environment.cpu.cpu_mhz}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
