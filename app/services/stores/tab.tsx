import { create } from 'zustand';

interface TabState {
  currentTab: string;
  setCurrentTab: (value: string) => void;
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
