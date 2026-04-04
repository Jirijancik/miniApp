import { FlatList, Text, View } from "react-native";

import type { PostResponse } from "@/api/generated/model";
import PostCard from "@/components/PostCard";
import SkeletonCard from "@/components/ui/SkeletonCard";

interface PostListProps {
  posts: PostResponse[];
  isLoading: boolean;
  isRefetching?: boolean;
  onRefresh?: () => void;
  onPostPress: (post: PostResponse) => void;
  emptyMessage?: string;
}

export default function PostList({
  posts,
  isLoading,
  isRefetching = false,
  onRefresh,
  onPostPress,
  emptyMessage = "No posts found",
}: PostListProps) {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PostCard post={item} onPress={() => onPostPress(item)} />
      )}
      refreshing={isRefetching}
      onRefresh={onRefresh}
      contentContainerStyle={
        posts.length === 0 && !isLoading ? { flexGrow: 1 } : { paddingHorizontal: 16, paddingTop: 8 }
      }
      ListEmptyComponent={
        isLoading ? (
          <View className="px-4 pt-2">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-base text-gray-400">{emptyMessage}</Text>
          </View>
        )
      }
    />
  );
}
