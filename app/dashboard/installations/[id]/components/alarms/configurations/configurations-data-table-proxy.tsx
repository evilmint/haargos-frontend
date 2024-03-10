'use client';

import { useAddonsStore } from '@/app/services/stores/addons';
import { useAlarmsStore } from '@/app/services/stores/alarms';
import { useInstallationStore } from '@/app/services/stores/installation';
import {
  AddonsApiResponseAddon,
  Automation,
  Scene,
  Script,
  Storage,
  UserAlarmConfiguration,
  ZigbeeDevice,
} from '@/app/types';
import { GenericDataTable } from '@/lib/generic-data-table';
import { useHaargosRouter } from '@/lib/haargos-router';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { createAlarmConfigurationName } from '../alarm-configuration-name';
import {
  AlarmConfigurationTableView,
  columns,
} from './configurations-data-table-columns';

export function ConfigurationsDataTableProxy(params: { installationId: string }) {
  const fetchUserAlarmConfigurations = useAlarmsStore(state => state.fetchUserAlarms);
  const reloadUserAlarmConfigurations = useAlarmsStore(
    state => state.reloadUserAlarmConfigurations,
  );

  const installationObservation = useInstallationStore(
    state => state.observations[params.installationId],
  )?.[0];

  const fetchObservations = useInstallationStore(
    state => state.fetchObservationsForInstallation,
  );

  const addons =
    useAddonsStore(state => state.addonsByInstallationId[params.installationId]) ?? [];
  const scripts = installationObservation?.scripts ?? [];
  const scenes = installationObservation?.scenes ?? [];
  const automations = installationObservation?.automations ?? [];
  const storages = installationObservation?.environment.storage ?? [];
  const zigbeeDevices = installationObservation?.zigbee?.devices ?? [];

  const deleteAlarm = useAlarmsStore(state => state.deleteUserAlarm);
  const alarmConfigurations = useAlarmsStore(state => state.userAlarmConfigurations);
  const fetchAddonsForInstallation = useAddonsStore(state => state.fetchAddons);
  let alarmConfigurationsSorted = [...alarmConfigurations];

  if (alarmConfigurationsSorted.length > 0) {
    alarmConfigurationsSorted.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  const { getAccessTokenSilently, user } = useAuth0();
  const router = useHaargosRouter(useRouter());

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchUserAlarmConfigurations(token);
      await fetchAddonsForInstallation(params.installationId, token);
      await fetchObservations(params.installationId, token, false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [fetchUserAlarmConfigurations, getAccessTokenSilently, user]);

  const alarmConfigurationViews = (alarmConfigurationsSorted ?? []).map(
    alarmConfiguration => {
      const delAlarm = async (alarmId: string) => {
        const token = await getAccessTokenSilently();

        try {
          await deleteAlarm(token, alarmId);
          toast.success('Alarm deleted successfully.');
        } catch {
          toast.error('Failed to delete alarm.');
        }
      };

      const editAlarm = async (alarmId: string) => {
        router.navigateToInstallationAlarmEdit(params.installationId, alarmId);
      };

      return mapToTableView(
        addons,
        scripts,
        scenes,
        automations,
        storages,
        zigbeeDevices,
        alarmConfiguration,
        delAlarm,
        editAlarm,
      );
    },
  );

  return (
    <GenericDataTable
      pluralEntityName="alarm configurations"
      filterColumnName="name"
      columns={columns}
      columnVisibilityKey="UserAlarmConfigurationDataTable_columnVisibility"
      data={alarmConfigurationViews}
      // linkColumnName="name"
      // link={col => {
      //   return 'http://www.wp.pl';
      // }}
      reload={async () => {
        const token = await getAccessTokenSilently();
        await reloadUserAlarmConfigurations(token);
      }}
    />
  );
}

function mapToTableView(
  addons: AddonsApiResponseAddon[],
  scripts: Script[],
  scenes: Scene[],
  automations: Automation[],
  storages: Storage[],
  zigbeeDevices: ZigbeeDevice[],
  alarmConfiguration: UserAlarmConfiguration,
  deleteAlarm: (alarmId: string) => void,
  editAlarm: (alarmId: string) => void,
): AlarmConfigurationTableView {
  return {
    id: alarmConfiguration.id,
    name: createAlarmConfigurationName(
      alarmConfiguration,
      addons,
      scripts,
      scenes,
      storages,
      automations,
      zigbeeDevices,
    ),
    type: alarmConfiguration.type,
    category:
      alarmConfiguration.category.substring(0, 1).toLocaleUpperCase() +
      alarmConfiguration.category.substring(1).toLocaleLowerCase(),
    created_at: alarmConfiguration.created_at,
    actions: {
      alarmId: alarmConfiguration.id,
      deleteAlarm: deleteAlarm,
      editAlarm: editAlarm,
    },
  };
}
