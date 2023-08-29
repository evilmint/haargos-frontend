'use client';

import { Card, Title, BarChart, Subtitle } from '@tremor/react';

import { useEffect } from 'react';
import { useInstallationStore } from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';

export function InstallationOverviewChart({ ...params }) {
  const { installationId } = params;

  const observations = useInstallationStore(state => state.observations[installationId]);
  const logs = useInstallationStore(state => state.logsByInstallationId[installationId]);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(state => state.fetchObservationsForInstallation);

  const { getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently().then(token => {
      fetchInstallations(token)
        .then(() => fetchObservationsForInstallation(installationId, token))
        .catch(error => console.error(error));
    });
  }, [fetchInstallations, user, getAccessTokenSilently, fetchObservationsForInstallation, installationId]);

  const dataFormatter = (number: number) => {
    return Intl.NumberFormat('us').format(number).toString();
  };

  const chartdata =
    observations == null || observations.length == 0
      ? []
      : [
          {
            name: 'Zigbee devices',
            'Amount': observations[0].zigbee?.devices.length ?? 0,
          },
          {
            name: 'Automations',
            'Amount': observations[0].automations?.length ?? 0,
          },
          {
            name: 'Scripts',
            'Amount': observations[0].scripts?.length ?? 0,
          },
          {
            name: 'Scenes',
            'Amount': observations[0].scenes?.length ?? 0,
          },
          {
            name: 'Error & warning logs',
            'Amount': logs.filter(l => {
              return ['w', 'e'].indexOf(l.type.toLowerCase()) == 0;
            }).length,
          },
          {
            name: 'Docker containers',
            'Amount': observations[0].docker.containers.length ?? 0,
          },
        ];
  return (
    <Card>
      <Title>Entities inside HA installation</Title>
      {/* <Subtitle>The IUCN Red List has assessed only a small share of the total known species in the world.</Subtitle> */}
      <BarChart
        className="mt-6"
        data={chartdata}
        index="name"
        categories={['Amount']}
        colors={['blue']}
        valueFormatter={dataFormatter}
        yAxisWidth={48}
      />
    </Card>
  );
}
