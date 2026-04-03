import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import {
  createPostSchema,
  type CreatePostFormData,
} from "@/utils/validation";
import {
  useCreatePost,
  getPostsControllerGetAllPostsQueryKey,
  getPostsControllerUserPostsQueryKey,
} from "@/hooks/usePosts";
import { useUserId } from "@/hooks/useAuth";
import { showSuccessToast } from "@/utils/toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function CreatePostScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = useUserId();
  const mutation = useCreatePost();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { title: "", content: "" },
  });

  const onSubmit = (formData: CreatePostFormData) => {
    mutation.mutate(
      { data: { title: formData.title, content: formData.content } },
      {
        onSuccess: () => {
          showSuccessToast("Post created successfully!");
          reset();
          queryClient.invalidateQueries({
            queryKey: getPostsControllerGetAllPostsQueryKey(),
          });
          if (userId) {
            queryClient.invalidateQueries({
              queryKey: getPostsControllerUserPostsQueryKey(userId),
            });
          }
          router.navigate("/(app)/(home)");
        },
      },
    );
  };

  return (
    <ErrorBoundary>
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerClassName="px-6 py-8"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900">
              Create a New Post
            </Text>
            <Text className="mt-1 text-sm text-gray-500">
              Share your thoughts with the community
            </Text>
          </View>

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Title"
                placeholder="Enter a title..."
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.title?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="content"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Content"
                placeholder="Write your post content..."
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                style={{ minHeight: 120 }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.content?.message}
              />
            )}
          />

          <View className="mt-2">
            <Button
              title="Publish"
              onPress={handleSubmit(onSubmit)}
              isLoading={mutation.isPending}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ErrorBoundary>
  );
}
