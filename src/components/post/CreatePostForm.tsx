import { useRef } from "react";

import { Text, type TextInput, View } from "react-native";

import { useRouter } from "expo-router";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useUserId } from "@/hooks/useAuth";
import {
  useCreatePost,
  getPostsControllerGetAllPostsQueryKey,
  getPostsControllerUserPostsQueryKey,
} from "@/hooks/usePosts";
import { showSuccessToast } from "@/utils/toast";
import { createPostSchema, type CreatePostFormData } from "@/utils/validation";

interface CreatePostFormProps {
  onSuccess?: () => void;
}

export default function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = useUserId();
  const mutation = useCreatePost();
  const contentRef = useRef<TextInput>(null);

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
          onSuccess?.();
        },
      },
    );
  };

  return (
    <BottomSheetScrollView
      contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-900">Create a New Post</Text>
        <Text className="mt-1 text-sm text-gray-500">Share your thoughts with the community</Text>
      </View>

      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Title"
            placeholder="Enter a title..."
            returnKeyType="next"
            onSubmitEditing={() => contentRef.current?.focus()}
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
            ref={contentRef}
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
        <Button title="Publish" onPress={handleSubmit(onSubmit)} isLoading={mutation.isPending} />
      </View>
    </BottomSheetScrollView>
  );
}
