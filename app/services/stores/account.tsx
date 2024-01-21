import { User } from '@/app/types';
import { create } from 'zustand';
import { createAccount, deleteAccount, updateAccount } from '../account';

interface AccountState {
  deleteAccount: (token: string) => Promise<void>;
  updateAccount: (token: string, data: any) => Promise<void>;
  createAccount: (token: string, userFullName: string) => Promise<User>;
}

const useAccountStore = create<AccountState>(() => ({
  deleteAccount: async token => {
    await deleteAccount(token);
  },
  updateAccount: async (token, data) => {
    await updateAccount(token, data);
  },
  createAccount: async (token, userFullName) => {
    return await createAccount(token, userFullName);
  },
}));

export { useAccountStore };
