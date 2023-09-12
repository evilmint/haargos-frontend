'use client';

import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import {
  Card,
  Title,
  DonutChart,
  Flex,
  BarList,
  Bold,
  Text,
  Legend,
} from '@tremor/react';
import { useInstallationStore } from '@/app/services/stores';
import { Installation } from '@/app/types';

export function DashboardHeader() {
  const installations = useInstallationStore(state => state.installations);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const { getAccessTokenSilently, user } = useAuth0();
  const latestHARelease = useInstallationStore(state => state.latestHaRelease);

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchInstallations(token, false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [fetchInstallations, getAccessTokenSilently, user]);

  const healthyInstallations = installations.reduce((s, i) => {
    return s + (i?.health_statuses.length > 0 && i.health_statuses[0].is_up ? 1 : 0);
  }, 0);

  const unhealthyInstallations = installations.reduce((s, i) => {
    return s + (i?.health_statuses.length > 0 && i.health_statuses[0].is_up ? 0 : 1);
  }, 0);
  const installationIssues = installations.reduce((s, i) => {
    return s + i.issues.length;
  }, 0);

  const installationChart = [
    {
      name: 'Healthy',
      sales: healthyInstallations,
    },
    {
      name: 'Unhealthy',
      sales: unhealthyInstallations,
    },
    {
      name: 'Issues',
      sales: installationIssues,
    },
  ];

  const observations = useInstallationStore(state => state.observations);

  const lowLQICount = installations.reduce((a, i) => {
    const o = observations[i.id];

    if (!o || o.length == 0) {
      return a;
    }

    return (
      a + (o[0].zigbee?.devices.reduce((a, z) => a + (z.has_low_lqi ? 1 : 0), 0) ?? 0)
    );
  }, 0);

  const lowBatteryCount = installations.reduce((a, i) => {
    const o = observations[i.id];

    if (!o || o.length == 0) {
      return a;
    }

    return (
      a + (o[0].zigbee?.devices.reduce((a, z) => a + (z.has_low_battery ? 1 : 0), 0) ?? 0)
    );
  }, 0);

  const healthyZigbeeDevices = installations.reduce((a, i) => {
    const o = observations[i.id];

    if (!o || o.length == 0) {
      return a;
    }

    return (
      a +
      (o[0].zigbee?.devices.reduce(
        (a, z) => a + (!z.has_low_battery && !z.has_low_lqi ? 1 : 0),
        0,
      ) ?? 0)
    );
  }, 0);

  const zigbee = [
    {
      name: 'Healthy',
      sales: healthyZigbeeDevices,
    },
    {
      name: 'Low LQI',
      sales: lowLQICount,
    },
    {
      name: 'Low battery',
      sales: lowBatteryCount,
    },
  ];

  const haVersions = new Map<string, number>();

  if (latestHARelease != null) {
    haVersions?.set(latestHARelease, 0);
  }

  installations.forEach((i: Installation) => {
    const o = observations[i.id];

    if (!o || o.length == 0) {
      return;
    }

    const key = o[0].ha_config?.version ?? 'Unknown';

    haVersions?.set(key, (haVersions.get(key) ?? 0) + 1);
  });

  let data: any[] = [];

  haVersions?.forEach((value, key) => {
    data.push({
      name: key,
      value: value,
    });
  });

  const highLoadHosts = installations.reduce((a, i) => {
    const o = observations[i.id];

    if (!o || o.length == 0) {
      return a;
    }

    return a + (o[0].has_high_cpu_load ? 1 : 0);
  }, 0);
  const lowMemoryHosts = installations.reduce((a, i) => {
    const o = observations[i.id];

    if (!o || o.length == 0) {
      return a;
    }

    return a + (o[0].has_low_memory ? 1 : 0);
  }, 0);

  const lowStorageHosts = installations.reduce((a, i) => {
    const o = observations[i.id];

    if (!o || o.length == 0) {
      return a;
    }

    return a + (o[0].has_low_storage ? 1 : 0);
  }, 0);

  const healthyHosts = installations.reduce((a, i) => {
    const o = observations[i.id];

    if (!o || o.length == 0) {
      return a;
    }

    return (
      a +
      (!o[0].has_high_cpu_load && !o[0].has_low_memory && !o[0].has_low_storage ? 1 : 0)
    );
  }, 0);

  const host = [
    {
      name: 'Healthy',
      sales: healthyHosts,
    },
    {
      name: 'Low storage %',
      sales: lowStorageHosts,
    },
    {
      name: 'High load',
      sales: highLoadHosts,
    },
    {
      name: 'Low memory',
      sales: lowMemoryHosts,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="max-w-lg">
        <Title>Health</Title>
        <DonutChart
          className="mt-6"
          data={installationChart}
          category="sales"
          index="name"
          title=""
          showLabel={false}
          colors={['green', 'rose', 'amber', 'rose', 'cyan', 'amber']}
        />
        <Legend
          className="mt-3"
          categories={['Healthy installations', 'Unhealthy installations', 'Issues']}
          colors={['green', 'rose', 'amber']}
        />
      </Card>

      <Card className="max-w-lg">
        <Title>Zigbee</Title>
        <DonutChart
          className="mt-6"
          data={zigbee}
          category="sales"
          index="name"
          title=""
          showLabel={false}
          colors={['green', 'neutral', 'red']}
        />
        <Legend
          className="mt-3"
          categories={['Healthy', 'Low LQI', 'Low battery']}
          colors={['green', 'neutral', 'red']}
        />
      </Card>

      <Card className="max-w-lg">
        <Title>Host</Title>
        <DonutChart
          className="mt-6"
          data={host}
          category="sales"
          index="name"
          title=""
          showLabel={false}
          colors={['green', 'neutral', 'red', 'indigo', 'emerald']}
        />
        <Legend
          className="mt-3"
          categories={['Healthy', 'Low storage', 'High load', 'Low memory']}
          colors={['green', 'neutral', 'red', 'indigo', 'emerald']}
        />
      </Card>

      <Card className="max-w-lg">
        <Title>HomeAssistant</Title>
        <Flex className="mt-4">
          <Text>
            <Bold>Version</Bold>
          </Text>
          <Text>
            <Bold>Installations</Bold>
          </Text>
        </Flex>
        <BarList data={data} className="mt-2" />
      </Card>
    </div>
  );
}
