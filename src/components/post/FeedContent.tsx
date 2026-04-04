import { View } from "react-native";

import PostList from "@/components/post/PostList";
import SearchBar from "@/components/SearchBar";
import { usePostNavigation } from "@/hooks/usePostNavigation";
import { useFilteredPosts } from "@/hooks/usePosts";
import { useSearch } from "@/hooks/useSearch";

export default function FeedContent() {
  const { navigateToPost } = usePostNavigation();
  const { searchQuery, debouncedQuery, setSearchQuery, clearSearch } = useSearch();
  const { data, isLoading, isRefetching, error, refetch } = useFilteredPosts(debouncedQuery);

  return (
    <View className="flex-1 bg-feed">
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} onClear={clearSearch} />
      <PostList
        posts={data}
        isLoading={isLoading}
        isRefetching={isRefetching}
        isError={!!error}
        onRefresh={refetch}
        onPostPress={navigateToPost}
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
