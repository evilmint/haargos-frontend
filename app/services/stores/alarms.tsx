import { AlarmConfiguration, UserAlarmConfiguration } from '@/app/types';
import { produce } from 'immer';
import { create } from 'zustand';
import {
  deleteAlarmConfiguration,
  fetchAlarmConfigurations,
  fetchUserAlarmConfigurations,
} from '../alarms';

interface AlarmsState {
  alarmConfigurations: AlarmConfiguration[];
  userAlarmConfigurations: UserAlarmConfiguration[];
  reloadUserAlarmConfigurations: (token: string) => Promise<void>;
  deleteUserAlarm: (token: string, alarmId: string) => Promise<void>;
  fetchAlarms: (token: string) => Promise<void>;
  fetchUserAlarms: (token: string) => Promise<void>;
}

const useAlarmsStore = create<AlarmsState>((set, get) => ({
  alarmConfigurations: [],
  userAlarmConfigurations: [],
  async fetchAlarms(token: string) {
    if (get().alarmConfigurations.length > 0) {
      return;
    }
    // This would be a fetch call to your API to retrieve alarms

    const alarmConfigurations = (await fetchAlarmConfigurations(token)).body
      .configurations;
    set(state => ({
      ...state,
      alarmConfigurations,
    }));
  },
  async deleteUserAlarm(token: string, alarmId: string) {
    try {
      await deleteAlarmConfiguration(token, alarmId);
      set(
        produce((draft: AlarmsState) => {
          draft.userAlarmConfigurations = draft.userAlarmConfigurations.filter(
            c => c.id !== alarmId,
          );
        }),
      );
    } catch (e) {
      throw e;
    }
  },
  async fetchUserAlarms(token: string) {
    if (get().userAlarmConfigurations.length > 0) {
      return;
    }
    // This would be a fetch call to your API to retrieve alarms

    const userAlarmConfigurations = (await fetchUserAlarmConfigurations(token)).body
      .configurations;
    set(state => ({
      ...state,
      userAlarmConfigurations,
    }));
  },
  async reloadUserAlarmConfigurations(token: string) {
    set(state => ({
      ...state,
      userAlarmConfigurations: [],
    }));

    const userAlarmConfigurations = (await fetchUserAlarmConfigurations(token)).body
      .configurations;

    set(state => ({
      ...state,
      userAlarmConfigurations,
    }));
  },
}));

export { useAlarmsStore };
