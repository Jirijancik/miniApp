import { useMemo } from "react";

import type { PostResponse } from "@/api/generated/model";
import {
  usePostsControllerGetAllPosts,
  usePostsControllerUserPosts,
  usePostsControllerPost,
  usePostsControllerCreate,
  getPostsControllerGetAllPostsQueryKey,
  getPostsControllerUserPostsQueryKey,
} from "@/api/generated/posts/posts";

// Re-export query key generators for cache invalidation
export { getPostsControllerGetAllPostsQueryKey, getPostsControllerUserPostsQueryKey };

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

// Pre-compute lowercase fields once when posts change, not on every search.
// Sort newest-first so recently created posts appear at the top of the feed.
function useSearchIndex(posts: PostResponse[] | undefined) {
  return useMemo(() => {
    if (!posts) return [];
    return [...posts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((p) => ({
        post: p,
        titleLower: p.title.toLowerCase(),
        contentLower: p.content.toLowerCase(),
      }));
  }, [posts]);
}

// Client-side filtering over cached posts
export function useFilteredPosts(searchQuery: string) {
  const { data: posts, ...rest } = useAllPosts();
  const index = useSearchIndex(posts);

  const filtered = useMemo(() => {
    if (index.length === 0) return [];
    if (!searchQuery) return index.map((entry) => entry.post);
    const q = searchQuery.toLowerCase();
    return index
      .filter((entry) => entry.titleLower.includes(q) || entry.contentLower.includes(q))
      .map((entry) => entry.post);
  }, [index, searchQuery]);

  return { data: filtered, ...rest };
}
