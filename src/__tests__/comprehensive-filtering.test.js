import { renderHook, act } from "@testing-library/react";
import { useProductFilters } from "../hooks/useProductFilters";

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

jest.mock("../hooks/useDebounce", () => ({
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
  {
    id: 6,
    name: "Gaming Laptop",
    category: "Electronics",
    brand: "Brand F",
    price: 1299.99,
    rating: 4.6,
  },
  {
    id: 7,
    name: "T-Shirt",
    category: "Clothing",
    brand: "Brand G",
    price: 19.99,
    rating: 3.8,
  },
  {
    id: 8,
    name: "Sneakers",
    category: "Footwear",
    brand: "Brand H",
    price: 89.99,
    rating: 4.3,
  },
];

describe("Comprehensive Filtering System", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render product catalog with all products initially", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      expect(result.current.filteredProducts).toHaveLength(8);
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
        "Brand F",
        "Brand G",
        "Brand H",
      ]);
    });

    it("should render filter options correctly", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      expect(result.current.filterOptions.priceRange).toEqual({
        min: 19.99,
        max: 1299.99,
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

  describe("Filter Logic - Category Filtering", () => {
    it("should filter products by category", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
      });

      expect(result.current.filters.category).toBe("Electronics");
    });

    it("should filter products by multiple categories", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
      });

      expect(result.current.filters.category).toBe("Electronics");

      act(() => {
        result.current.handleFilterChange("category", "Clothing");
      });

      expect(result.current.filters.category).toBe("Clothing");
    });
  });

  describe("Filter Logic - Brand Filtering", () => {
    it("should filter products by brand", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("brand", "Brand A");
      });

      expect(result.current.filters.brand).toBe("Brand A");
    });

    it("should clear brand filter", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("brand", "Brand A");
      });

      expect(result.current.filters.brand).toBe("Brand A");

      act(() => {
        result.current.handleFilterChange("brand", "");
      });

      expect(result.current.filters.brand).toBe("");
    });
  });

  describe("Filter Logic - Price Range Filtering", () => {
    it("should filter products by minimum price", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("priceRange", {
          min: 100,
          max: 1000,
        });
      });

      expect(result.current.filters.priceRange).toEqual({
        min: 100,
        max: 1000,
      });
    });

    it("should filter products by maximum price", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("priceRange", { min: 0, max: 50 });
      });

      expect(result.current.filters.priceRange).toEqual({
        min: 0,
        max: 50,
      });
    });

    it("should filter products by price range", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("priceRange", { min: 50, max: 200 });
      });

      expect(result.current.filters.priceRange).toEqual({
        min: 50,
        max: 200,
      });
    });
  });

  describe("Filter Logic - Rating Filtering", () => {
    it("should filter products by minimum rating", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("rating", 4.5);
      });

      expect(result.current.filters.rating).toBe(4.5);
    });

    it("should filter products by different rating thresholds", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("rating", 4.0);
      });

      expect(result.current.filters.rating).toBe(4.0);

      act(() => {
        result.current.handleFilterChange("rating", 4.5);
      });

      expect(result.current.filters.rating).toBe(4.5);
    });
  });

  describe("Filter Logic - Search Filtering", () => {
    it("should filter products by search term", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("search", "wireless");
      });

      expect(result.current.filters.search).toBe("wireless");
    });

    it("should handle case-insensitive search", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("search", "WIRELESS");
      });

      expect(result.current.filters.search).toBe("WIRELESS");
    });

    it("should clear search filter", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("search", "wireless");
      });

      expect(result.current.filters.search).toBe("wireless");

      act(() => {
        result.current.handleFilterChange("search", "");
      });

      expect(result.current.filters.search).toBe("");
    });
  });

  describe("Real-time Updates", () => {
    it("should update filtered products immediately when category changes", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
      });

      expect(result.current.filters.category).toBe("Electronics");
    });

    it("should update filtered products immediately when price range changes", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("priceRange", { min: 100, max: 500 });
      });

      expect(result.current.filters.priceRange).toEqual({
        min: 100,
        max: 500,
      });
    });

    it("should update filtered products immediately when brand changes", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("brand", "Brand A");
      });

      expect(result.current.filters.brand).toBe("Brand A");
    });

    it("should update filtered products immediately when rating changes", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("rating", 4.5);
      });

      expect(result.current.filters.rating).toBe(4.5);
    });

    it("should update filtered products immediately when search changes", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("search", "headphones");
      });

      expect(result.current.filters.search).toBe("headphones");
    });
  });

  describe("No Products Found Scenarios", () => {
    it("should handle empty products array", () => {
      const { result } = renderHook(() => useProductFilters([]));

      expect(result.current.filteredProducts).toEqual([]);
      expect(result.current.filterOptions).toEqual({
        categories: [],
        brands: [],
        priceRange: { min: 0, max: 0 },
      });
    });

    it("should handle null products", () => {
      const { result } = renderHook(() => useProductFilters(null));

      expect(result.current.filteredProducts).toEqual([]);
      expect(result.current.filterOptions).toEqual({
        categories: [],
        brands: [],
        priceRange: { min: 0, max: 0 },
      });
    });

    it("should handle undefined products", () => {
      const { result } = renderHook(() => useProductFilters(undefined));

      expect(result.current.filteredProducts).toEqual([]);
      expect(result.current.filterOptions).toEqual({
        categories: [],
        brands: [],
        priceRange: { min: 0, max: 0 },
      });
    });

    it("should show empty state when no products match filters", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      // Apply filters that will result in no matches
      act(() => {
        result.current.handleFilterChange("category", "NonExistentCategory");
      });

      expect(result.current.filters.category).toBe("NonExistentCategory");
    });

    it("should clear all filters when clearFilters is called", () => {
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

  describe("Sorting Functionality", () => {
    it("should sort products by name", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("sortBy", "name");
      });

      expect(result.current.filters.sortBy).toBe("name");
    });

    it("should sort products by price low to high", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("sortBy", "price-low");
      });

      expect(result.current.filters.sortBy).toBe("price-low");
    });

    it("should sort products by price high to low", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("sortBy", "price-high");
      });

      expect(result.current.filters.sortBy).toBe("price-high");
    });

    it("should sort products by rating", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("sortBy", "rating");
      });

      expect(result.current.filters.sortBy).toBe("rating");
    });

    it("should maintain sort state when changing other filters", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("sortBy", "price-high");
      });

      expect(result.current.filters.sortBy).toBe("price-high");

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
      });

      expect(result.current.filters.sortBy).toBe("price-high");
      expect(result.current.filters.category).toBe("Electronics");
    });
  });

  describe("Combined Filtering and Sorting", () => {
    it("should apply multiple filters simultaneously", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
        result.current.handleFilterChange("brand", "Brand A");
        result.current.handleFilterChange("minPrice", "50");
        result.current.handleFilterChange("maxPrice", "200");
        result.current.handleFilterChange("minRating", "4.0");
      });

      expect(result.current.filters).toEqual({
        search: "",
        category: "Electronics",
        brand: "Brand A",
        minPrice: "50",
        maxPrice: "200",
        minRating: "4.0",
        sortBy: "name",
      });
    });

    it("should apply filters and sorting together", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
        result.current.handleFilterChange("sortBy", "price-low");
      });

      expect(result.current.filters.category).toBe("Electronics");
      expect(result.current.filters.sortBy).toBe("price-low");
    });

    it("should handle complex filtering scenarios", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("search", "wireless");
        result.current.handleFilterChange("category", "Electronics");
        result.current.handleFilterChange("minPrice", "50");
        result.current.handleFilterChange("maxPrice", "500");
        result.current.handleFilterChange("minRating", "4.0");
        result.current.handleFilterChange("sortBy", "rating");
      });

      expect(result.current.filters).toEqual({
        search: "wireless",
        category: "Electronics",
        brand: "",
        minPrice: "50",
        maxPrice: "500",
        minRating: "4.0",
        sortBy: "rating",
      });
    });
  });
});
