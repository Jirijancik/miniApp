import { Stack } from "expo-router";

import ErrorBoundary from "@/components/ErrorBoundary";
import FeedContent from "@/components/post/FeedContent";

export default function FeedScreen() {
  return (
    <ErrorBoundary>
      <Stack.Screen
        options={{
          title: "Feed",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { fontWeight: "700", color: "#1A1A1B" },
        }}
      />
      <FeedContent />
    </ErrorBoundary>
  );
}
