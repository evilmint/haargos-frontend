import { NotificationsApiResponseNotification } from '@/app/types';
import { produce } from 'immer';
import { create } from 'zustand';
import { fetchNotifications } from '../notifications';

interface NotificationsState {
  notificationsByInstallationId: Record<string, NotificationsApiResponseNotification[]>;
  fetchNotifiactions: (installationId: string, token: string) => Promise<void>;
}

const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notificationsByInstallationId: {},
  async fetchNotifiactions(installationId, token) {
    if (get().notificationsByInstallationId[installationId]) {
      return;
    }

    const response = await fetchNotifications(installationId, token);

    set(
      produce((draft: NotificationsState) => {
        draft.notificationsByInstallationId[installationId] = response.body.notifications;
      }),
    );
  },
}));

export { useNotificationsStore };
