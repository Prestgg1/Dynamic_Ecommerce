// src/store/auth.store.ts
import { create } from "zustand";
import { type components } from "~/lib/types";

type User = components["schemas"]["User"];

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  hasCheckedAuth: boolean;
  setUser: (user: User | null) => void;
  setAuthChecked: (hasCheckedAuth: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  hasCheckedAuth: false,
  setUser: (user) =>
    set({ user, isAuthenticated: !!user, hasCheckedAuth: true }),
  setAuthChecked: (hasCheckedAuth) => set({ hasCheckedAuth }),
  logout: () => {
    set({ user: null, isAuthenticated: false, hasCheckedAuth: true });
  },
}));
