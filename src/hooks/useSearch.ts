import { useCallback, useEffect, useRef, useState } from "react";

interface UseSearchReturn {
  searchQuery: string;
  debouncedQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

export default function useSearch(delay = 300): UseSearchReturn {
  const [searchQuery, setLocalQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setSearchQuery = useCallback(
    (query: string) => {
      setLocalQuery(query);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setDebouncedQuery(query);
      }, delay);
    },
    [delay],
  );

  const clearSearch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLocalQuery("");
    setDebouncedQuery("");
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { searchQuery, debouncedQuery, setSearchQuery, clearSearch };
}
