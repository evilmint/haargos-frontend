'use client';

import { useInstallationStore, useUserStore } from '@/app/services/stores';
import { Observation, ZigbeeDevice } from '@/app/types';
import { HACustomLink } from '@/components/ha-link';
import { GenericDataTable } from '@/lib/generic-data-table';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { ZigbeeDeviceTableView, getColumnsByTier } from './zigbee-data-table-columns';

export function ZigbeeDataTableProxy({ ...params }) {
  const { installationId } = params;

  const installation = useInstallationStore(state => state.installations).find(
    i => i.id == installationId,
  );
  const observations = useInstallationStore(state => state.observations[installationId]);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(
    state => state.fetchObservationsForInstallation,
  );
  const { getAccessTokenSilently, user } = useAuth0();
  const { user: apiUser } = useUserStore(state => state);

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

  const containsZHADevices = devices.filter(d => d.integration_type === 'ZHA').length > 0;

  const columns = getColumnsByTier(apiUser?.tier ?? 'Expired');
  return (
    <>
      <div className="flex">
        {containsZHADevices && (
          <HACustomLink
            className="mr-2"
            actionName="Go to ZHA"
            instanceHost={installation?.urls.instance?.url}
            path={'config/devices/dashboard?domain=zha'}
          />
        )}

        {containsZHADevices && (
          <HACustomLink
            actionName="Go to Devices"
            instanceHost={installation?.urls.instance?.url}
            path={'config/devices/dashboard'}
          />
        )}
      </div>
      <GenericDataTable
        defaultColumnVisibility={{
          ieee: false,
          integration_type: false,
          device: false,
          battery_type: false,
        }}
        filterColumnName="name"
        columns={columns}
        pluralEntityName="zigbee"
        columnVisibilityKey="ZigbeeDataTable_columnVisibility"
        data={devices}
        linkColumnName="name"
        link={(device: ZigbeeDeviceTableView) => {
          if (device.integration_type !== 'ZHA' || !installation?.urls?.instance?.url || !device.device_id) {
            return null;
          }

          return (
            installation?.urls?.instance?.url + '/config/devices/device/' + device.device_id
          );
        }}
      />
    </>
  );
}

function mapToTableView(
  device: ZigbeeDevice,
  observations: Observation[],
): ZigbeeDeviceTableView {
  const devices = observations
    .flatMap(o => o.zigbee?.devices ?? [])
    .filter(d => d.ieee == device.ieee);

  const lqi_min = devices.reduce((a, d) => (a > (d.lqi ?? 0) ? d.lqi ?? 0 : a), 99999);
  const lqi_max = devices.reduce((a, d) => (a < (d.lqi ?? 0) ? d.lqi ?? 0 : a), -1);
  const mean = devices.reduce((a, d) => a + (d.lqi ?? 0), 0) / devices.length;

  const sorted = devices.sort((a, b) => (a.lqi ?? 0) - (b.lqi ?? 0));

  const idx = Math.ceil(devices.length / 2) - 1;
  const median = (devices ?? []).length >= 1 ? sorted[idx].lqi : 0;

  return {
    id: device.ieee,
    ieee: device.ieee,
    last_updated: new Date(device.last_updated),
    entity_name: device.entity_name,
    device_id: device.device_id,
    name: device.name_by_user,
    timeago: {
      last_updated: new Date(device.last_updated),
      timestamp: new Date(observations[0].timestamp),
    },
    device: `${device.brand} ${device.entity_name}`,
    lqi: { min: lqi_min, max: lqi_max, mean: mean, median: median ?? 0 },
    power_source: device.power_source + ` ${device.battery_level ?? 'n/a'}`,
    battery_type: device.battery ?? null,
    integration_type: device.integration_type.toLocaleUpperCase(),
  };
}
