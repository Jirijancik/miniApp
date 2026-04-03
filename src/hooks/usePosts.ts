import { useMemo } from "react";

import {
  usePostsControllerGetAllPosts,
  usePostsControllerUserPosts,
  usePostsControllerPost,
  usePostsControllerCreate,
  getPostsControllerGetAllPostsQueryKey,
  getPostsControllerUserPostsQueryKey,
} from "@/api/generated/posts/posts";

// Re-export query key generators for cache invalidation
export {
  getPostsControllerGetAllPostsQueryKey,
  getPostsControllerUserPostsQueryKey,
};

// Convenience wrappers around Orval-generated React Query hooks
export const useAllPosts = () => usePostsControllerGetAllPosts();

export const useUserPosts = (userId: string) =>
  usePostsControllerUserPosts(userId, {
    query: { enabled: !!userId },
  });

export const usePost = (postId: string) =>
  usePostsControllerPost(postId, {
    query: { enabled: !!postId },
  });

export const useCreatePost = () => usePostsControllerCreate();

// Client-side filtering over cached posts
export function useFilteredPosts(searchQuery: string) {
  const { data: posts, ...rest } = useAllPosts();

  const filtered = useMemo(() => {
    if (!posts) return [];
    if (!searchQuery) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q),
    );
  }, [posts, searchQuery]);

  return { data: filtered, ...rest };
}
