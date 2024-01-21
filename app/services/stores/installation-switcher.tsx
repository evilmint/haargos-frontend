import { Installation } from '@/app/types';
import { create } from 'zustand';

interface InstallationState {
  selectedInstallation: Installation | null;
  clearInstallation: () => void;
  clear: () => void;
  setSelectedInstallation: (installation: any | null) => void;
}
const useInstallationSwitcherStore = create<InstallationState>(set => ({
  selectedInstallation: null,
  clearInstallation: () => set(() => ({ selectedInstallation: null })),
  clear: () => set(() => ({ selectedInstallation: null })),
  setSelectedInstallation: selectedInstallation =>
    set(() => ({ selectedInstallation: selectedInstallation })),
}));

export { useInstallationSwitcherStore };
