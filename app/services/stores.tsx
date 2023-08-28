import { getUserMe } from './users';
import { create } from 'zustand';
import { Installation, Observation, Log, User, Storage } from '@/app/types';
import { createInstallation, getInstallations } from './installations';
import { getObservations } from './observations';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  isFetchingUser: boolean;
  fetchUser: (token: string) => Promise<void>;
}

const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isFetchingUser: false,
  setUser: user => set(() => ({ user })),
  fetchUser: async token => {
    const { user } = get();
    if (user) return;

    if (get().isFetchingUser) return;
    set({ isFetchingUser: true });

    try {
      const user = await getUserMe(token);
      set({ user });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isFetchingUser: false });
    }
  },
}));

interface InstallationState {
  selectedInstallation: any | null;
  clearInstallation: () => void;
  setSelectedInstallation: (team: any | null) => void;
}

const useInstallationSwitcherStore = create<InstallationState>(set => ({
  selectedInstallation: null,
  clearInstallation: () => set(() => ({ selectedInstallation: null })),
  setSelectedInstallation: selectedInstallation => set(() => ({ selectedInstallation: selectedInstallation })),
}));

interface InstallationStoreState {
  installations: Installation[];
  observations: Record<string, Observation[]>;
  logsByInstallationId: Record<string, Log[]>;
  latestHaRelease: string | null;
  highestStorageByInstallationId: Record<string, Storage | null>;
  isFetchingInstallations: boolean;
  isFetchingObservations: Record<string, boolean>;
  createInstallation: (token: string, instance: string, name: string) => Promise<Installation | null>;
  fetchInstallations: (token: string) => Promise<void>;
  fetchObservationsForInstallation: (installationId: string, token: string) => Promise<void>;
  getObservationsForInstallation: (installationId: string) => Observation[];
}

const useInstallationStore = create<InstallationStoreState>((set, get) => ({
  installations: [],
  observations: {},
  logsByInstallationId: {},
  latestHaRelease: null,
  highestStorageByInstallationId: {},
  isFetchingInstallations: false,
  isFetchingObservations: {},
  createInstallation: async (token: string, instance: string, name: string) => {
    try {
      const newInstallation = await createInstallation(token, instance, name);

      // Update the installations list to include the newly created one
      set(state => ({
        installations: [...state.installations, newInstallation],
      }));

      return newInstallation;
    } catch (error) {
      console.log('Error creating installation:', error);
    }

    return null;
  },
  fetchInstallations: async token => {
    if (get().isFetchingInstallations) return;
    set({ isFetchingInstallations: true });

    const { installations } = get();
    if (installations && installations.length > 0) return;

    try {
      const installations = await getInstallations(token);
      set({
        installations: installations.items,
        latestHaRelease: installations.latest_ha_release,
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isFetchingInstallations: false });
    }
  },
  fetchObservationsForInstallation: async (installationId: string, token: string) => {
    if (get().isFetchingObservations[installationId]) return;
    set(state => ({
      isFetchingObservations: {
        ...state.isFetchingObservations,
        [installationId]: true,
      },
    }));

    const observations = get().observations[installationId];

    if (observations != null && observations.length > 0) {
      return;
    }

    try {
      const observations = await getObservations(installationId, token);
      const updatedObservations = observations.map(observation => {
        let volumesUnsorted = observation.environment.storage.sort(
          (a, b) => Number(b.use_percentage.slice(0, -1)) - Number(a.use_percentage.slice(0, -1)),
        );

        observation.environment.storage = extractUniqueVolumes(volumesUnsorted);
        observation.zigbee?.devices.sort((a, b) => {
          if (a.lqi === 0 && b.lqi === 0) {
            return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime();
          } else if (a.lqi === 0) {
            return 1;
          } else if (b.lqi === 0) {
            return -1;
          }

          return a.lqi - b.lqi;
        });
        return observation;
      });

      set(state => ({
        observations: {
          ...state.observations,
          [installationId]: updatedObservations,
        },
      }));

      let logString = updatedObservations.reduce((acc: string, item: Observation) => acc + item.logs, '');

      set(state => ({
        logsByInstallationId: {
          ...state.logsByInstallationId,
          [installationId]: parseLog(logString),
        },
      }));

      let overallHighestUseStorage: Storage | null = null;
      let overallHighestUsePercentage = -1;

      updatedObservations.forEach(item => {
        const highestUseStorage = findHighestUseStorage(item.environment.storage);

        if (highestUseStorage) {
          const highestUsePercentage = parseInt(highestUseStorage.use_percentage.replace('%', ''));

          if (highestUsePercentage > overallHighestUsePercentage) {
            overallHighestUsePercentage = highestUsePercentage;
            overallHighestUseStorage = highestUseStorage;
          }
        }
      });

      if (overallHighestUseStorage != null) {
        set(state => ({
          highestStorageByInstallationId: {
            ...state.highestStorageByInstallationId,
            [installationId]: overallHighestUseStorage,
          },
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      set(state => ({
        isFetchingObservations: {
          ...state.isFetchingObservations,
          [installationId]: false,
        },
      }));
    }
  },
  getObservationsForInstallation: (installationId: string) => {
    return get().observations[installationId] || [];
  },
}));

function wrapSquareBracketsWithEm(inputString: string) {
  const regex = /\[([^\]]+)\]/g;
  return inputString.replace(regex, '<p class="text-xs">[$1]</p>');
}
const findHighestUseStorage = (storageArray: Storage[]): Storage | null => {
  return storageArray.reduce((highest: Storage | null, storage: Storage) => {
    if (highest === null) {
      return storage;
    }

    const usePercentage = parseInt(storage.use_percentage.replace('%', ''));
    return usePercentage > parseInt(highest.use_percentage.replace('%', '')) ? storage : highest;
  }, null);
};

function parseISOLocal(s: any) {
  var b = s.split(/\D/);
  return new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5]);
}

const parseLog = (logString: string): Log[] => {
  let logs = logString.split('\n');
  let reduced = logs.reduce((acc: Log[], log: string) => {
    const parts = log.split(/\s+/);
    if (parts.length >= 5) {
      const time = parseISOLocal(parts[0] + 'T' + parts[1]);
      const logType = parts[2][0];
      const thread = parts[3].replace('(', '').replace(')', '');
      const restOfLog = parts.slice(4).join(' ');

      acc.push({
        raw: log,
        time: time,
        type: logType,
        thread: thread,
        log: wrapSquareBracketsWithEm(restOfLog), // Ensure wrapSquareBracketsWithEm is correctly typed
      });
    }
    return acc;
  }, []);

  return reduced.sort((a, b) => b.time.getTime() - a.time.getTime());
};

const extractUniqueVolumes = (volumesUnsorted: Storage[]): Storage[] => {
  const map = new Map();
  return volumesUnsorted.reduce((uniqueVolumes: Storage[], volume: Storage) => {
    if (!map.has(volume.mounted_on)) {
      map.set(volume.mounted_on, true);
      uniqueVolumes.push(volume);
    }
    return uniqueVolumes;
  }, []);
};

export { useUserStore, useInstallationStore, useInstallationSwitcherStore };
