import { Stack, useLocalSearchParams } from "expo-router";

import PostDetailContent from "@/components/post/PostDetailContent";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen options={{ title: "Post" }} />
      <PostDetailContent id={id ?? ""} />
    </>
  );
}
