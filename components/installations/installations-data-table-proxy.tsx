'use client';
import * as React from 'react';

import { useEffect } from 'react';
import { useInstallationStore } from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';
import { Installation, Observation } from '@/app/types';
import { InstallationDataTable, InstallationTableView } from './installations-data-table';

export function InstallationsDataTableProxy() {
  const observations = useInstallationStore(state => state.observations);
  const installations = useInstallationStore(state => state.installations);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(state => state.fetchObservationsForInstallation);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently().then(token => {
      fetchInstallations(token).catch(error => console.error(error));
    });
  }, [fetchInstallations, getAccessTokenSilently]);

  useEffect(() => {
    getAccessTokenSilently().then(token => {
      const observationPromises = installations.map(installation => {
        return fetchObservationsForInstallation(installation.id, token).catch(err => {
          console.error(`Failed to fetch observations for installation ${installation.id}:`, err);
        });
      });
      Promise.all(observationPromises).catch(error => console.error(error));
    });
  }, [installations, fetchObservationsForInstallation, getAccessTokenSilently]);
  const latestHaRelease = useInstallationStore(state => state.latestHaRelease);

  const installationsNew =
    installations?.length > 0
      ? installations.map(i =>
          mapToTableView(i, observations[i.id]?.length > 0 ? observations[i.id][0] : undefined, latestHaRelease),
        )
      : [];

  return <InstallationDataTable data={installationsNew} />;
}

function mapToTableView(
  installation: Installation,
  observation: Observation | undefined,
  latestHARelease: string | null,
): InstallationTableView {
  const cpuThreshold = 70;
  const memoryThreshold = 80;
  const volumeThreshold = 90;

  const logErrors = 0; //observation?.logs?.filter(log => log.type === 'error').length ?? 0;
  const logWarnings = 0; // observation?.logs?.filter(log => log.type === 'warning').length ?? 0;

  const lowLqiZigbeeDevices = observation?.zigbee?.devices?.filter(device => device.lqi < 25).length ?? 0;
  const lowBatteryDevices =
    observation?.zigbee?.devices?.filter(
      device => device.battery_level !== null && device.power_source == 'Battery' && device.battery_level < 20,
    ).length ?? 0;

  const unhealthyDockerContainers =
    observation?.docker?.containers?.filter(container => !container.running).length ?? 0;

  return {
    id: installation.id,
    name: installation.name,
    agent_version: observation?.agent_version ?? '-',
    ha_version: observation?.ha_config?.version ?? '-',
    is_healthy: installation.healthy.is_healthy,
    volume_ok: observation?.environment.storage.filter(s => Number(s.use_percentage.slice(0, -1)) > volumeThreshold).length == 0, // Assuming a placeholder as Volume info is not provided
    cpu_ok: observation?.environment?.cpu?.load ? observation.environment.cpu.load < cpuThreshold : false,
    memory_ok: observation?.environment?.memory?.used ? observation.environment.memory.used < memoryThreshold : false,
    ha_version_tick: latestHARelease == null || latestHARelease == observation?.ha_config?.version,
    log_errors: logErrors,
    log_warnings: logWarnings,
    low_lqi_zigbee_devices: lowLqiZigbeeDevices,
    low_battery_devices: lowBatteryDevices,
    unhealthy_docker_containers: unhealthyDockerContainers,
    navigate_to_installation: `/installations/${installation.id}`,
    navigate_to_homeassistant: installation.urls.instance,
  };
}
