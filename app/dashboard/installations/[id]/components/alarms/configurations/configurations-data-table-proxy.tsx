'use client';

import { useAlarmsStore } from '@/app/services/stores/alarms';
import { UserAlarmConfiguration } from '@/app/types';
import { GenericDataTable } from '@/lib/generic-data-table';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import {
  AlarmConfigurationTableView,
  columns,
} from './configurations-data-table-columns';

export function ConfigurationsDataTableProxy({ ...params }) {
  const fetchUserAlarmConfigurations = useAlarmsStore(state => state.fetchUserAlarms);
  const reloadUserAlarmConfigurations = useAlarmsStore(
    state => state.reloadUserAlarmConfigurations,
  );
  const deleteAlarm = useAlarmsStore(state => state.deleteUserAlarm);
  const alarmConfigurations = useAlarmsStore(state => state.userAlarmConfigurations);

  const { getAccessTokenSilently, user } = useAuth0();

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchUserAlarmConfigurations(token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [fetchUserAlarmConfigurations, getAccessTokenSilently, user]);

  const alarmConfigurationViews = (alarmConfigurations ?? []).map(c => {
    return mapToTableView(c, async (alarmId: string) => {
      const token = await getAccessTokenSilently();

      try {
        await deleteAlarm(token, alarmId);
        toast.success('Alarm deleted successfully.');
      } catch {
        toast.error('Failed to delete alarm.');
      }
    });
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
  alarmConfiguration: UserAlarmConfiguration,
  deleteAlarm: (alarmId: string) => void,
): AlarmConfigurationTableView {
  return {
    id: alarmConfiguration.id,
    name: alarmConfiguration.name,
    type: alarmConfiguration.type,
    category: alarmConfiguration.category,
    created_at: alarmConfiguration.created_at,
    actions: {
      alarmId: alarmConfiguration.id,
      deleteAlarm: deleteAlarm,
    },
  };
}
