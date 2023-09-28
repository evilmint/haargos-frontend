'use client';
import * as React from 'react';

import { useEffect } from 'react';
import { useInstallationStore } from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';
import { Observation, ZigbeeDevice } from '@/app/types';
import { ZigbeeDataTable, ZigbeeDeviceTableView } from './zigbee-data-table';

export function ZigbeeDataTableProxy({ ...params }) {
  const { installationId } = params;

  const observations = useInstallationStore(state => state.observations[installationId]);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
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

  useEffect(() => {
    asyncFetch();
  }, [
    fetchInstallations,
    getAccessTokenSilently,
    fetchObservationsForInstallation,
    installationId,
    user,
  ]);

  let devices: ZigbeeDeviceTableView[] = [];

  if (observations && observations.length > 0 && observations[0].zigbee) {
    devices = observations[0].zigbee.devices.map(d => mapToTableView(d, observations));
  }
  return <ZigbeeDataTable data={devices} />;
}

function mapToTableView(
  device: ZigbeeDevice,
  observations: Observation[],
): ZigbeeDeviceTableView {
  const devices = observations.flatMap(o => o.zigbee?.devices ?? []).filter(d => d.ieee == device.ieee);

  const lqi_min = devices.reduce((a, d) => a > d.lqi ? d.lqi : a, 99999);
  const lqi_max = devices.reduce((a, d) => a < d.lqi ? d.lqi : a, -1);
  const mean = devices.reduce((a, d) => a + d.lqi, 0) / devices.length;

  const median = devices.sort((a,b) => a.lqi - b.lqi)[Math.ceil(devices.length / 2)].lqi;

  return {
    id: device.ieee,
    ieee: device.ieee,
    last_updated: new Date(device.last_updated),
    entity_name: device.entity_name,
    name: device.name_by_user,
    timeago: {
      last_updated: new Date(device.last_updated),
      timestamp: new Date(observations[0].timestamp),
    },
    device: `${device.brand} ${device.entity_name}`,
    lqi: { min: lqi_min, max: lqi_max, mean: mean, median: median },
    power_source: device.power_source + ` ${device.battery_level ?? 'n/a'}`,
    battery_type: device.battery,
    integration_type: device.integration_type.toLocaleUpperCase(),
  };
}
