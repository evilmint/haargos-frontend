'use client';

import { BarList } from '@tremor/react';

import { useInstallationStore } from '@/app/services/stores';
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/ui/card';
import { formatUnit } from '@/lib/format-unit';

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

  const packetRxData: any[] = [];
  const packetTxData: any[] = [];
  const byteRxData: any[] = [];
  const byteTxData: any[] = [];

  if (observations && observations.length > 0) {
    observations[0].environment.network?.interfaces.forEach(i => {
      packetTxData.push({ name: i.name, value: i.tx.packets });
      packetRxData.push({ name: i.name, value: i.rx.packets });
      byteTxData.push({ name: i.name, value: i.tx.bytes });
      byteRxData.push({ name: i.name, value: i.rx.bytes });
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
            <CardTitle>Bytes RX</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList
              valueFormatter={(number: number) => formatUnit(number, 'B')}
              data={byteRxData}
              className="mt-2"
            />
          </CardContent>
          <CardHeader>
            <CardTitle>Bytes TX</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList
              valueFormatter={(number: number) => formatUnit(number, 'B')}
              data={byteTxData}
              className="mt-2"
            />
          </CardContent>
          <CardHeader>
            <CardTitle>Packets RX</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList
              valueFormatter={(number: number) => {
                return formatUnit(number);
              }}
              data={packetRxData}
              className="mt-2"
            />
          </CardContent>
          <CardHeader>
            <CardTitle>Packets TX</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList
              valueFormatter={(number: number) => {
                return formatUnit(number);
              }}
              data={packetTxData}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>
    )
  );
}
