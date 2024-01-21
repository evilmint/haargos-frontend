import { AddonsApiResponseAddon } from '@/app/types';
import { create } from 'zustand';
import { fetchAddons } from '../addons';

interface AddonsState {
  addonsByInstallationId: Record<string, AddonsApiResponseAddon[]>;
  fetchAddons: (installationId: string, token: string) => Promise<void>;
}

const useAddonsStore = create<AddonsState>((set, get) => ({
  addonsByInstallationId: {},
  async fetchAddons(installationId, token) {
    if (get().addonsByInstallationId[installationId]) {
      return;
    }

    const response = await fetchAddons(installationId, token);

    set(state => ({
      addonsByInstallationId: {
        ...state.addonsByInstallationId,
        [installationId]: response.body.addons,
      },
    }));
  },
}));

export { useAddonsStore };
