import { Stack } from "expo-router";

import { THEME } from "@/constants/colors";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: THEME.header.bg },
        headerShadowVisible: false,
        headerTintColor: THEME.header.tint,
        headerTitleStyle: { fontWeight: "700", color: THEME.header.tint },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Feed" }} />
      <Stack.Screen name="post/[id]" options={{ title: "Post" }} />
    </Stack>
  );
}
