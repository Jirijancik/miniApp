import { ScrollView, Text, View } from "react-native";

import type { PostResponse } from "@/api/generated/model";
import {
  getAvatarBg,
  getInitials,
  formatRelativeDate,
} from "@/utils/post-helpers";

interface PostDetailProps {
  post: PostResponse;
}

export default function PostDetail({ post }: PostDetailProps) {
  return (
    <ScrollView
      className="flex-1 bg-[#DAE0E6]"
      contentContainerClassName="px-3 pt-3 pb-8"
    >
      <View className="overflow-hidden rounded-xl bg-white p-4">
        {/* Author header */}
        <View className="flex-row items-center">
          <View
            className="h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: getAvatarBg(post.authorId) }}
          >
            <Text className="text-xs font-bold text-white">
              {getInitials(post.authorId)}
            </Text>
          </View>
          <View className="ml-2.5">
            <Text className="text-sm font-semibold text-neutral-800">
              {post.authorId.slice(0, 8)}
            </Text>
            <Text className="mt-0.5 text-xs text-neutral-400">
              {formatRelativeDate(post.createdAt)}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text className="mt-4 text-xl font-bold leading-7 text-neutral-950">
          {post.title}
        </Text>

        {/* Divider */}
        <View className="my-4 h-px bg-neutral-200" />

        {/* Content */}
        <Text className="text-[15px] leading-6 text-neutral-700">
          {post.content}
        </Text>

        {/* Updated badge */}
        {post.updatedAt !== post.createdAt && (
          <View className="mt-5 self-start rounded-full bg-neutral-100 px-3 py-1">
            <Text className="text-xs text-neutral-400">
              Edited {formatRelativeDate(post.updatedAt)}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
