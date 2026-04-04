import "../global.css";

import { useEffect } from "react";

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import { useIsAuthenticated, useIsHydrated } from "@/hooks/useAuth";
import { getErrorMessage } from "@/utils/errors";
import { showErrorToast } from "@/utils/toast";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      gcTime: 5 * 60_000,
    },
    mutations: {
      onError: (error: unknown) => {
        showErrorToast(getErrorMessage(error));
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen name="(app)" />
          </Stack.Protected>
        </Stack>
        <Toast position="bottom" />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
