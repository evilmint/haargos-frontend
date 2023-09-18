'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LineChart, Title, Card as TremorCard } from '@tremor/react';

import { useInstallationStore } from '@/app/services/stores';
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import moment from 'moment';

export function CPU({ ...params }) {
  const { installationId } = params;
  const observations = useInstallationStore(state => state.observations[installationId]);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(
    state => state.fetchObservationsForInstallation,
  );
  const { getAccessTokenSilently } = useAuth0();

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchObservationsForInstallation(installationId, token);
    } catch (error) {
      console.log(error);
    }
  };

  const cpuLoadChartData = (observations ?? []).reverse().map(o => {
    return {
      load: moment(o.timestamp).format('HH:mm'),
      'CPU Load': o.environment.cpu?.load ?? 0,
    };
  });

  const cpuTempChartData = (observations ?? []).reverse().map(o => {
    return {
      temp: moment(o.timestamp).format('HH:mm'),
      'CPU Temperature': o.environment.cpu?.temp ?? 0,
    };
  });

  useEffect(() => {
    asyncFetch();
  }, [
    fetchInstallations,
    getAccessTokenSilently,
    fetchObservationsForInstallation,
    installationId,
  ]);

  const dataFormatter = (number: number) => `${number.toFixed(1)}%`;

  return (
    observations?.length > 0 &&
    observations[0].environment.cpu && (
      <div>
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>CPU</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Model name</TableHead>
                  <TableHead>Architecture</TableHead>
                  <TableHead>Load</TableHead>
                  <TableHead>Temperature</TableHead>
                  <TableHead>MHz</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {observations && observations.length > 0 && (
                  <TableRow key={observations[0].environment.cpu.model_name}>
                    <TableCell className="font-medium text-xs">
                      {observations[0].environment.cpu.model_name}
                    </TableCell>
                    <TableCell className="text-xs">
                      {observations[0].environment.cpu.architecture}
                    </TableCell>
                    <TableCell className="text-xs">
                      {observations[0].environment.cpu.load}
                    </TableCell>
                    <TableCell className="text-xs">
                      {observations[0].environment.cpu.temp}°C
                    </TableCell>
                    <TableCell className="text-xs">
                      {observations[0].environment.cpu.cpu_mhz}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>

          <CardHeader>
            <CardTitle>Load</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={cpuLoadChartData}
              index="load"
              categories={['CPU Load']}
              colors={['blue']}
              valueFormatter={dataFormatter}
              yAxisWidth={40}
            />
          </CardContent>

          <CardHeader>
            <CardTitle>Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={cpuTempChartData}
              index="temp"
              categories={['CPU Temperature']}
              colors={['blue']}
              valueFormatter={temp => `${temp}°C`}
              yAxisWidth={40}
            />
          </CardContent>
        </Card>
      </div>
    )
  );
}
