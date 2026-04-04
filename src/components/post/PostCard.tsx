import { memo } from "react";

import { Pressable, Text, View } from "react-native";

import type { PostResponse } from "@/api/generated/model";
import PostAuthorHeader from "@/components/post/PostAuthorHeader";

interface PostCardProps {
  post: PostResponse;
  onPress: (postId: string) => void;
}

function PostCard({ post, onPress }: PostCardProps) {
  return (
    <Pressable
      onPress={() => onPress(post.id)}
      accessibilityRole="button"
      accessibilityHint="Opens post details"
      className="mx-3 mb-2.5 rounded-xl bg-white p-4 active:opacity-80"
    >
      <View className="mb-2">
        <PostAuthorHeader authorId={post.authorId} createdAt={post.createdAt} compact />
      </View>

      {/* Title */}
      <Text className="text-base font-semibold leading-snug text-neutral-900" numberOfLines={2}>
        {post.title}
      </Text>

      {/* Content preview */}
      <Text className="mt-1 text-sm leading-relaxed text-neutral-500" numberOfLines={3}>
        {post.content}
      </Text>
    </Pressable>
  );
}

export default memo(PostCard);
