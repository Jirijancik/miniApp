import { Text, View } from "react-native";
import { useRouter } from "expo-router";

import type { PostResponse } from "@/api/generated/model";
import { useUserPosts } from "@/hooks/usePosts";
import { useUserId } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/auth-store";
import PostList from "@/components/PostList";
import Button from "@/components/ui/Button";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function ProfileScreen() {
  const router = useRouter();
  const userId = useUserId();
  const { data, isLoading, isRefetching, error, refetch } = useUserPosts(
    userId ?? "",
  );

  const handlePostPress = (post: PostResponse) => {
    router.push(`/(app)/(home)/post/${post.id}`);
  };

  const handleLogout = () => {
    useAuthStore.getState().logout();
  };

  return (
    <ErrorBoundary>
      <View className="flex-1 bg-white">
        <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
          <Text className="text-xl font-bold text-gray-900">My Posts</Text>
          <Button
            title="Logout"
            variant="secondary"
            onPress={handleLogout}
          />
        </View>
        <PostList
          posts={data ?? []}
          isLoading={isLoading}
          isRefetching={isRefetching}
          onRefresh={refetch}
          onPostPress={handlePostPress}
          emptyMessage={
            error
              ? "Failed to load posts. Pull to refresh."
              : "You haven't posted yet"
          }
        />
      </View>
    </ErrorBoundary>
  );
}
