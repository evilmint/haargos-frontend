import { Job } from '@/app/types';
import { produce } from 'immer';
import { create } from 'zustand';
import { fetchJobs, scheduleJob } from '../jobs';

interface JobsState {
  jobsByInstallationId: Record<string, Job[]>;
  fetchJobs: (installationId: string, token: string) => Promise<void>;
  reloadJobs: (installationId: string, token: string) => Promise<void>;
  scheduleJob: (
    installationId: string,
    token: string,
    type: string,
    context: any,
  ) => Promise<Response>;
}

const useJobsStore = create<JobsState>((set, get) => ({
  jobsByInstallationId: {},
  async fetchJobs(installationId, token) {
    if (get().jobsByInstallationId[installationId]) {
      return;
    }

    const jobs = await fetchJobs(token, installationId);

    set(
      produce((draft: JobsState) => {
        draft.jobsByInstallationId[installationId] = jobs;
      }),
    );
  },
  async reloadJobs(installationId, token) {
    set(
      produce((draft: JobsState) => {
        draft.jobsByInstallationId[installationId] = [];
      }),
    );

    const jobs = await fetchJobs(token, installationId);

    set(
      produce((draft: JobsState) => {
        draft.jobsByInstallationId[installationId] = jobs;
      }),
    );
  },
  async scheduleJob(installationId, token, type, context) {
    return await scheduleJob(installationId, token, type, context);
  },
}));

export { useJobsStore };
