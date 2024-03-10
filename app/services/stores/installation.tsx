import { BatteryType, Installation, Observation, Storage } from '@/app/types';
import { create } from 'zustand';
import {
  createInstallation,
  deleteInstallation,
  getInstallations,
} from '../installations';
import { getObservations } from '../observations';

interface InstallationStoreState {
  installations: Installation[];
  observations: Record<string, Observation[]>;
  latestHaRelease: string | null;
  fetchedInstallations: boolean;
  highestStorageByInstallationId: Record<string, Storage | null>;
  isFetchingInstallations: boolean;
  isFetchingObservations: Record<string, boolean>;
  reloadInstallations: (token: string) => void;
  clear: () => void;
  createInstallation: (
    token: string,
    instance: string,
    name: string,
  ) => Promise<Installation | null>;
  fetchInstallations: (token: string, force: boolean) => Promise<Installation[]>;
  clearAndReloadObservationsForInstallation: (
    installationId: string,
    token: string,
  ) => Promise<void>;
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
  latestHaRelease: null,
  fetchedInstallations: false,
  highestStorageByInstallationId: {},
  isFetchingInstallations: false,
  isFetchingObservations: {},
  clear: () => {
    set(_ => ({
      installations: [],
      observations: {},
      highestStorageByInstallationId: {},
      isFetchingObservations: {},
    }));
  },
  reloadInstallations: async (token: string) => {
    set({ installations: [] });
    await get().fetchInstallations(token, true);
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
      // console.log('Error creating installation:', error);
    }

    return null;
  },
  fetchInstallations: async (token, force) => {
    if (get().isFetchingInstallations && !force) return [];
    set({ isFetchingInstallations: true });

    const { installations } = get();

    if (force == false && get().fetchedInstallations) return installations;

    try {
      const installations = await getInstallations(token);

      set({
        installations: installations.items.map(i => {
          i.health_statuses = i.health_statuses.map(h => {
            h.time = Number(h.time); // because of fractions, time is sent as a string
            return h;
          });

          if (i.urls?.instance?.verification_status === 'SUCCESS') {
            i.urls.instance.success_url = i.urls.instance.url;
          }

          return i;
        }),
        latestHaRelease: installations.latest_ha_release,
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({
        fetchedInstallations: true,
        isFetchingInstallations: false,
      });
    }

    return installations;
  },
  clearAndReloadObservationsForInstallation: async (
    installationId: string,
    token: string,
  ) => {
    set(state => ({
      observations: {
        ...state.observations,
        [installationId]: [],
      },
    }));
    await get().fetchObservationsForInstallation(installationId, token, true);
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

          if (
            observation.zigbee &&
            observation.zigbee.devices.length > 0 &&
            observation.zigbee.devices[0].lqi
          ) {
            observation.zigbee?.devices.sort((a, b) => {
              if (a.lqi == undefined) {
                return -1;
              } else if (b.lqi == undefined) {
                return 1;
              }

              if (a.lqi === 0 && b.lqi === 0) {
                return (
                  new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
                );
              } else if (a.lqi === 0) {
                return 1;
              } else if (b.lqi === 0) {
                return -1;
              }

              return (a.lqi ?? 0) - (b.lqi ?? 0);
            });
          }

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

                const modelToBatteryMap = new Map<string, BatteryType>([
                  ['eWeLink TH01', { type: 'CR 2450', count: 1 }],
                  ['XIAOMI lumi.sen_ill.mgl01', { type: 'CR 2450', count: 1 }],
                  ['eWeLink MS01', { type: 'CR 2450', count: 1 }],
                  ['LUMI lumi.sensor_wleak.aq1', { type: 'CR 2032', count: 1 }],
                  ['LUMI lumi.sensor_magnet.aq2', { type: 'CR 1632', count: 1 }],
                  ['LUMI lumi.sensor_motion.aq2', { type: 'CR 2450', count: 2 }],
                  ['LUMI lumi.sensor_smoke', { type: 'CR 123A', count: 1 }],
                  ['LUMI lumi.airrtc.agl001', { type: 'AA', count: 1 }],
                  ['LUMI lumi.sensor_switch', { type: 'CR 2032', count: 1 }],
                  ['LUMI lumi.weather', { type: 'CR 2032', count: 1 }],
                  ['_TZ2000_a476raq2 TS0201', { type: 'AAA', count: 2 }],
                ]);

                const mainsDevices = [
                  '_TZE200_ikvncluo TS0601',
                  '_TZE200_lyetpprm TS0601',
                  '_TZE200_wukb7rhc TS0601',
                  '_TZE200_jva8ink8 TS0601',
                  '_TZE204_ztc6ggyl TS0601',
                  '_TZE200_ztc6ggyl TS0601',
                  '_TZ3400_keyjqthh TS0041',
                  '_TZ3000_tk3s5tyg TS0041',
                  '_TYZB01_ef5xlc9q TS0202',
                  '_TZ3000_kmh5qpmb TS0202',
                  '_TYZB01_zwvaj5wy TS0202',
                  '_TYZB01_tv3wxhcz TS0202',
                  '_TYZB01_jytabjkb TS0202',
                ];

                const fingerprint = `${z.brand} ${z.entity_name}`;

                if (
                  z.power_source == 'Mains' ||
                  z.entity_name.indexOf('CC2652') != -1 ||
                  mainsDevices.indexOf(fingerprint) != -1 ||
                  z.entity_name.indexOf('TS0503A') != -1
                ) {
                  z.battery = { type: 'N/A', count: null };
                  z.power_source = 'Mains'; // Make sure this is true every time the condition is changed
                } else {
                  z.battery = modelToBatteryMap.get(fingerprint) ?? null;
                }

                z.has_low_battery = !hasGoodBattery;
                z.has_low_lqi =
                  z.lqi !== undefined
                    ? z.lqi <= lqiThreshold && z.integration_type.toLowerCase() == 'zha'
                    : false;
                return z;
              }) ?? [];
          }

          if (observation.environment?.storage) {
            let storageKeys = new Set();
            let uniqueStorages: any[] = [];

            observation.environment.storage.forEach(storage => {
              if (!storageKeys.has(storage.name)) {
                storageKeys.add(storage.name);
                uniqueStorages.push(storage);
              }
            });

            observation.environment = {
              ...observation.environment,
              storage: uniqueStorages,
            };
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

export { useInstallationStore };
