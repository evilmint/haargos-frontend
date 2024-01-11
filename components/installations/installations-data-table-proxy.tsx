'use client';

import { useInstallationStore, useUserStore } from '@/app/services/stores';
import { Installation, Observation } from '@/app/types';
import { GenericDataTable } from '@/lib/generic-data-table';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  InstallationTableView,
  getColumnsByTier,
} from './installations-data-table-columns';

export function InstallationsDataTableProxy() {
  const observations = useInstallationStore(state => state.observations);
  const installations = useInstallationStore(state => state.installations);
  const fetchInstallations = useInstallationStore(state => state.fetchInstallations);
  const fetchObservationsForInstallation = useInstallationStore(
    state => state.fetchObservationsForInstallation,
  );
  const { user: apiUser } = useUserStore(state => state);
  const { getAccessTokenSilently } = useAuth0();
  const latestHaRelease = useInstallationStore(state => state.latestHaRelease);
  const router = useRouter();

  useEffect(() => {
    getAccessTokenSilently().then(token => {
      fetchInstallations(token, false).catch(error => console.error(error));
    });
  }, [fetchInstallations, getAccessTokenSilently]);

  useEffect(() => {
    getAccessTokenSilently().then(token => {
      let promiseArray: any[] = [];

      installations.forEach(installation => {
        if (observations[installation.id] == null) {
          promiseArray.push(
            fetchObservationsForInstallation(installation.id, token, false).catch(err => {
              console.error(
                `Failed to fetch observations for installation ${installation.id}:`,
                err,
              );
            }),
          );
        }
      });

      Promise.all(promiseArray).catch(error => console.error(error));
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
              router.push('/dashboard/installations/' + id);
            },
            url => {
              window.open(url, '_blank', 'noopener,noreferrer');
            },
          ),
        )
      : [];

  return (
    <GenericDataTable
      columns={getColumnsByTier(apiUser?.tier ?? 'Expired')}
      pluralEntityName="installations"
      columnVisibilityKey="InstallationDataTableColumns"
      data={installationsNew}
    />
  );
}

function mapToTableView(
  installation: Installation,
  observation: Observation | undefined,
  latestHARelease: string | null,
  goToInstallation: (id: string) => void,
  goToHomeAssistant: (url: string) => void,
): InstallationTableView {
  const lowLqiZigbeeDevices =
    observation?.zigbee?.devices?.filter(device => device.has_low_lqi).length ?? 0;
  const lowBatteryDevices =
    observation?.zigbee?.devices?.filter(device => device.has_low_battery).length ?? 0;

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
      is_up:
        installation?.health_statuses.length > 0 &&
        installation.health_statuses[installation.health_statuses.length - 1].is_up,
      installation_url: `/dashboard/installations/${installation.id}`,
      instance_url: installation.urls.instance?.success_url ?? null,
      agent_type: observation?.agent_type ?? '',
    },
    agent_version: observation?.agent_version ?? '-',
    ha_version: observation?.ha_config?.version ?? '-',
    is_healthy:
      installation?.health_statuses.length > 0 &&
      installation.health_statuses[installation.health_statuses.length - 1].is_up,
    volume: observation?.has_low_storage != null ? !observation.has_low_storage : false,
    cpu: observation?.has_high_cpu_load != null ? !observation.has_high_cpu_load : false,
    memory: observation?.has_low_memory != null ? !observation.has_low_memory : false,
    ha_version_tick:
      latestHARelease == null || latestHARelease == observation?.ha_config?.version,
    // log_errors: logErrors,
    // log_warnings: logWarnings,
    low_lqi_zigbee_devices: lowLqiZigbeeDevices,
    low_battery_devices: lowBatteryDevices,
    unhealthy_docker_containers: unhealthyDockerContainers,
    navigate_to_installation: `/dashboard/installations/${installation.id}`,
    navigate_to_homeassistant: installation.urls.instance?.url ?? null,
  };
}
