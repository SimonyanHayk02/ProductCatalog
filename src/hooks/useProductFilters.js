import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  filterProducts,
  sortProducts,
  getUniqueValues,
  getPriceRange,
} from "../utils/filterHelpers";
import { DEFAULT_FILTERS } from "../constants/filters";
import { useDebounce } from "./useDebounce";

export const useProductFilters = (products) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [filteredProducts, setFilteredProducts] = useState(products || []);
  const [isFiltering, setIsFiltering] = useState(false);

  const isInitialRender = useRef(true);

  const debouncedSearch = useDebounce(filters.search, 500);
  const debouncedMinPrice = useDebounce(filters.minPrice, 300);
  const debouncedMaxPrice = useDebounce(filters.maxPrice, 300);

  const filterOptions = useMemo(() => {
    if (!products || products.length === 0) {
      return {
        categories: [],
        brands: [],
        priceRange: { min: 0, max: 0 },
      };
    }

    return {
      categories: getUniqueValues(products, "category"),
      brands: getUniqueValues(products, "brand"),
      priceRange: getPriceRange(products),
    };
  }, [products]);

  const processedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    const filtersWithDebouncedValues = {
      ...filters,
      search: debouncedSearch,
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice,
    };

    const filtered = filterProducts(products, filtersWithDebouncedValues);
    const sorted = sortProducts(filtered, filters.sortBy);

    return sorted;
  }, [
    products,
    filters,
    debouncedSearch,
    debouncedMinPrice,
    debouncedMaxPrice,
  ]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      setFilteredProducts(processedProducts);
      return;
    }

    setIsFiltering(true);

    const rafId = requestAnimationFrame(() => {
      setFilteredProducts(processedProducts);

      setTimeout(() => {
        setIsFiltering(false);
      }, 0);
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [processedProducts, products]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => {
      if (prev[key] === value) return prev;

      return {
        ...prev,
        [key]: value,
      };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const isTyping = useMemo(() => {
    return (
      filters.search !== debouncedSearch ||
      filters.minPrice !== debouncedMinPrice ||
      filters.maxPrice !== debouncedMaxPrice
    );
  }, [
    filters.search,
    debouncedSearch,
    filters.minPrice,
    debouncedMinPrice,
    filters.maxPrice,
    debouncedMaxPrice,
  ]);

  const loadingState = useMemo(() => {
    return {
      isFiltering: isFiltering || isTyping,
      isTyping,
    };
  }, [isFiltering, isTyping]);

  return {
    filters,
    filteredProducts,
    filterOptions,
    handleFilterChange,
    clearFilters,
    ...loadingState,
  };
};
