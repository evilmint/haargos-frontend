'use client';
import * as React from 'react';

import { useEffect } from 'react';
import { useInstallationStore } from '@/app/services/stores';
import { useAuth0 } from '@auth0/auth0-react';
import { Installation, Observation } from '@/app/types';
import { InstallationDataTable, InstallationTableView } from './installations-data-table';
import { useRouter } from 'next/navigation';

export function InstallationsDataTableProxy() {
  const observations = useInstallationStore(state => state.observations);
  const installations = useInstallationStore(state => state.installations);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(state => state.fetchObservationsForInstallation);
  const { getAccessTokenSilently } = useAuth0();
  const latestHaRelease = useInstallationStore(state => state.latestHaRelease);
  const router = useRouter();

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

  const installationsNew =
    installations?.length > 0
      ? installations.map(i =>
          mapToTableView(
            i,
            observations[i.id]?.length > 0 ? observations[i.id][0] : undefined,
            latestHaRelease,
            id => {
              router.push('installations/' + id);
            },
            url => {
              window.open(url, '_blank', 'noopener,noreferrer');
            },
          ),
        )
      : [];

  return <InstallationDataTable data={installationsNew} />;
}

function mapToTableView(
  installation: Installation,
  observation: Observation | undefined,
  latestHARelease: string | null,
  goToInstallation: (id: string) => void,
  goToHomeAssistant: (url: string) => void,
): InstallationTableView {
  const logErrors = 0; //observation?.logs?.filter(log => log.type === 'error').length ?? 0;
  const logWarnings = 0; // observation?.logs?.filter(log => log.type === 'warning').length ?? 0;

  const lowLqiZigbeeDevices = observation?.zigbee?.devices?.filter(device => device.has_low_lqi).length ?? 0;
  const lowBatteryDevices = observation?.zigbee?.devices?.filter(device => device.has_low_battery).length ?? 0;

  const unhealthyDockerContainers =
    observation?.docker?.containers?.filter(container => !container.running).length ?? 0;

  return {
    id: installation.id,
    general: {
      goToInstallation: () => {
        goToInstallation(installation.id);
      },
      goToHomeAssistant: goToHomeAssistant,
      name: installation.name,
      is_up: installation?.healthy.is_healthy ?? false,
      installation_url: `/installations/${installation.id}`,
      instance_url: installation.urls.instance,
    },
    agent_version: observation?.agent_version ?? '-',
    ha_version: observation?.ha_config?.version ?? '-',
    is_healthy: installation.healthy.is_healthy,
    volume_ok: observation?.has_low_storage != null ? !observation.has_low_storage : false,
    cpu_ok: observation?.has_high_cpu_load != null ? !observation.has_high_cpu_load : false,
    memory_ok: observation?.has_low_memory != null ? !observation.has_low_memory : false,
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
