import { getUserMe } from "./users";
import { create } from "zustand";
import { Log, User, Storage } from "@/app/types.d";
import { Installation, Observation } from "@/app/types";
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

    if (installations.length > 0) {
      return;
    }

    try {
      const installations = await getInstallations();
      set({ installations });

      if (installations.length > 0) {
        const observations = await getObservations(installations[0].id);

        // Update observations with unique and sorted volumes
        const updatedObservations = observations.map((observation) => {
          let volumesUnsorted = observation.environment.storage.sort(
            (a, b) =>
              Number(b.use_percentage.slice(0, -1)) -
              Number(a.use_percentage.slice(0, -1))
          );

          let uniqueVolumes = [];
          const map = new Map();
          for (const item of volumesUnsorted) {
            if (!map.has(item.mounted_on)) {
              map.set(item.mounted_on, true); // set any value to Map
              uniqueVolumes.push(item);
            }
          }

          // replace the storage array with the unique and sorted volumes
          observation.environment.storage = uniqueVolumes;

          return observation;
        });

        set({ observations: updatedObservations });

        let logString = "";

        for (const item of updatedObservations) {
          logString += item.logs;
        }

        let logs = logString.split("\n");

        const resultArray: Log[] = [];

        for (const log of logs) {
          const parts = log.split(/\s+/);

          if (parts.length < 5) {
            continue;
          }

          const time = new Date(
            parts[0] + "T" + parts[1] + "Z"
          ).toLocaleString();
          const logType = parts[2][0];
          const thread = parts[3].replace("(", "").replace(")", "");
          const restOfLog = parts.slice(4).join(" ");

          resultArray.push({
            raw: log,
            time: time,
            type: logType,
            thread: thread,
            log: wrapSquareBracketsWithEm(restOfLog), // Ensure wrapSquareBracketsWithEm is correctly typed
          });
        }

        set({ logs: resultArray });

        // Logic to find highest storage
        let overallHighestUseStorage: Storage | null = null;
        let overallHighestUsePercentage = -1;

        const findHighestUseStorage = (
          storageArray: Storage[]
        ): Storage | null => {
          let highestUsePercentage = -1;
          let highestUseStorage = null;

          storageArray.forEach((storage) => {
            const usePercentage = parseInt(
              storage.use_percentage.replace("%", "")
            );
            if (usePercentage > highestUsePercentage) {
              highestUsePercentage = usePercentage;
              highestUseStorage = storage;
            }
          });

          return highestUseStorage;
        };

        updatedObservations.forEach((item) => {
          const storageArray = item.environment.storage;
          const highestUseStorage = findHighestUseStorage(storageArray);

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
