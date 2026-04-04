import { useCallback } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";

import { useFilteredPosts } from "@/hooks/usePosts";
import useSearch from "@/hooks/useSearch";
import SearchBar from "@/components/SearchBar";
import PostList from "@/components/post/PostList";

export default function FeedContent() {
  const router = useRouter();
  const { searchQuery, debouncedQuery, setSearchQuery, clearSearch } =
    useSearch();
  const { data, isLoading, isRefetching, error, refetch } =
    useFilteredPosts(debouncedQuery);

  const handlePostPress = useCallback(
    (postId: string) => {
      router.push(`/(app)/(home)/post/${postId}`);
    },
    [router],
  );

  return (
    <View className="flex-1 bg-[#DAE0E6]">
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={clearSearch}
      />
      <PostList
        posts={data}
        isLoading={isLoading}
        isRefetching={isRefetching}
        onRefresh={refetch}
        onPostPress={handlePostPress}
        emptyMessage={
          error
            ? "Failed to load posts. Pull to refresh."
            : debouncedQuery
              ? `No results for "${debouncedQuery}"`
              : "No posts yet. Be the first to share something!"
        }
      />
    </View>
  );
}
