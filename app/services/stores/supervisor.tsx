import { SupervisorInfo } from '@/app/types';
import { create } from 'zustand';
import { fetchSupervisorInfo } from '../supervisor';

interface SupervisorState {
  supervisorByInstallationId: Record<string, SupervisorInfo | null>;
  fetchSupervisor: (installationId: string, token: string) => Promise<void>;
}

const useSupervisorStore = create<SupervisorState>((set, get) => ({
  supervisorByInstallationId: {},
  async fetchSupervisor(installationId, token) {
    if (get().supervisorByInstallationId[installationId]) {
      return;
    }

    const response = await fetchSupervisorInfo(installationId, token);

    set(state => ({
      supervisorByInstallationId: {
        ...state.supervisorByInstallationId,
        [installationId]: response.body,
      },
    }));
  },
}));

export { useSupervisorStore };
