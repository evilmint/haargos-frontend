import { User } from '@/app/types';
import { create } from 'zustand';
import { getUserMe } from '../users';

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

export { UserDoesNotExistError, useUserStore };
