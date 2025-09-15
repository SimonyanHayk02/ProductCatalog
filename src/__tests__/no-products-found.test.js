import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import ProductsGrid from "../components/ProductsGrid";
import EmptyState from "../components/EmptyState";
import { useProductFilters } from "../hooks/useProductFilters";

jest.mock("../components/VirtualizedProductsGrid", () => {
  return function MockVirtualizedProductsGrid({ products, onClearFilters }) {
    return (
      <div data-testid="virtualized-grid">
        <div>Virtualized Grid - {products.length} products</div>
        <button onClick={onClearFilters}>Clear Filters</button>
      </div>
    );
  };
});

jest.mock("../components/ProductCard", () => {
  return function MockProductCard({ product }) {
    return <div data-testid={`product-card-${product.id}`}>{product.name}</div>;
  };
});

jest.mock("../utils/filterHelpers", () => ({
  filterProducts: jest.fn((products, filters) => {
    if (filters.category === "NonExistentCategory") {
      return [];
    }
    if (filters.brand === "NonExistentBrand") {
      return [];
    }
    if (filters.search === "nonexistent") {
      return [];
    }
    if (filters.priceRange && filters.priceRange.min > 10000) {
      return [];
    }
    if (filters.rating && filters.rating > 5) {
      return [];
    }
    return products;
  }),
  sortProducts: jest.fn((products) => products),
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
];

describe("No Products Found Scenarios", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("EmptyState Component Rendering", () => {
    it("should render empty state when no products are provided", () => {
      render(<ProductsGrid products={[]} onClearFilters={jest.fn()} />);

      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
      expect(screen.getByText("No products found")).toBeInTheDocument();
    });

    it("should render empty state when products is null", () => {
      render(<ProductsGrid products={null} onClearFilters={jest.fn()} />);

      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
      expect(screen.getByText("No products found")).toBeInTheDocument();
    });

    it("should render empty state when products is undefined", () => {
      render(<ProductsGrid products={undefined} onClearFilters={jest.fn()} />);

      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
      expect(screen.getByText("No products found")).toBeInTheDocument();
    });

    it("should not render empty state when products exist", () => {
      render(
        <ProductsGrid products={mockProducts} onClearFilters={jest.fn()} />
      );

      expect(screen.queryByTestId("empty-state")).not.toBeInTheDocument();
      expect(screen.getByTestId("products-grid")).toBeInTheDocument();
    });
  });

  describe("EmptyState Component Functionality", () => {
    it("should call onClearFilters when clear button is clicked", () => {
      const mockClearFilters = jest.fn();
      render(<EmptyState onClearFilters={mockClearFilters} />);

      const clearButton = screen.getByText("Clear All Filters");
      fireEvent.click(clearButton);

      expect(mockClearFilters).toHaveBeenCalledTimes(1);
    });

    it("should display correct message and icon", () => {
      render(<EmptyState onClearFilters={jest.fn()} />);

      expect(
        screen.getByText(
          "We couldn't find any products matching your current filters. Try adjusting your search criteria."
        )
      ).toBeInTheDocument();
      expect(screen.getByText("Clear All Filters")).toBeInTheDocument();
    });

    it("should have proper accessibility attributes", () => {
      render(<EmptyState onClearFilters={jest.fn()} />);

      const clearButton = screen.getByRole("button", {
        name: /clear all filters/i,
      });
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe("Filter Scenarios Leading to No Results", () => {
    it("should show empty state when filtering by non-existent category", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "NonExistentCategory");
      });

      expect(result.current.filters.category).toBe("NonExistentCategory");
    });

    it("should show empty state when filtering by non-existent brand", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("brand", "NonExistentBrand");
      });

      expect(result.current.filters.brand).toBe("NonExistentBrand");
    });

    it("should show empty state when searching for non-existent term", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("search", "nonexistent");
      });

      expect(result.current.filters.search).toBe("nonexistent");
    });

    it("should show empty state when price range has no matches", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("priceRange", {
          min: 10000,
          max: 20000,
        });
      });

      expect(result.current.filters.priceRange).toEqual({
        min: 10000,
        max: 20000,
      });
    });

    it("should show empty state when rating filter has no matches", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("rating", 5.0);
      });

      expect(result.current.filters.rating).toBe(5.0);
    });
  });

  describe("Complex Filter Combinations Leading to No Results", () => {
    it("should show empty state when multiple filters result in no matches", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
        result.current.handleFilterChange("brand", "NonExistentBrand");
      });

      expect(result.current.filters.category).toBe("Electronics");
      expect(result.current.filters.brand).toBe("NonExistentBrand");
    });

    it("should show empty state when search and category filters have no matches", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("search", "nonexistent");
        result.current.handleFilterChange("category", "Electronics");
      });

      expect(result.current.filters.search).toBe("nonexistent");
      expect(result.current.filters.category).toBe("Electronics");
    });

    it("should show empty state when price and rating filters have no matches", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("priceRange", {
          min: 10000,
          max: 20000,
        });
        result.current.handleFilterChange("rating", 5.0);
      });

      expect(result.current.filters.priceRange).toEqual({
        min: 10000,
        max: 20000,
      });
      expect(result.current.filters.rating).toBe(5.0);
    });
  });

  describe("Recovery from No Results State", () => {
    it("should show products again when clearing filters", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "NonExistentCategory");
      });

      expect(result.current.filters.category).toBe("NonExistentCategory");

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

    it("should show products again when adjusting filters", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "NonExistentCategory");
      });

      expect(result.current.filters.category).toBe("NonExistentCategory");

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
      });

      expect(result.current.filters.category).toBe("Electronics");
    });

    it("should show products again when clearing search", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("search", "nonexistent");
      });

      expect(result.current.filters.search).toBe("nonexistent");

      act(() => {
        result.current.handleFilterChange("search", "");
      });

      expect(result.current.filters.search).toBe("");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty products array with filters applied", () => {
      const { result } = renderHook(() => useProductFilters([]));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
      });

      expect(result.current.filters.category).toBe("Electronics");
      expect(result.current.filteredProducts).toEqual([]);
    });

    it("should handle null products with filters applied", () => {
      const { result } = renderHook(() => useProductFilters(null));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
      });

      expect(result.current.filters.category).toBe("Electronics");
      expect(result.current.filteredProducts).toEqual([]);
    });

    it("should handle undefined products with filters applied", () => {
      const { result } = renderHook(() => useProductFilters(undefined));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
      });

      expect(result.current.filters.category).toBe("Electronics");
      expect(result.current.filteredProducts).toEqual([]);
    });

    it("should maintain filter state even when no products match", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "NonExistentCategory");
        result.current.handleFilterChange("brand", "NonExistentBrand");
        result.current.handleFilterChange("search", "nonexistent");
        result.current.handleFilterChange("rating", 5.0);
        result.current.handleFilterChange("sortBy", "price-low");
      });

      expect(result.current.filters).toEqual({
        search: "nonexistent",
        category: "NonExistentCategory",
        brand: "NonExistentBrand",
        minPrice: "",
        maxPrice: "",
        minRating: "",
        rating: 5,
        sortBy: "price-low",
      });
    });
  });

  describe("User Experience", () => {
    it("should provide clear messaging when no products are found", () => {
      render(<EmptyState onClearFilters={jest.fn()} />);

      expect(
        screen.getByText(
          /we couldn't find any products matching your current filters/i
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(/try adjusting your search criteria/i)
      ).toBeInTheDocument();
    });

    it("should provide an easy way to clear filters", () => {
      render(<EmptyState onClearFilters={jest.fn()} />);

      const clearButton = screen.getByRole("button", {
        name: /clear all filters/i,
      });
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toBeEnabled();
    });

    it("should maintain consistent styling in empty state", () => {
      const { container } = render(<EmptyState onClearFilters={jest.fn()} />);

      const emptyState = container.querySelector('[data-testid="empty-state"]');
      expect(emptyState).toBeInTheDocument();
    });
  });
});
