import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },
        headerShadowVisible: false,
        headerTintColor: "#1A1A1B",
        headerTitleStyle: { fontWeight: "700", color: "#1A1A1B" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Feed" }} />
      <Stack.Screen name="post/[id]" options={{ title: "Post" }} />
    </Stack>
  );
}
