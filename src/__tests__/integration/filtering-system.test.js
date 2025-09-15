import { renderHook, act } from "@testing-library/react";
import { useProductFilters } from "../../hooks/useProductFilters";
import { filterProducts, sortProducts } from "../../utils/filterHelpers";

jest.mock("../../utils/filterHelpers", () => ({
  filterProducts: jest.fn(),
  sortProducts: jest.fn(),
  getUniqueValues: jest.fn(),
  getPriceRange: jest.fn(),
}));

jest.mock("../../hooks/useDebounce", () => ({
  useDebounce: jest.fn((value) => value),
}));

const mockProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    brand: "Brand A",
    price: 99.99,
    rating: 4.5,
  },
  {
    id: 2,
    name: "Bluetooth Speaker",
    category: "Electronics",
    brand: "Brand B",
    price: 49.99,
    rating: 4.0,
  },
  {
    id: 3,
    name: "Running Shoes",
    category: "Footwear",
    brand: "Brand C",
    price: 59.99,
    rating: 4.2,
  },
  {
    id: 4,
    name: "Smartphone",
    category: "Electronics",
    brand: "Brand D",
    price: 499.99,
    rating: 4.8,
  },
  {
    id: 5,
    name: "Leather Jacket",
    category: "Clothing",
    brand: "Brand E",
    price: 199.99,
    rating: 4.7,
  },
];

describe("Filtering System Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    filterProducts.mockImplementation((products, filters) => {
      let filtered = [...products];

      if (filters.search) {
        filtered = filtered.filter((product) =>
          product.name.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      if (filters.category) {
        filtered = filtered.filter(
          (product) => product.category === filters.category
        );
      }

      if (filters.brand) {
        filtered = filtered.filter(
          (product) => product.brand === filters.brand
        );
      }

      if (filters.minPrice) {
        filtered = filtered.filter(
          (product) => product.price >= parseFloat(filters.minPrice)
        );
      }

      if (filters.maxPrice) {
        filtered = filtered.filter(
          (product) => product.price <= parseFloat(filters.maxPrice)
        );
      }

      if (filters.minRating) {
        filtered = filtered.filter(
          (product) => product.rating >= parseFloat(filters.minRating)
        );
      }

      return filtered;
    });

    sortProducts.mockImplementation((products, sortBy) => {
      const sorted = [...products];

      switch (sortBy) {
        case "name":
          return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case "price-low":
          return sorted.sort((a, b) => a.price - b.price);
        case "price-high":
          return sorted.sort((a, b) => b.price - a.price);
        case "rating":
          return sorted.sort((a, b) => b.rating - a.rating);
        default:
          return sorted;
      }
    });
  });

  describe("Filter and Sort Integration", () => {
    it("should apply filtering before sorting", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
        result.current.handleFilterChange("sortBy", "price-low");
      });

      expect(filterProducts).toHaveBeenCalledWith(
        mockProducts,
        expect.objectContaining({
          category: "Electronics",
          sortBy: "price-low",
        })
      );

      expect(sortProducts).toHaveBeenCalledWith(expect.any(Array), "price-low");
    });

    it("should maintain filter state when changing sort", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
        result.current.handleFilterChange("brand", "Brand A");
      });

      act(() => {
        result.current.handleFilterChange("sortBy", "rating");
      });

      expect(result.current.filters).toEqual({
        category: "Electronics",
        brand: "Brand A",
        minPrice: "",
        maxPrice: "",
        minRating: "",
        search: "",
        sortBy: "rating",
      });
    });

    it("should maintain sort state when changing filters", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("sortBy", "price-high");
      });

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
      });

      expect(result.current.filters).toEqual({
        category: "Electronics",
        brand: "",
        minPrice: "",
        maxPrice: "",
        minRating: "",
        search: "",
        sortBy: "price-high",
      });
    });
  });

  describe("Complex Filter Scenarios", () => {
    it("should handle multiple filters with sorting", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
        result.current.handleFilterChange("minPrice", "50");
        result.current.handleFilterChange("maxPrice", "200");
        result.current.handleFilterChange("sortBy", "rating");
      });

      expect(result.current.filters).toEqual({
        category: "Electronics",
        brand: "",
        minPrice: "50",
        maxPrice: "200",
        minRating: "",
        search: "",
        sortBy: "rating",
      });
    });

    it("should handle search with other filters and sorting", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("search", "wireless");
        result.current.handleFilterChange("minRating", "4.5");
        result.current.handleFilterChange("sortBy", "name");
      });

      expect(result.current.filters).toEqual({
        category: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        minRating: "4.5",
        search: "wireless",
        sortBy: "name",
      });
    });

    it("should clear all filters and maintain sort", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
        result.current.handleFilterChange("brand", "Brand A");
        result.current.handleFilterChange("sortBy", "price-low");
      });

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.filters).toEqual({
        category: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        minRating: "",
        search: "",
        sortBy: "name",
      });
    });
  });

  describe("Performance and State Management", () => {
    it("should not trigger unnecessary re-renders", () => {
      const { result, rerender } = renderHook(() =>
        useProductFilters(mockProducts)
      );

      const initialRender = result.current;

      rerender();

      expect(result.current.filters).toBe(initialRender.filters);
    });

    it("should handle rapid filter changes", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
        result.current.handleFilterChange("brand", "Brand A");
        result.current.handleFilterChange("minPrice", "50");
        result.current.handleFilterChange("maxPrice", "200");
        result.current.handleFilterChange("sortBy", "rating");
      });

      expect(result.current.filters).toEqual({
        category: "Electronics",
        brand: "Brand A",
        minPrice: "50",
        maxPrice: "200",
        minRating: "",
        search: "",
        sortBy: "rating",
      });
    });

    it("should handle empty products array", () => {
      const { result } = renderHook(() => useProductFilters([]));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
        result.current.handleFilterChange("sortBy", "price-low");
      });

      expect(result.current.filteredProducts).toEqual([]);
      expect(result.current.filters).toEqual({
        category: "Electronics",
        brand: "",
        minPrice: "",
        maxPrice: "",
        minRating: "",
        search: "",
        sortBy: "price-low",
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle invalid sort values", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("sortBy", "invalid-sort");
      });

      expect(result.current.filters.sortBy).toBe("invalid-sort");
    });

    it("should handle special characters in search", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("search", "wireless@#$%");
      });

      expect(result.current.filters.search).toBe("wireless@#$%");
    });

    it("should handle numeric filter values as strings", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("minPrice", "100");
        result.current.handleFilterChange("maxPrice", "500");
        result.current.handleFilterChange("minRating", "4.5");
      });

      expect(result.current.filters.minPrice).toBe("100");
      expect(result.current.filters.maxPrice).toBe("500");
      expect(result.current.filters.minRating).toBe("4.5");
    });
  });
});
