import { ScrollView, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import { usePost } from "@/hooks/usePosts";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import ErrorBoundary from "@/components/ErrorBoundary";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error, refetch } = usePost(id ?? "");

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: "Post" }} />
        <Spinner label="Loading post..." />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Stack.Screen options={{ title: "Post" }} />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-2 text-lg font-semibold text-gray-900">
            Failed to load post
          </Text>
          <Text className="mb-6 text-center text-sm text-gray-500">
            The post could not be loaded. Please try again.
          </Text>
          <Button title="Try Again" onPress={() => refetch()} />
        </View>
      </>
    );
  }

  return (
    <ErrorBoundary>
      <Stack.Screen options={{ title: data.title }} />
      <ScrollView
        className="flex-1 bg-white"
        contentContainerClassName="p-4"
      >
        <Text className="text-2xl font-bold text-gray-900">{data.title}</Text>

        <View className="mt-3 flex-row justify-between">
          <Text className="text-sm text-gray-400">
            {formatDate(data.createdAt)}
          </Text>
          <Text className="text-sm text-gray-400">
            {data.authorId.slice(0, 8)}
          </Text>
        </View>

        <View className="my-4 h-px bg-gray-200" />

        <Text className="text-base leading-6 text-gray-700">
          {data.content}
        </Text>

        {data.updatedAt !== data.createdAt && (
          <Text className="mt-6 text-xs text-gray-400">
            Updated {formatDate(data.updatedAt)}
          </Text>
        )}
      </ScrollView>
    </ErrorBoundary>
  );
}
