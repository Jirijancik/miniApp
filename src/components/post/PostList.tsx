import { memo, useCallback } from "react";

import { Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

import type { PostResponse } from "@/api/generated/model";
import PostCard from "@/components/post/PostCard";
import SkeletonCard, { SkeletonProvider } from "@/components/ui/SkeletonCard";

interface PostListProps {
  posts: PostResponse[];
  isLoading: boolean;
  isRefetching?: boolean;
  isError?: boolean;
  onRefresh?: () => void;
  onPostPress: (postId: string) => void;
  emptyMessage?: string;
}

const SKELETON_DATA = Array.from({ length: 6 }, (_, i) => i);
const SKELETON_CONTENT_PADDING = { paddingTop: 8 };

function EmptyState({ message, isError = false }: { message: string; isError?: boolean }) {
  return (
    <View className="flex-1 items-center justify-center px-8 pb-16">
      <Ionicons
        name={isError ? "cloud-offline-outline" : "chatbubbles-outline"}
        size={48}
        color="#d4d4d4"
      />
      <Text className="mt-4 text-base font-semibold text-black">
        {isError ? "Something went wrong" : "No posts yet"}
      </Text>
      <Text className="mt-1 text-center text-sm leading-relaxed text-neutral-400">{message}</Text>
    </View>
  );
}

const skeletonKeyExtractor = (item: number) => `skeleton-${item}`;
const skeletonRenderItem = () => <SkeletonCard />;

const postKeyExtractor = (item: PostResponse) => item.id;

function PostList({
  posts,
  isLoading,
  isRefetching = false,
  isError = false,
  onRefresh,
  onPostPress,
  emptyMessage = "No posts found",
}: PostListProps) {
  const renderItem = useCallback(
    ({ item }: { item: PostResponse }) => <PostCard post={item} onPress={onPostPress} />,
    [onPostPress],
  );

  if (isLoading) {
    return (
      <SkeletonProvider>
        <FlashList
          data={SKELETON_DATA}
          keyExtractor={skeletonKeyExtractor}
          renderItem={skeletonRenderItem}
          contentContainerStyle={SKELETON_CONTENT_PADDING}
        />
      </SkeletonProvider>
    );
  }

  if (posts.length === 0) {
    return <EmptyState message={emptyMessage} isError={isError} />;
  }

  return (
    <FlashList
      data={posts}
      keyExtractor={postKeyExtractor}
      renderItem={renderItem}
      refreshing={isRefetching}
      onRefresh={onRefresh}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={SKELETON_CONTENT_PADDING}
    />
  );
}

export default memo(PostList);
