import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api.js";

export const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      // We'll use this to track hydration status for the layout
      isHydrated: false,
      setHydrated: (value) => set({ isHydrated: value }),

      register: async (username, email, password) => {
        try {
          set({ isLoading: true });
          const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message || "Registration failed");

          // Just update the state; persist handles AsyncStorage automatically
          set({ user: data.user, token: data.token });
          return { success: true };
        } catch (error) {
          return { success: false, message: error.message };
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email, password) => {
        try {
          set({ isLoading: true });
          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
          });

          const data = await response.json();

          if (!response.ok) throw new Error(data.message || "Login failed");

          set({ user: data.user, token: data.token });
          return { success: true };
        } catch (error) {
          return { success: false, message: error.message };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage", // Unique key for AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      // This part ensures we know exactly when the data is loaded from disk
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);