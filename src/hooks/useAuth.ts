import { useAuthStore } from "@/stores/auth-store";

export const useIsAuthenticated = () =>
  useAuthStore((state) => !!state.accessToken);

export const useIsHydrated = () =>
  useAuthStore((state) => state.isHydrated);

export const useUserId = () =>
  useAuthStore((state) => state.userId);

export const useAuthLoading = () =>
  useAuthStore((state) => state.isLoading);
