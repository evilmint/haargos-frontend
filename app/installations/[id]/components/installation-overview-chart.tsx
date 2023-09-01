'use client';

import { useEffect } from 'react';
import { Card, Title, BarChart } from '@tremor/react';
import { useAuth0 } from '@auth0/auth0-react';
import { useInstallationStore } from '@/app/services/stores';

export function InstallationOverviewChart({
  installationId,
}: {
  installationId: string;
}) {
  const {
    observations,
    logsByInstallationId: logs,
    fetchInstallations,
    fetchObservationsForInstallation,
  } = useInstallationStore(state => ({
    observations: state.observations[installationId],
    logsByInstallationId: state.logsByInstallationId[installationId],
    fetchInstallations: state.fetchInstallations,
    fetchObservationsForInstallation: state.fetchObservationsForInstallation,
  }));

  const { getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    const asyncFetch = async () => {
      try {
        const token = await getAccessTokenSilently();
        await fetchObservationsForInstallation(installationId, token);
      } catch (error) {
        console.error(error);
      }
    };
    asyncFetch();
  }, [
    installationId,
    getAccessTokenSilently,
    fetchObservationsForInstallation,
    fetchInstallations,
    user,
  ]);

  const dataFormatter = (number: any) =>
    Intl.NumberFormat('us').format(number).toString();

  const filteredLogsLength = (logs ?? []).filter(l =>
    ['w', 'e'].includes(l.type.toLowerCase()),
  ).length;

  const chartdata = observations?.length
    ? [
        { name: 'Zigbee devices', Amount: observations[0]?.zigbee?.devices?.length ?? 0 },
        { name: 'Automations', Amount: observations[0]?.automations?.length ?? 0 },
        { name: 'Scripts', Amount: observations[0]?.scripts?.length ?? 0 },
        { name: 'Scenes', Amount: observations[0]?.scenes?.length ?? 0 },
        { name: 'Error & warning logs', Amount: filteredLogsLength },
        {
          name: 'Docker containers',
          Amount: observations[0]?.docker?.containers?.length ?? 0,
        },
      ]
    : [];

  return (
    <Card>
      <Title>Entities inside HA installation</Title>
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
