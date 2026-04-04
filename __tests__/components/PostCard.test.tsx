import { render, screen, fireEvent } from "@testing-library/react-native";

import PostCard from "@/components/post/PostCard";
import type { PostResponse } from "@/api/generated/model";

const mockPost: PostResponse = {
  id: "post-1",
  createdAt: "2026-01-15T10:00:00.000Z",
  updatedAt: "2026-01-15T10:00:00.000Z",
  title: "Test Post Title",
  content: "This is test content for the post card component",
  published: true,
  authorId: "user-abc-123-def",
};

describe("PostCard", () => {
  it("renders title and content", () => {
    render(<PostCard post={mockPost} onPress={jest.fn()} />);

    expect(screen.getByText("Test Post Title")).toBeOnTheScreen();
    expect(
      screen.getByText("This is test content for the post card component"),
    ).toBeOnTheScreen();
  });

  it("renders author ID preview", () => {
    render(<PostCard post={mockPost} onPress={jest.fn()} />);

    // authorId.slice(0, 8)
    expect(screen.getByText("user-abc")).toBeOnTheScreen();
  });

  it("renders relative date", () => {
    render(<PostCard post={mockPost} onPress={jest.fn()} />);

    // formatRelativeDate returns compact time like "3d", "5m", "now", "Jan 15"
    expect(screen.getByText(/\d+[mhdw]|now|Jan/i)).toBeOnTheScreen();
  });

  it("calls onPress with post id when pressed", () => {
    const onPress = jest.fn();
    render(<PostCard post={mockPost} onPress={onPress} />);

    fireEvent.press(screen.getByText("Test Post Title"));
    expect(onPress).toHaveBeenCalledWith("post-1");
  });
});
