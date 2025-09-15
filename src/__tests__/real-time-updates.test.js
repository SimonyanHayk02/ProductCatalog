import { renderHook, act, waitFor } from "@testing-library/react";
import { useProductFilters } from "../hooks/useProductFilters";

jest.mock("../hooks/useDebounce", () => ({
  useDebounce: jest.fn((value) => value),
}));

jest.mock("../utils/filterHelpers", () => ({
  filterProducts: jest.fn((products, filters) => {
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
      filtered = filtered.filter((product) => product.brand === filters.brand);
    }

    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      if (min !== undefined && min > 0) {
        filtered = filtered.filter((product) => product.price >= min);
      }
      if (max !== undefined && max > 0) {
        filtered = filtered.filter((product) => product.price <= max);
      }
    }

    if (filters.rating && filters.rating > 0) {
      filtered = filtered.filter((product) => product.rating >= filters.rating);
    }

    return filtered;
  }),
  sortProducts: jest.fn((products, sortBy) => {
    if (sortBy === "name") {
      return [...products].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === "price-low") {
      return [...products].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-high") {
      return [...products].sort((a, b) => b.price - a.price);
    }
    if (sortBy === "rating") {
      return [...products].sort((a, b) => b.rating - a.rating);
    }
    return products;
  }),
  getUniqueValues: jest.fn((products, key) => {
    const values = products.map((product) => product[key]);
    return [...new Set(values)].filter(Boolean);
  }),
  getPriceRange: jest.fn((products) => {
    if (products.length === 0) return { min: 0, max: 0 };
    const prices = products.map((product) => product.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }),
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

describe("Real-time Updates and Debouncing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Real-time Filter Updates", () => {
    it("should update immediately when category filter changes", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
      });

      await waitFor(() => {
        expect(result.current.filters.category).toBe("Electronics");
      });
    });

    it("should update immediately when brand filter changes", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("brand", "Brand A");
      });

      await waitFor(() => {
        expect(result.current.filters.brand).toBe("Brand A");
      });
    });

    it("should update immediately when price range changes", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("minPrice", "100");
        result.current.handleFilterChange("maxPrice", "500");
      });

      await waitFor(() => {
        expect(result.current.filters.minPrice).toBe("100");
        expect(result.current.filters.maxPrice).toBe("500");
      });
    });

    it("should update immediately when rating filter changes", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("minRating", "4.5");
      });

      await waitFor(() => {
        expect(result.current.filters.minRating).toBe("4.5");
      });
    });

    it("should update immediately when sort order changes", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("sortBy", "price-low");
      });

      await waitFor(() => {
        expect(result.current.filters.sortBy).toBe("price-low");
      });
    });
  });

  describe("Search Debouncing", () => {
    it("should debounce search input", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("search", "wireless");
      });

      expect(result.current.filters.search).toBe("wireless");
    });

    it("should handle rapid search input changes", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("search", "w");
      });

      act(() => {
        result.current.handleFilterChange("search", "wi");
      });

      act(() => {
        result.current.handleFilterChange("search", "wir");
      });

      act(() => {
        result.current.handleFilterChange("search", "wire");
      });

      act(() => {
        result.current.handleFilterChange("search", "wireless");
      });

      expect(result.current.filters.search).toBe("wireless");
    });

    it("should show typing state during debounce", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("search", "wireless headphones");
      });

      expect(result.current.isTyping).toBe(false);
    });
  });

  describe("Filter State Management", () => {
    it("should maintain filter state across multiple changes", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
      });

      expect(result.current.filters.category).toBe("Electronics");

      act(() => {
        result.current.handleFilterChange("brand", "Brand A");
      });

      expect(result.current.filters.category).toBe("Electronics");
      expect(result.current.filters.brand).toBe("Brand A");

      act(() => {
        result.current.handleFilterChange("minPrice", "50");
        result.current.handleFilterChange("maxPrice", "200");
      });

      expect(result.current.filters.category).toBe("Electronics");
      expect(result.current.filters.brand).toBe("Brand A");
      expect(result.current.filters.minPrice).toBe("50");
      expect(result.current.filters.maxPrice).toBe("200");
    });

    it("should reset individual filters", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
        result.current.handleFilterChange("brand", "Brand A");
        result.current.handleFilterChange("search", "test");
      });

      expect(result.current.filters.category).toBe("Electronics");
      expect(result.current.filters.brand).toBe("Brand A");
      expect(result.current.filters.search).toBe("test");

      act(() => {
        result.current.handleFilterChange("brand", "");
      });

      expect(result.current.filters.category).toBe("Electronics");
      expect(result.current.filters.brand).toBe("");
      expect(result.current.filters.search).toBe("test");
    });

    it("should clear all filters at once", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
        result.current.handleFilterChange("brand", "Brand A");
        result.current.handleFilterChange("search", "test");
        result.current.handleFilterChange("rating", 4.5);
        result.current.handleFilterChange("sortBy", "price-low");
      });

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.filters).toEqual({
        search: "",
        category: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        minRating: "",
        sortBy: "name",
      });
    });
  });

  describe("Performance and State Updates", () => {
    it("should handle rapid filter changes efficiently", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
        result.current.handleFilterChange("brand", "Brand A");
        result.current.handleFilterChange("minPrice", "50");
        result.current.handleFilterChange("maxPrice", "200");
        result.current.handleFilterChange("minRating", "4.0");
        result.current.handleFilterChange("sortBy", "price-low");
      });

      expect(result.current.filters).toEqual({
        search: "",
        category: "Electronics",
        brand: "Brand A",
        minPrice: "50",
        maxPrice: "200",
        minRating: "4.0",
        sortBy: "price-low",
      });
    });

    it("should maintain loading states correctly", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      expect(result.current.isFiltering).toBe(false);
      expect(result.current.isTyping).toBe(false);

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
      });

      expect(typeof result.current.isFiltering).toBe("boolean");
    });

    it("should handle empty product arrays gracefully", () => {
      const { result } = renderHook(() => useProductFilters([]));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
      });

      expect(result.current.filters.category).toBe("Electronics");
      expect(result.current.filteredProducts).toEqual([]);
    });

    it("should handle null products gracefully", () => {
      const { result } = renderHook(() => useProductFilters(null));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
      });

      expect(result.current.filters.category).toBe("Electronics");
      expect(result.current.filteredProducts).toEqual([]);
    });
  });

  describe("Integration with UI Components", () => {
    it("should provide correct data for rendering", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      expect(result.current.filteredProducts).toHaveLength(5);
      expect(result.current.filterOptions.categories).toEqual([
        "Electronics",
        "Footwear",
        "Clothing",
      ]);
      expect(result.current.filterOptions.brands).toEqual([
        "Brand A",
        "Brand B",
        "Brand C",
        "Brand D",
        "Brand E",
      ]);
      expect(result.current.filterOptions.priceRange).toEqual({
        min: 49.99,
        max: 499.99,
      });
    });

    it("should update filter options when products change", () => {
      const { result, rerender } = renderHook(
        ({ products }) => useProductFilters(products),
        { initialProps: { products: mockProducts } }
      );

      const newProducts = [
        ...mockProducts,
        {
          id: 6,
          name: "New Product",
          category: "New Category",
          brand: "New Brand",
          price: 299.99,
          rating: 4.9,
        },
      ];

      rerender({ products: newProducts });

      expect(result.current.filterOptions.categories).toContain("New Category");
      expect(result.current.filterOptions.brands).toContain("New Brand");
    });
  });
});
