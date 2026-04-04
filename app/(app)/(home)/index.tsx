import { Stack } from "expo-router";

import ErrorBoundary from "@/components/ErrorBoundary";
import FeedContent from "@/components/post/FeedContent";

export default function FeedScreen() {
  return (
    <ErrorBoundary>
      <Stack.Screen options={{ title: "Feed" }} />
      <FeedContent />
    </ErrorBoundary>
  );
}
