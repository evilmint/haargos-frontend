'use client';

import { useAddonsStore } from '@/app/services/stores/addons';
import { useAlarmsStore } from '@/app/services/stores/alarms';
import { AddonsApiResponseAddon, UserAlarmConfiguration } from '@/app/types';
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
  const addons =
    useAddonsStore(state => state.addonsByInstallationId[params.installationId]) ?? [];
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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [fetchUserAlarmConfigurations, getAccessTokenSilently, user]);

  const alarmConfigurationViews = (alarmConfigurationsSorted ?? []).map(c => {
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

    return mapToTableView(addons, c, delAlarm, editAlarm);
  });

  return (
    <GenericDataTable
      pluralEntityName="alarm configurations"
      filterColumnName="name"
      columns={columns}
      columnVisibilityKey="UserAlarmConfigurationDataTable_columnVisibility"
      data={alarmConfigurationViews}
      reload={async () => {
        const token = await getAccessTokenSilently();
        await reloadUserAlarmConfigurations(token);
      }}
    />
  );
}

function mapToTableView(
  addons: AddonsApiResponseAddon[],
  alarmConfiguration: UserAlarmConfiguration,
  deleteAlarm: (alarmId: string) => void,
  editAlarm: (alarmId: string) => void,
): AlarmConfigurationTableView {
  return {
    id: alarmConfiguration.id,
    name: createAlarmConfigurationName(alarmConfiguration, addons),
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
