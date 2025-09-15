import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import { useProductFilters } from "../../hooks/useProductFilters";
import FiltersSidebar from "../../components/FiltersSidebar";
import ProductsGrid from "../../components/ProductsGrid";

jest.mock("../../utils/filterHelpers", () => ({
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
  }),
  sortProducts: jest.fn((products, sortBy) => {
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

describe("Real-time Filtering Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Real-time Updates", () => {
    it("should update product list immediately when search changes", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      expect(result.current.filteredProducts).toHaveLength(5);

      act(() => {
        result.current.handleFilterChange("search", "wireless");
      });

      await waitFor(() => {
        expect(result.current.filteredProducts).toHaveLength(1);
        expect(result.current.filteredProducts[0].name).toBe(
          "Wireless Headphones"
        );
      });
    });

    it("should update product list immediately when category changes", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
      });

      await waitFor(() => {
        expect(result.current.filteredProducts).toHaveLength(3);
        expect(
          result.current.filteredProducts.every(
            (product) => product.category === "Electronics"
          )
        ).toBe(true);
      });
    });

    it("should update product list immediately when price range changes", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("minPrice", "100");
        result.current.handleFilterChange("maxPrice", "300");
      });

      await waitFor(() => {
        expect(result.current.filteredProducts).toHaveLength(1);
        expect(
          result.current.filteredProducts.every(
            (product) => product.price >= 100 && product.price <= 300
          )
        ).toBe(true);
      });
    });

    it("should update product list immediately when rating changes", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("minRating", "4.5");
      });

      await waitFor(() => {
        expect(result.current.filteredProducts).toHaveLength(3);
        expect(
          result.current.filteredProducts.every(
            (product) => product.rating >= 4.5
          )
        ).toBe(true);
      });
    });

    it("should update product list immediately when multiple filters change", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
        result.current.handleFilterChange("minPrice", "50");
        result.current.handleFilterChange("maxPrice", "200");
      });

      await waitFor(() => {
        const filteredProducts = result.current.filteredProducts;
        expect(filteredProducts).toHaveLength(1);
        expect(
          filteredProducts.every(
            (product) =>
              product.category === "Electronics" &&
              product.price >= 50 &&
              product.price <= 200
          )
        ).toBe(true);
      });
    });
  });

  describe("No Products Found", () => {
    it("should show empty state when no products match filters", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("search", "nonexistent");
      });

      await waitFor(() => {
        expect(result.current.filteredProducts).toHaveLength(0);
      });
    });

    it("should show empty state when category filter matches no products", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "Books");
      });

      await waitFor(() => {
        expect(result.current.filteredProducts).toHaveLength(0);
      });
    });

    it("should show empty state when price range matches no products", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("minPrice", "1000");
      });

      await waitFor(() => {
        expect(result.current.filteredProducts).toHaveLength(0);
      });
    });

    it("should show empty state when rating filter matches no products", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("minRating", "5.0");
      });

      await waitFor(() => {
        expect(result.current.filteredProducts).toHaveLength(0);
      });
    });

    it("should clear filters and show all products when clear is called", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("search", "nonexistent");
      });

      await waitFor(() => {
        expect(result.current.filteredProducts).toHaveLength(0);
      });

      act(() => {
        result.current.clearFilters();
      });

      await waitFor(() => {
        expect(result.current.filteredProducts).toHaveLength(5);
      });
    });
  });

  describe("Component Integration", () => {
    it("should render FiltersSidebar with correct props", () => {
      const mockOnFilterChange = jest.fn();
      const mockOnClearFilters = jest.fn();

      render(
        <FiltersSidebar
          filters={{
            search: "",
            category: "",
            brand: "",
            minPrice: "",
            maxPrice: "",
            minRating: "",
          }}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          categories={["Electronics", "Clothing"]}
          brands={["Brand A", "Brand B"]}
          prices={[0, 1000]}
          isFiltering={false}
          isTyping={false}
        />
      );

      expect(screen.getByText("Filters")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Search by name...")
      ).toBeInTheDocument();
    });

    it("should render ProductsGrid with correct props", () => {
      const mockOnClearFilters = jest.fn();

      render(
        <ProductsGrid
          products={mockProducts}
          onClearFilters={mockOnClearFilters}
          isFiltering={false}
          isTyping={false}
          totalCount={100}
          useVirtualization={false}
        />
      );

      expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
      expect(screen.getByText("Bluetooth Speaker")).toBeInTheDocument();
    });

    it("should show loading state when filtering", () => {
      const mockOnClearFilters = jest.fn();

      render(
        <ProductsGrid
          products={mockProducts}
          onClearFilters={mockOnClearFilters}
          isFiltering={true}
          isTyping={false}
          totalCount={100}
          useVirtualization={false}
        />
      );

      expect(screen.getByText("Filtering products")).toBeInTheDocument();
    });

    it("should show empty state when no products", () => {
      const mockOnClearFilters = jest.fn();

      render(
        <ProductsGrid
          products={[]}
          onClearFilters={mockOnClearFilters}
          isFiltering={false}
          isTyping={false}
          totalCount={100}
          useVirtualization={false}
        />
      );

      expect(screen.getByText("No products found")).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should not cause unnecessary re-renders", () => {
      const { result, rerender } = renderHook(() =>
        useProductFilters(mockProducts)
      );

      const initialRender = result.current;

      rerender();

      expect(result.current.filters).toBe(initialRender.filters);
    });

    it("should handle rapid filter changes efficiently", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("search", "wireless");
        result.current.handleFilterChange("category", "Electronics");
        result.current.handleFilterChange("minPrice", "50");
      });

      await waitFor(() => {
        expect(result.current.filters.search).toBe("wireless");
        expect(result.current.filters.category).toBe("Electronics");
        expect(result.current.filters.minPrice).toBe("50");
      });
    });
  });
});
