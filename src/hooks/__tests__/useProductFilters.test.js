import { renderHook, act, waitFor } from "@testing-library/react";
import { useProductFilters } from "../useProductFilters";

jest.mock("../../utils/filterHelpers", () => ({
  filterProducts: jest.fn((products, filters) => {
    if (filters.search) {
      return products.filter((product) =>
        product.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.category) {
      return products.filter(
        (product) => product.category === filters.category
      );
    }
    return products;
  }),
  sortProducts: jest.fn((products, sortBy) => {
    if (sortBy === "name") {
      return [...products].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === "price-low") {
      return [...products].sort((a, b) => a.price - b.price);
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

jest.mock("../useDebounce", () => ({
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
];

describe("useProductFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default filters", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

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

  it("should return initial products when no filters applied", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    expect(result.current.filteredProducts).toHaveLength(mockProducts.length);
    expect(result.current.filteredProducts[0].name).toBe("Bluetooth Speaker");
    expect(result.current.isFiltering).toBe(false);
    expect(result.current.isTyping).toBe(false);
  });

  it("should update filters when handleFilterChange is called", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    act(() => {
      result.current.handleFilterChange("category", "Electronics");
    });

    expect(result.current.filters.category).toBe("Electronics");
  });

  it("should not update filters when same value is provided", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    act(() => {
      result.current.handleFilterChange("category", "Electronics");
    });

    const firstUpdate = result.current.filters;

    act(() => {
      result.current.handleFilterChange("category", "Electronics");
    });

    expect(result.current.filters).toBe(firstUpdate);
  });

  it("should clear all filters when clearFilters is called", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    act(() => {
      result.current.handleFilterChange("category", "Electronics");
      result.current.handleFilterChange("brand", "Brand A");
    });

    expect(result.current.filters.category).toBe("Electronics");
    expect(result.current.filters.brand).toBe("Brand A");

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

  it("should return correct filter options", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    expect(result.current.filterOptions).toEqual({
      categories: ["Electronics", "Footwear"],
      brands: ["Brand A", "Brand B", "Brand C"],
      priceRange: { min: 49.99, max: 99.99 },
    });
  });

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

  it("should trigger filtering when products change", async () => {
    const { result, rerender } = renderHook(
      ({ products }) => useProductFilters(products),
      { initialProps: { products: [] } }
    );

    expect(result.current.filteredProducts).toEqual([]);

    rerender({ products: mockProducts });

    await waitFor(() => {
      expect(result.current.filteredProducts).toHaveLength(mockProducts.length);
      expect(result.current.filteredProducts[0].name).toBe("Bluetooth Speaker");
    });
  });

  it("should handle search filter changes", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    act(() => {
      result.current.handleFilterChange("search", "headphones");
    });

    expect(result.current.filters.search).toBe("headphones");
  });

  it("should handle sort filter changes", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    act(() => {
      result.current.handleFilterChange("sortBy", "price-low");
    });

    expect(result.current.filters.sortBy).toBe("price-low");
  });

  it("should handle multiple filter changes", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    act(() => {
      result.current.handleFilterChange("category", "Electronics");
      result.current.handleFilterChange("brand", "Brand A");
      result.current.handleFilterChange("minPrice", "50");
    });

    expect(result.current.filters).toEqual({
      category: "Electronics",
      brand: "Brand A",
      minPrice: "50",
      maxPrice: "",
      minRating: "",
      search: "",
      sortBy: "name",
    });
  });
});
