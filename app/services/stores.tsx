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
  observations: Observation[];
  logs: Log[];
  highestStorage: Storage | null;
  isFetching: boolean;
  fetchInstallations: () => Promise<void>;
}

const findHighestUseStorage = (storageArray: Storage[]): Storage | null => {
  return storageArray.reduce((highest: Storage | null, storage: Storage) => {
    if (highest === null) {
      return storage;
    }

    const usePercentage = parseInt(storage.use_percentage.replace("%", ""));
    return usePercentage > parseInt(highest.use_percentage.replace("%", ""))
      ? storage
      : highest;
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

const useInstallationStore = create<InstallationStoreState>((set, get) => ({
  installations: [],
  observations: [],
  logs: [],
  highestStorage: null,
  isFetching: false,
  fetchInstallations: async () => {
    if (get().isFetching) return;
    set({ isFetching: true });

    const { installations } = get();
    if (installations.length > 0) return;

    try {
      const installations = await getInstallations();
      set({ installations });

      if (installations.length > 0) {
        const observations = await getObservations(installations[0].id);
        const updatedObservations = observations.map((observation) => {
          let volumesUnsorted = observation.environment.storage.sort(
            (a, b) =>
              Number(b.use_percentage.slice(0, -1)) -
              Number(a.use_percentage.slice(0, -1))
          );

          observation.environment.storage =
            extractUniqueVolumes(volumesUnsorted);
          return observation;
        });

        set({ observations: updatedObservations });

        let logString = updatedObservations.reduce(
          (acc: string, item: Observation) => acc + item.logs,
          ""
        );

        set({ logs: parseLog(logString) });

        // Logic to find highest storage
        let overallHighestUseStorage: Storage | null = null;
        let overallHighestUsePercentage = -1;

        updatedObservations.forEach((item) => {
          const highestUseStorage = findHighestUseStorage(
            item.environment.storage
          );

          if (highestUseStorage) {
            const highestUsePercentage = parseInt(
              highestUseStorage.use_percentage.replace("%", "")
            );

            if (highestUsePercentage > overallHighestUsePercentage) {
              overallHighestUsePercentage = highestUsePercentage;
              overallHighestUseStorage = highestUseStorage;
            }
          }
        });

        if (overallHighestUseStorage != null) {
          set({ highestStorage: overallHighestUseStorage });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      set({ isFetching: false });
    }
  },
}));

function wrapSquareBracketsWithEm(inputString: string) {
  const regex = /\[([^\]]+)\]/g;
  return inputString.replace(regex, '<p class="text-xs">[$1]</p>');
}

export { useUserStore, useInstallationStore };
