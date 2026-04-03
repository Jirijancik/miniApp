import { View } from "react-native";
import { useRouter } from "expo-router";

import type { PostResponse } from "@/api/generated/model";
import { useFilteredPosts } from "@/hooks/usePosts";
import useSearch from "@/hooks/useSearch";
import SearchBar from "@/components/SearchBar";
import PostList from "@/components/PostList";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function FeedScreen() {
  const router = useRouter();
  const { searchQuery, debouncedQuery, setSearchQuery, clearSearch } =
    useSearch();
  const { data, isLoading, isRefetching, error, refetch } =
    useFilteredPosts(debouncedQuery);

  const handlePostPress = (post: PostResponse) => {
    router.push(`/(app)/(home)/post/${post.id}`);
  };

  return (
    <ErrorBoundary>
      <View className="flex-1 bg-white">
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
              : "No posts found"
          }
        />
      </View>
    </ErrorBoundary>
  );
}
