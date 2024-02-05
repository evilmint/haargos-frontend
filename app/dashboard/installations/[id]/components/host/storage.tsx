'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';

import { useInstallationStore } from '@/app/services/stores/installation';
import { useAuth0 } from '@auth0/auth0-react';
import { LineChart, ProgressBar } from '@tremor/react';
import moment from 'moment';
import { useEffect } from 'react';

export function Storage({ ...params }) {
  const { installationId } = params;

  const observations = useInstallationStore(state => state.observations[installationId]);
  const fetchObservationsForInstallation = useInstallationStore(
    state => state.fetchObservationsForInstallation,
  );

  const { getAccessTokenSilently, user } = useAuth0();

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchObservationsForInstallation(installationId, token, false);
    } catch (error) {
      console.log(error);
    }
  };

  const dataFormatter = (number: number) =>
    `${Intl.NumberFormat('us').format(number).toString()}%`;

  const chartdata = (observations ?? []).reverse().map(o => {
    const checkStorages = o.environment.storage.filter(f => f.name != 'overlay');

    return {
      year: moment(o.timestamp).format('HH:mm'),
      Used:
        checkStorages.reduce((acc, o) => {
          return acc + Number(o.use_percentage.slice(0, -1));
        }, 0) / checkStorages.length,
    };
  });

  useEffect(() => {
    asyncFetch();
  }, [getAccessTokenSilently, fetchObservationsForInstallation, installationId, user]);

  return (
    <Card className="col-span-8">
      <CardHeader>
        <CardTitle>
          Storage (
          {observations?.length > 0 ? observations[0].environment.storage.length : 0})
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead className="w-[200px]">%</TableHead>
              <TableHead>Used</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="text-right">Mounted on</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {observations?.length > 0 &&
              (observations[0].environment.storage ?? []).map(storage => {
                const usePercentage = Number(storage.use_percentage.slice(0, -1));
                const isAbnormalUsePercentage = usePercentage >= 90;
                const abnormalClassName = isAbnormalUsePercentage ? 'font-medium' : '';

                return (
                  <TableRow key={storage.mounted_on} className={abnormalClassName}>
                    <TableCell className="font-medium text-xs">{storage.name}</TableCell>
                    <TableCell className="text-xs">
                      {usePercentage >= 90 ? (
                        <p className="text-red-600">{usePercentage}%</p>
                      ) : (
                        <p>{usePercentage}%</p>
                      )}
                      <ProgressBar value={usePercentage} color="blue" className="mt-3" />
                    </TableCell>
                    <TableCell className="text-xs">{storage.used}</TableCell>
                    <TableCell className="text-xs">{storage.available}</TableCell>
                    <TableCell className="text-xs">{storage.size}</TableCell>
                    <TableCell className="text-xs text-right">
                      {storage.mounted_on}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>

      <CardHeader>
        <CardTitle>Used total</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart
          data={chartdata}
          index="year"
          categories={['Used']}
          colors={['blue']}
          valueFormatter={dataFormatter}
          yAxisWidth={40}
        />
      </CardContent>
    </Card>
  );
}
