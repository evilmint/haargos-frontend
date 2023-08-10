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
  const fetchObservationsForInstallation = useInstallationStore(state => state.fetchObservationsForInstallation);
  const { getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently().then(token => {
      fetchInstallations(token)
        .then(() => fetchObservationsForInstallation(installationId, token))
        .catch(error => console.error(error));
    });
  }, [fetchInstallations, fetchObservationsForInstallation, user, getAccessTokenSilently, installationId]);

  const devices =
    observations?.length > 0
      ? (observations[0].zigbee?.devices ?? []).map(d => mapToTableView(d, observations[0]))
      : [];

  return <ZigbeeDataTable data={devices} />;
}

function mapToTableView(device: ZigbeeDevice, observation: Observation): ZigbeeDeviceTableView {
  return {
    id: device.ieee,
    ieee: device.ieee,
    last_updated: new Date(device.last_updated),
    entity_name: device.entity_name,
    name: device.name_by_user,
    timeago: { last_updated: new Date(device.last_updated), timestamp: new Date(observation.timestamp) }, //<TimeAgo date={device.last_updated} now={() => new Date(observation.timestamp).getTime()} />,
    device: `${device.brand} ${device.entity_name}`,
    lqi: device.lqi,
    power_source: device.power_source,
    integration_type: device.integration_type.toLocaleUpperCase(),
  };
}
