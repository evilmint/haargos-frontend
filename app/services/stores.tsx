import { getUserMe } from './users';
import { create } from 'zustand';
import { Installation, Observation, Log, User, Storage } from '@/app/types';
import {
  createInstallation,
  deleteInstallation,
  getInstallations,
} from './installations';
import { getObservations } from './observations';
import { deleteAccount, updateAccount } from './account';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  clear: () => void;
  isFetchingUser: boolean;
  fetchUser: (token: string) => Promise<void>;
}

class UserDoesNotExistError extends Error {}

const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isFetchingUser: false,
  setUser: user => set(() => ({ user })),
  clear: () => set(() => ({ user: null, isFetchingUser: false })),
  fetchUser: async token => {
    const { user } = get();
    if (user) return;

    if (get().isFetchingUser) return;
    set({ isFetchingUser: true });

    try {
      const user = await getUserMe(token);
      if (!user) {
        throw new UserDoesNotExistError();
      }
      set({ user });
    } catch (error) {
      return Promise.reject(error);
    } finally {
      set({ isFetchingUser: false });
    }
  },
}));

interface AccountState {
  deleteAccount: (token: string) => Promise<void>;
  updateAccount: (token: string, data: any) => Promise<void>;
}

const useAccountStore = create<AccountState>(set => ({
  deleteAccount: async token => {
    await deleteAccount(token);
  },
  updateAccount: async (token, data) => {
    await updateAccount(token, data);
  },
}));

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

interface InstallationStoreState {
  installations: Installation[];
  observations: Record<string, Observation[]>;
  logsByInstallationId: Record<string, Log[]>;
  latestHaRelease: string | null;
  highestStorageByInstallationId: Record<string, Storage | null>;
  isFetchingInstallations: boolean;
  isFetchingObservations: Record<string, boolean>;
  clear: () => void;
  createInstallation: (
    token: string,
    instance: string,
    name: string,
  ) => Promise<Installation | null>;
  fetchInstallations: (token: string, force: boolean) => Promise<Installation[]>;
  fetchObservationsForInstallation: (
    installationId: string,
    token: string,
    force: boolean,
  ) => Promise<void>;
  deleteInstallation: (token: string, id: string) => Promise<any>;
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
  clear: () => {
    set(_ => ({
      installations: [],
      observations: {},
      logsByInstallationId: {},
      highestStorageByInstallationId: {},
      isFetchingObservations: {},
    }));
  },
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
  fetchInstallations: async (token, force) => {
    if (get().isFetchingInstallations && !force) return [];
    set({ isFetchingInstallations: true });

    const { installations } = get();

    if (force == false && installations && installations.length > 0) return installations;

    try {
      const installations = await getInstallations(token);

      set({
        installations: installations.items.map(i => {
          i.health_statuses = i.health_statuses.map(h => {
            h.time = Number(h.time); // because of fractions, time is sent as a string
            return h;
          });

          return i;
        }),
        latestHaRelease: installations.latest_ha_release,
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isFetchingInstallations: false });
    }

    return installations;
  },
  fetchObservationsForInstallation: async (
    installationId: string,
    token: string,
    force: boolean = false,
  ) => {
    if (get().isFetchingObservations[installationId]) return;
    set(state => ({
      isFetchingObservations: {
        ...state.isFetchingObservations,
        [installationId]: true,
      },
    }));

    if (!force) {
      const observations = get().observations[installationId];

      if (observations != null && observations.length > 0) {
        return;
      }
    }

    try {
      const observations = await getObservations(installationId, token);

      const updatedObservations = observations
        .map(observation => {
          let volumesUnsorted = observation.environment.storage.sort(
            (a, b) =>
              Number(b.use_percentage.slice(0, -1)) -
              Number(a.use_percentage.slice(0, -1)),
          );

          observation.environment.storage = extractUniqueVolumes(volumesUnsorted);
          observation.zigbee?.devices.sort((a, b) => {
            if (a.lqi === 0 && b.lqi === 0) {
              return (
                new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
              );
            } else if (a.lqi === 0) {
              return 1;
            } else if (b.lqi === 0) {
              return -1;
            }

            return a.lqi - b.lqi;
          });

          const volumeThreshold = Number(
            process.env.NEXT_PUBLIC_WARNING_THRESHOLD_VOLUME,
          );
          const memoryThreshold = Number(
            process.env.NEXT_PUBLIC_WARNING_THRESHOLD_MEMORY,
          );
          const cpuLoadThreshold = Number(
            process.env.NEXT_PUBLIC_WARNING_THRESHOLD_CPU_LOAD,
          );

          observation.has_low_memory = observation.environment?.memory
            ? (observation.environment.memory.used /
                observation.environment.memory.total) *
                100 >=
              memoryThreshold
            : true;
          observation.has_low_storage = observation.environment?.storage
            ? observation.environment.storage.filter(
                s => Number(s.use_percentage.slice(0, -1)) < volumeThreshold,
              ).length == 0
            : true;

          if (observation.zigbee != null) {
            const batteryLevelThreshold = Number(
              process.env.NEXT_PUBLIC_WARNING_THRESHOLD_ZIGBEE_BATTERY_LEVEL,
            );
            const lqiThreshold = Number(
              process.env.NEXT_PUBLIC_WARNING_THRESHOLD_ZIGBEE_LQI,
            );

            observation.zigbee.devices =
              observation.zigbee?.devices.map(z => {
                const hasGoodBattery =
                  (z.battery_level ?? 0) > batteryLevelThreshold &&
                  z.power_source == 'Battery';

                z.has_low_battery = !hasGoodBattery;
                z.has_low_lqi =
                  z.lqi <= lqiThreshold && z.integration_type.toLowerCase() == 'zha';
                return z;
              }) ?? [];
          }

          observation.has_high_cpu_load = observation.environment?.cpu?.load
            ? observation.environment.cpu.load >= cpuLoadThreshold
            : true;

          return observation;
        })
        .sort(
          (o1, o2) => new Date(o2.timestamp).getTime() - new Date(o1.timestamp).getTime(),
        );

      set(state => ({
        observations: {
          ...state.observations,
          [installationId]: updatedObservations,
        },
      }));

      let logString = updatedObservations.reduce(
        (acc: string, item: Observation) => acc + item.logs,
        '',
      );

      const logs = parseLog(logString);

      set(state => ({
        logsByInstallationId: {
          ...state.logsByInstallationId,
          [installationId]: logs,
        },
      }));

      let overallHighestUseStorage: Storage | null = null;
      let overallHighestUsePercentage = -1;

      updatedObservations.forEach(item => {
        const highestUseStorage = findHighestUseStorage(item.environment.storage);

        if (highestUseStorage) {
          const highestUsePercentage = parseInt(
            highestUseStorage.use_percentage.replace('%', ''),
          );

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
  deleteInstallation: async (token: string, id: string) => {
    const { installations } = get();

    try {
      await deleteInstallation(token, id);

      const returned = {
        installations: installations.filter(i => i.id != id),
      };

      set(returned);

      return returned;
    } catch (error) {
      console.log(error);
    }

    return {};
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
    return usePercentage > parseInt(highest.use_percentage.replace('%', ''))
      ? storage
      : highest;
  }, null);
};

function parseISOLocal(s: any) {
  var b = s.split(/\D/);
  return new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5]);
}

const parseLog = (logString: string): Log[] => {
  let logs = logString.split('\n');

  const seenTimes = new Set<number>();

  let reduced = logs.reduce((acc: Log[], log: string) => {
    const parts = log.split(/\s+/);
    if (parts.length >= 5) {
      const time = parseISOLocal(parts[0] + 'T' + parts[1]);

      if (seenTimes.has(time.getTime())) {
        return acc; // skip if this time has already been seen
      }

      seenTimes.add(time.getTime());

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

export {
  useUserStore,
  useAccountStore,
  useInstallationStore,
  useInstallationSwitcherStore,
  UserDoesNotExistError,
};
