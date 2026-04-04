import { useCallback } from "react";
import { useRouter } from "expo-router";

import ErrorBoundary from "@/components/ErrorBoundary";
import ProfileContent from "@/components/ProfileContent";

export default function ProfileScreen() {
  const router = useRouter();

  const handlePostPress = useCallback(
    (postId: string) => router.push(`/(app)/(home)/post/${postId}`),
    [router],
  );

  return (
    <ErrorBoundary>
      <ProfileContent onPostPress={handlePostPress} />
    </ErrorBoundary>
  );
}
