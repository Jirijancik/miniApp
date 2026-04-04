import { useCallback } from "react";

import { useRouter } from "expo-router";

export function usePostNavigation() {
  const router = useRouter();

  const navigateToPost = useCallback(
    (postId: string) => {
      router.push(`/(app)/(home)/post/${postId}`);
    },
    [router],
  );

  return { navigateToPost };
}
