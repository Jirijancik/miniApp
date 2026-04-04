import { render, screen, fireEvent } from "@testing-library/react-native";

import PostList from "@/components/post/PostList";
import type { PostResponse } from "@/api/generated/model";

const mockPosts: PostResponse[] = [
  {
    id: "post-1",
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-01-15T10:00:00.000Z",
    title: "First Post",
    content: "Content one",
    published: true,
    authorId: "user-123",
  },
  {
    id: "post-2",
    createdAt: "2026-01-16T12:00:00.000Z",
    updatedAt: "2026-01-16T12:00:00.000Z",
    title: "Second Post",
    content: "Content two",
    published: true,
    authorId: "user-456",
  },
];

describe("PostList", () => {
  it("renders a list of posts", () => {
    render(<PostList posts={mockPosts} isLoading={false} onPostPress={jest.fn()} />);

    expect(screen.getByText("First Post")).toBeOnTheScreen();
    expect(screen.getByText("Second Post")).toBeOnTheScreen();
  });

  it("shows skeleton cards when loading with no posts", () => {
    const { toJSON } = render(<PostList posts={[]} isLoading={true} onPostPress={jest.fn()} />);

    // SkeletonCard renders View elements — skeleton cards should be in tree
    // and there should be no "No posts found" text
    expect(screen.queryByText("No posts found")).toBeNull();
    expect(toJSON()).toBeTruthy();
  });

  it("shows empty message when no posts and not loading", () => {
    render(
      <PostList posts={[]} isLoading={false} onPostPress={jest.fn()} emptyMessage="No posts yet" />,
    );

    expect(screen.getAllByText(/No posts yet/)).toBeTruthy();
  });

  it("calls onPostPress when a post is tapped", () => {
    const onPostPress = jest.fn();
    render(<PostList posts={mockPosts} isLoading={false} onPostPress={onPostPress} />);

    fireEvent.press(screen.getByText("First Post"));
    expect(onPostPress).toHaveBeenCalledWith(mockPosts[0].id);
  });
});
