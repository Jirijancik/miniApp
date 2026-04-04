import { Text, View } from "react-native";

import { Stack } from "expo-router";

import ErrorBoundary from "@/components/ErrorBoundary";
import PostDetail from "@/components/post/PostDetail";
import PostDetailSkeleton from "@/components/post/PostDetailSkeleton";
import Button from "@/components/ui/Button";
import { usePost } from "@/hooks/usePosts";

function ErrorFallback({ onReset }: { onReset: () => void }) {
  return (
    <View className="flex-1 items-center justify-center bg-feed px-6">
      <View className="w-full items-center rounded-xl bg-white px-6 py-10">
        <Text className="mb-2 text-lg font-semibold text-neutral-900">Something went wrong</Text>
        <Text className="mb-6 text-center text-sm text-neutral-500">
          The post could not be loaded. Please try again.
        </Text>
        <Button title="Try Again" onPress={onReset} />
      </View>
    </View>
  );
}

function PostDetailInner({ id }: { id: string }) {
  const { data, isLoading, isFetching, error } = usePost(id);

  if (isLoading || (!data && isFetching)) {
    return <PostDetailSkeleton />;
  }

  if (error || !data) {
    throw error ?? new Error("Post not found");
  }

  return (
    <>
      <Stack.Screen options={{ title: data.title }} />
      <PostDetail post={data} />
    </>
  );
}

interface PostDetailContentProps {
  id: string;
}

export default function PostDetailContent({ id }: PostDetailContentProps) {
  const { refetch } = usePost(id);

  return (
    <ErrorBoundary
      fallback={(reset) => <ErrorFallback onReset={reset} />}
      onReset={() => refetch()}
    >
      <PostDetailInner id={id} />
    </ErrorBoundary>
  );
}
