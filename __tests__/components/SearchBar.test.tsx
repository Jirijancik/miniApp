import { render, screen, fireEvent } from "@testing-library/react-native";

import SearchBar from "@/components/SearchBar";

// Mock @expo/vector-icons since it may not resolve in test env
jest.mock("@expo/vector-icons", () => {
  const { Text } = require("react-native");
  return {
    Ionicons: ({ name, ...props }: { name: string }) => (
      <Text {...props}>{name}</Text>
    ),
  };
});

describe("SearchBar", () => {
  it("renders text input with placeholder", () => {
    render(
      <SearchBar value="" onChangeText={jest.fn()} onClear={jest.fn()} />,
    );

    expect(screen.getByPlaceholderText("Search")).toBeOnTheScreen();
  });

  it("calls onChangeText when typing", () => {
    const onChangeText = jest.fn();
    render(
      <SearchBar value="" onChangeText={onChangeText} onClear={jest.fn()} />,
    );

    fireEvent.changeText(
      screen.getByPlaceholderText("Search"),
      "hello",
    );
    expect(onChangeText).toHaveBeenCalledWith("hello");
  });

  it("does not show clear button when value is empty", () => {
    render(
      <SearchBar value="" onChangeText={jest.fn()} onClear={jest.fn()} />,
    );

    // close-circle icon text should not be present
    expect(screen.queryByText("close-circle")).toBeNull();
  });

  it("shows clear button and calls onClear when pressed", () => {
    const onClear = jest.fn();
    render(
      <SearchBar value="test" onChangeText={jest.fn()} onClear={onClear} />,
    );

    const clearButton = screen.getByText("close-circle");
    expect(clearButton).toBeOnTheScreen();

    fireEvent.press(clearButton);
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
