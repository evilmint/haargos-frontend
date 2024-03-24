import { AlarmHistory } from '@/app/types';
import { create } from 'zustand';
import { fetchAlarmHistory } from '../triggers';

interface TriggersState {
  triggersByInstallationId: Record<string, AlarmHistory[]>;
  fetchTriggers: (installationId: string, token: string) => Promise<void>;
}

const useTriggersState = create<TriggersState>((set, get) => ({
  triggersByInstallationId: {},
  async fetchTriggers(installationId, token) {
    if (get().triggersByInstallationId[installationId]) {
      return;
    }

    const response = await fetchAlarmHistory(token, installationId);

    set(state => ({
      triggersByInstallationId: {
        ...state.triggersByInstallationId,
        [installationId]: response.body.history,
      },
    }));
  },
}));

export { useTriggersState };
