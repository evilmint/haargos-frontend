import { create } from 'zustand';
import { contact } from '../contact';

interface ContactState {
  contact: (name: string, email: string, message: string) => Promise<void>;
}

const useContactStore = create<ContactState>(() => ({
  contact: async (name, email, message) => {
    await contact(name, email, message);
  },
}));

export { useContactStore };
