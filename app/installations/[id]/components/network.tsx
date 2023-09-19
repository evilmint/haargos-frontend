'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Flex,
  LineChart,
  Title,
  Text,
  Card as TremorCard,
  Bold,
  BarList,
} from '@tremor/react';

import { useInstallationStore } from '@/app/services/stores';
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import moment from 'moment';

export function Network({ ...params }) {
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
      await fetchObservationsForInstallation(installationId, token, false);
    } catch (error) {
      console.log(error);
    }
  };

  const packetData: any[] = [];
  const byteData: any[] = [];

  if (observations && observations.length > 0) {
    observations[0].environment.network?.interfaces.forEach(i => {
      packetData.push({ name: i.name, value: i.tx.packets + i.rx.packets });
      byteData.push({ name: i.name, value: i.tx.bytes + i.rx.bytes });
    });
  }

  useEffect(() => {
    asyncFetch();
  }, [
    fetchInstallations,
    getAccessTokenSilently,
    fetchObservationsForInstallation,
    installationId,
  ]);


  return (
    observations?.length > 0 &&
    observations[0].environment.cpu && (
      <div>
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Bytes</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList
              valueFormatter={(number: number) =>
                `${(number / 1024 / 1024).toFixed(1)} MB`
              }
              data={byteData}
              className="mt-2"
            />
          </CardContent>
          <CardHeader>
            <CardTitle>Packets</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList data={packetData} className="mt-2" />
          </CardContent>
        </Card>
      </div>
    )
  );
}
