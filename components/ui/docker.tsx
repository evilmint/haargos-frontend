'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';

import { SVGWithText } from './svg-with-text';
import { useEffect } from 'react';
import { useInstallationStore } from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';

export function Docker({ ...params }) {
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
  }, [fetchInstallations, fetchObservationsForInstallation, installationId]);

  const dockerContainerCount = observations[0]?.docker?.containers?.length || 0;

  return (
    <Card className="col-span-8">
      <CardHeader>
        <CardTitle>Docker containers ({dockerContainerCount})</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Running</TableHead>
              <TableHead>Restarting</TableHead>
              <TableHead>Started at</TableHead>
              <TableHead>Finished at</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {observations.length > 0 &&
              (observations[0].docker.containers ?? []).map(container => {
                const isAbnormalRunning = container.restarting;
                const abnormalClassName = isAbnormalRunning ? 'font-medium' : '';

                return (
                  <TableRow key={container.image} className={abnormalClassName}>
                    <TableCell className="font-medium text-xs">{container.name}</TableCell>
                    <TableCell className="text-xs">{container.image}</TableCell>
                    <TableCell className="text-xs">
                      {container.running ? <p>Yes</p> : <p className="text-red-600">'No'</p>}
                    </TableCell>
                    <TableCell className="text-xs">
                      {container.restarting ? <p className="text-red-600">Yes</p> : 'No'}
                    </TableCell>
                    <TableCell className="text-xs">{new Date(container.started_at).toLocaleString()}</TableCell>
                    <TableCell className="text-xs">
                      {new Date(container.finished_at).getUTCSeconds() > 0
                        ? new Date(container.finished_at).toLocaleString()
                        : '-'}
                    </TableCell>
                    <TableCell className="text-xs">
                      {<p className={container.state == 'restarting' ? 'text-red-600' : ''}>{container.state}</p>}
                    </TableCell>
                    <TableCell className="text-xs">{container.status}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
