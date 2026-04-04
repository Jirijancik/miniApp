import { useLocalSearchParams } from "expo-router";

import PostDetailContent from "@/components/post/PostDetailContent";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <PostDetailContent id={id ?? ""} />;
}
