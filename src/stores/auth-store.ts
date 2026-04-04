import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { authControllerLogin, authControllerSignup } from "@/api/generated/auth/auth";
import type { SignupInput } from "@/api/generated/model";
import { getErrorMessage } from "@/utils/errors";
import { showErrorToast } from "@/utils/toast";

import { secureStorage } from "./secure-storage";

interface JwtPayload {
  userId: string;
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
  setTokens: (accessToken: string, refreshToken: string) => void;
  setHydrated: (value: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

const extractUserId = (token: string): string | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.userId ?? null;
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
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage),
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
