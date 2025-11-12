import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
interface User {
  id: string;
  name: string;
  email: string;
}
interface UserState {
  user: User | null;
  login: () => void;
  logout: () => void;
}
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: { id: 'mock-user-123', name: 'Alex Doe', email: 'alex.doe@example.com' },
      login: () => set({ user: { id: 'mock-user-123', name: 'Alex Doe', email: 'alex.doe@example.com' } }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'anx-user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);