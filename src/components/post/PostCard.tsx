import { memo } from "react";

import { Pressable, Text, View } from "react-native";

import type { PostResponse } from "@/api/generated/model";
import {
  getAvatarBg,
  getInitials,
  getDisplayAuthorId,
  formatRelativeDate,
} from "@/utils/post-helpers";

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
      {/* Author row */}
      <View className="mb-2 flex-row items-center">
        <View
          className="h-[22px] w-[22px] items-center justify-center rounded-full"
          style={{ backgroundColor: getAvatarBg(post.authorId) }}
        >
          <Text className="text-[10px] font-bold text-white">{getInitials(post.authorId)}</Text>
        </View>
        <Text className="ml-2 text-xs font-medium text-neutral-500">
          {getDisplayAuthorId(post.authorId)}
        </Text>
        <Text className="mx-1.5 text-xs text-neutral-300">{"\u00B7"}</Text>
        <Text className="text-xs text-neutral-400">
          {formatRelativeDate(post.createdAt, { compact: true })}
        </Text>
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
