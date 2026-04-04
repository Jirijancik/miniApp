import { ScrollView, Text, View } from "react-native";

import type { PostResponse } from "@/api/generated/model";
import PostAuthorHeader from "@/components/post/PostAuthorHeader";
import { formatRelativeDate } from "@/utils/post-helpers";

interface PostDetailProps {
  post: PostResponse;
}

export default function PostDetail({ post }: PostDetailProps) {
  return (
    <ScrollView className="flex-1 bg-feed" contentContainerClassName="px-3 pt-3 pb-8">
      <View className="overflow-hidden rounded-xl bg-white p-4">
        <PostAuthorHeader authorId={post.authorId} createdAt={post.createdAt} />

        {/* Title */}
        <Text className="mt-4 text-xl font-bold leading-7 text-neutral-950">{post.title}</Text>

        {/* Divider */}
        <View className="my-4 h-px bg-neutral-200" />

        {/* Content */}
        <Text className="text-[15px] leading-6 text-neutral-700">{post.content}</Text>

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
