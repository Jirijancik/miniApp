import { renderHook, act } from "@testing-library/react-native";

import useSearch from "@/hooks/useSearch";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("useSearch", () => {
  it("starts with empty searchQuery and debouncedQuery", () => {
    const { result } = renderHook(() => useSearch());

    expect(result.current.searchQuery).toBe("");
    expect(result.current.debouncedQuery).toBe("");
  });

  it("updates searchQuery immediately", () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchQuery("hello");
    });

    expect(result.current.searchQuery).toBe("hello");
    expect(result.current.debouncedQuery).toBe("");
  });

  it("updates debouncedQuery after delay", () => {
    const { result } = renderHook(() => useSearch(300));

    act(() => {
      result.current.setSearchQuery("hello");
    });

    expect(result.current.debouncedQuery).toBe("");

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.debouncedQuery).toBe("hello");
  });

  it("resets both values on clearSearch", () => {
    const { result } = renderHook(() => useSearch(300));

    act(() => {
      result.current.setSearchQuery("hello");
      jest.advanceTimersByTime(300);
    });

    expect(result.current.searchQuery).toBe("hello");
    expect(result.current.debouncedQuery).toBe("hello");

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.searchQuery).toBe("");
    expect(result.current.debouncedQuery).toBe("");
  });
});
