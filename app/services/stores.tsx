import { getUserMe } from "./users";
import { create } from "zustand";
import { Installation, Observation, Log, User, Storage } from "@/app/types";
import { getInstallations } from "./installations";
import { getObservations } from "./observations";

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  fetchUser: async () => {
    try {
      const user = await getUserMe(); // Ensure getUserMe is correctly typed
      set({ user });
    } catch (error) {
      console.log(error);
    }
  },
}));

interface InstallationStoreState {
  installations: Installation[];
  observations: Record<string, Observation[]>;
  logsByInstallationId: Record<string, Log[]>;
  haVersion: Record<string, string>;
  highestStorageByInstallationId: Record<string, Storage | null>;
  isFetchingInstallations: boolean;
  isFetchingObservations: Record<string, boolean>;
  fetchInstallations: () => Promise<void>;
  fetchObservationsForInstallation: (installationId: string) => Promise<void>;
  getObservationsForInstallation: (installationId: string) => Observation[];
}

const useInstallationStore = create<InstallationStoreState>((set, get) => ({
  installations: [],
  observations: {},
  logsByInstallationId: {},
  haVersion: {},
  highestStorageByInstallationId: {},
  isFetchingInstallations: false,
  isFetchingObservations: {},
  fetchInstallations: async () => {
    if (get().isFetchingInstallations) return;
    set({ isFetchingInstallations: true });

    const { installations } = get();
    if (installations.length > 0) return;

    try {
      const installations = await getInstallations();
      set({ installations });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isFetchingInstallations: false });
    }
  },
  fetchObservationsForInstallation: async (installationId: string) => {
    if (get().isFetchingObservations[installationId]) return;
    set((state) => ({
      isFetchingObservations: {
        ...state.isFetchingObservations,
        [installationId]: true,
      },
    }));

    try {
      const observations = await getObservations(installationId);
      const updatedObservations = observations.map((observation) => {
        let volumesUnsorted = observation.environment.storage.sort(
          (a, b) => Number(b.use_percentage.slice(0, -1)) - Number(a.use_percentage.slice(0, -1))
        );

        observation.environment.storage = extractUniqueVolumes(volumesUnsorted);
        return observation;
      });

      set((state) => ({
        observations: {
          ...state.observations,
          [installationId]: updatedObservations,
        },
      }));

      let logString = updatedObservations.reduce((acc: string, item: Observation) => acc + item.logs, "");

      set((state) => ({
        logsByInstallationId: {
          ...state.logsByInstallationId,
          [installationId]: parseLog(logString),
        },
      }));

      const homeAssistantContainer = updatedObservations
        .flatMap((observation) => observation.docker.containers)
        .find((container) => container.image.startsWith("ghcr.io/home-assistant/home-assistant:"));

      if (homeAssistantContainer) {
        const haVersion = homeAssistantContainer.image.split(":")[1];
        set((state) => ({
          haVersion: { ...state.haVersion, [installationId]: haVersion },
        }));
      }

      let overallHighestUseStorage: Storage | null = null;
      let overallHighestUsePercentage = -1;

      updatedObservations.forEach((item) => {
        const highestUseStorage = findHighestUseStorage(item.environment.storage);

        if (highestUseStorage) {
          const highestUsePercentage = parseInt(highestUseStorage.use_percentage.replace("%", ""));

          if (highestUsePercentage > overallHighestUsePercentage) {
            overallHighestUsePercentage = highestUsePercentage;
            overallHighestUseStorage = highestUseStorage;
          }
        }
      });

      if (overallHighestUseStorage != null) {
        set((state) => ({
          highestStorageByInstallationId: {
            ...state.highestStorageByInstallationId,
            [installationId]: overallHighestUseStorage,
          },
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      set((state) => ({
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

    const usePercentage = parseInt(storage.use_percentage.replace("%", ""));
    return usePercentage > parseInt(highest.use_percentage.replace("%", "")) ? storage : highest;
  }, null);
};

const parseLog = (logString: string): Log[] => {
  const logs = logString.split("\n");
  return logs.reduce((acc: Log[], log: string) => {
    const parts = log.split(/\s+/);
    if (parts.length >= 5) {
      const time = new Date(parts[0] + "T" + parts[1] + "Z").toLocaleString();
      const logType = parts[2][0];
      const thread = parts[3].replace("(", "").replace(")", "");
      const restOfLog = parts.slice(4).join(" ");

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

export { useUserStore, useInstallationStore };
