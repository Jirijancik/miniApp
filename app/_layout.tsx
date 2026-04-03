import "../global.css";

import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { useIsAuthenticated, useIsHydrated } from "@/hooks/useAuth";
import { showErrorToast } from "@/utils/toast";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
    mutations: {
      onError: (error: unknown) => {
        const message =
          error instanceof Error ? error.message : "Something went wrong";
        showErrorToast(message);
      },
    },
  },
});

export default function RootLayout() {
  const isAuthenticated = useIsAuthenticated();
  const isHydrated = useIsHydrated();

  // Hide splash screen once auth state is loaded
  useEffect(() => {
    if (isHydrated) {
      SplashScreen.hideAsync();
    }
  }, [isHydrated]);

  if (!isHydrated) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
      </Stack>
      <Toast />
    </QueryClientProvider>
  );
}
