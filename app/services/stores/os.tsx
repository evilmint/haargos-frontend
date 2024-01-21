import { OSInfo } from '@/app/types';
import { create } from 'zustand';
import { fetchOSInfo } from '../os';

interface OSState {
  osByInstallationId: Record<string, OSInfo | null>;
  fetchOS: (installationId: string, token: string) => Promise<void>;
}

const useOSStore = create<OSState>((set, get) => ({
  osByInstallationId: {},
  async fetchOS(installationId, token) {
    if (get().osByInstallationId[installationId]) {
      return;
    }

    const response = await fetchOSInfo(installationId, token);

    set(state => ({
      osByInstallationId: {
        ...state.osByInstallationId,
        [installationId]: response.body,
      },
    }));
  },
}));

export { useOSStore };
