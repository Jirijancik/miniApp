import { Pressable, Text, View } from "react-native";

import type { PostResponse } from "@/api/generated/model";

interface PostCardProps {
  post: PostResponse;
  onPress: () => void;
}

export default function PostCard({ post, onPress }: PostCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 rounded-xl border border-gray-100 bg-white p-4 active:opacity-80"
    >
      <Text
        className="text-lg font-semibold text-gray-900"
        numberOfLines={1}
      >
        {post.title}
      </Text>

      <Text
        className="mt-1 text-sm text-gray-600"
        numberOfLines={2}
      >
        {post.content}
      </Text>

      <View className="mt-3 flex-row justify-between">
        <Text className="text-xs text-gray-400">
          {new Date(post.createdAt).toLocaleDateString()}
        </Text>
        <Text className="text-xs text-gray-400">
          {post.authorId.slice(0, 8)}
        </Text>
      </View>
    </Pressable>
  );
}
