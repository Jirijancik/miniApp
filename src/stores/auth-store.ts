import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

import {
  authControllerLogin,
  authControllerSignup,
} from "@/api/generated/auth/auth";
import type { SignupInput } from "@/api/generated/model";
import { refreshAxiosInstance } from "@/api/axios-instance";
import { showErrorToast } from "@/utils/toast";
import { getErrorMessage } from "@/utils/errors";

interface JwtPayload {
  sub: string;
  exp?: number;
  iat?: number;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  isLoading: boolean;
  isHydrated: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupInput) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setHydrated: (value: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

const extractUserId = (token: string): string | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.sub ?? null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      accessToken: null,
      refreshToken: null,
      userId: null,
      isLoading: false,
      isHydrated: false,

      // Actions
      setTokens: (accessToken: string, refreshToken: string) => {
        const userId = extractUserId(accessToken);
        set({ accessToken, refreshToken, userId });
      },

      setHydrated: (value: boolean) => {
        set({ isHydrated: value });
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const data = await authControllerLogin({ email, password });
          get().setTokens(data.accessToken, data.refreshToken);
        } catch (error: unknown) {
          showErrorToast(getErrorMessage(error));
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async (data: SignupInput) => {
        set({ isLoading: true });
        try {
          const response = await authControllerSignup(data);
          get().setTokens(response.accessToken, response.refreshToken);
        } catch (error: unknown) {
          showErrorToast(getErrorMessage(error));
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
        });
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          get().logout();
          return null;
        }

        try {
          const { data } = await refreshAxiosInstance.post<{
            access_token: string;
          }>("/auth/refresh-token", { token: refreshToken });

          // Refresh endpoint returns snake_case
          const newAccessToken = data.access_token;
          set({ accessToken: newAccessToken, userId: extractUserId(newAccessToken) });
          return newAccessToken;
        } catch {
          showErrorToast("Session expired. Please log in again.");
          get().logout();
          return null;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        userId: state.userId,
      }),
      onRehydrateStorage: () => {
        return (_state, error) => {
          if (error) {
            if (__DEV__) {
              console.warn("Failed to rehydrate auth store:", error);
            }
          }
          // Always mark as hydrated, even on error
          useAuthStore.getState().setHydrated(true);
        };
      },
    },
  ),
);
