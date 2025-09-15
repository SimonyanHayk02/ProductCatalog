import { useEffect, useRef } from "react";
import {
  parseUrlParams,
  updateUrlParams,
  clearUrlParams,
} from "../utils/urlParams";
import { useDebounce } from "./useDebounce";

export const useUrlSync = (filters, setFilters, clearFilters) => {
  const isInitialLoad = useRef(true);
  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    if (isInitialLoad.current) {
      const urlFilters = parseUrlParams();

      const hasUrlParams = Object.entries(urlFilters).some(([key, value]) => {
        if (key === "sortBy") return value !== "name";
        return value && value !== "";
      });

      if (hasUrlParams) {
        setFilters(urlFilters);
      }

      isInitialLoad.current = false;
    }
  }, [setFilters]);

  useEffect(() => {
    if (!isInitialLoad.current) {
      updateUrlParams(debouncedFilters, true);
    }
  }, [debouncedFilters]);

  useEffect(() => {
    const handlePopState = () => {
      const urlFilters = parseUrlParams();
      setFilters(urlFilters);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [setFilters]);

  const clearFiltersAndUrl = () => {
    clearFilters();
    clearUrlParams();
  };

  return {
    clearFiltersAndUrl,
  };
};
