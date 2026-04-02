import "../global.css";

import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";

import { useIsAuthenticated, useIsHydrated } from "@/hooks/useAuth";

SplashScreen.preventAutoHideAsync();

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
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
      </Stack>
      <Toast />
    </>
  );
}
