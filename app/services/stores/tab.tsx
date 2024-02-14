import { create } from 'zustand';

type TabType = 'alarms' | 'overview' | 'homeassistant' | 'host' | 'jobs' | 'install';

interface TabState {
  currentTab: TabType;
  setCurrentTab: (value: TabType) => void;
}

const useTabStore = create<TabState>((set, get) => ({
  currentTab: 'overview',
  setCurrentTab(value) {
    set(state => ({
      currentTab: value,
    }));
  },
}));

export { useTabStore };
export type { TabType };
