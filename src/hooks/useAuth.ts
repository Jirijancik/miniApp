import { useAuthStore } from "@/stores/auth-store";

export const useIsAuthenticated = () => useAuthStore((state) => !!state.accessToken);

export const useIsHydrated = () => useAuthStore((state) => state.isHydrated);

export const useUserId = () => useAuthStore((state) => state.userId);

export const useAuthLoading = () => useAuthStore((state) => state.isLoading);

// Imperative action getters — not hooks, just accessors for store actions.
// Keeps components from importing useAuthStore directly (Dependency Inversion).
export const getLogin = () => useAuthStore.getState().login;
export const getSignup = () => useAuthStore.getState().signup;
export const getLogout = () => useAuthStore.getState().logout;
