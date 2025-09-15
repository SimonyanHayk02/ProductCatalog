import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import { useProductFilters } from "../../hooks/useProductFilters";
import SortPanel from "../../components/SortPanel";
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

describe("Sorting Functionality Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Sort Options", () => {
    it("should render all sort options in SortPanel", () => {
      const mockOnSortChange = jest.fn();

      render(
        <SortPanel
          filteredCount={5}
          totalCount={5}
          sortBy="name"
          onSortChange={mockOnSortChange}
        />
      );

      expect(screen.getByText("Name A-Z")).toBeInTheDocument();
      expect(screen.getByText("Price: Low to High")).toBeInTheDocument();
      expect(screen.getByText("Price: High to Low")).toBeInTheDocument();
      expect(screen.getByText("Highest Rated")).toBeInTheDocument();
    });

    it("should call onSortChange when sort option is selected", () => {
      const mockOnSortChange = jest.fn();

      render(
        <SortPanel
          filteredCount={5}
          totalCount={5}
          sortBy="name"
          onSortChange={mockOnSortChange}
        />
      );

      const sortSelect = screen.getByDisplayValue("Name A-Z");
      fireEvent.change(sortSelect, { target: { value: "price-low" } });

      expect(mockOnSortChange).toHaveBeenCalledWith("price-low");
    });
  });

  describe("Sort by Name", () => {
    it("should sort products alphabetically A-Z", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("sortBy", "name");
      });

      await waitFor(() => {
        const sortedProducts = result.current.filteredProducts; 
        
        expect(sortedProducts[0].name).toBe("Bluetooth Speaker");
        expect(sortedProducts[1].name).toBe("Leather Jacket");
        expect(sortedProducts[2].name).toBe("Running Shoes");
        expect(sortedProducts[3].name).toBe("Smartphone");
        expect(sortedProducts[4].name).toBe("Wireless Headphones");
      });
    });
  });

  describe("Sort by Price", () => {
    it("should sort products by price low to high", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("sortBy", "price-low");
      });

      await waitFor(() => {
        const sortedProducts = result.current.filteredProducts;
        expect(sortedProducts[0].price).toBe(49.99);
        expect(sortedProducts[1].price).toBe(59.99);
        expect(sortedProducts[2].price).toBe(99.99);
        expect(sortedProducts[3].price).toBe(199.99);
        expect(sortedProducts[4].price).toBe(499.99);
      });
    });

    it("should sort products by price high to low", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("sortBy", "price-high");
      });

      await waitFor(() => {
        const sortedProducts = result.current.filteredProducts;
        expect(sortedProducts[0].price).toBe(499.99);
        expect(sortedProducts[1].price).toBe(199.99);
        expect(sortedProducts[2].price).toBe(99.99);
        expect(sortedProducts[3].price).toBe(59.99);
        expect(sortedProducts[4].price).toBe(49.99);
      });
    });
  });

  describe("Sort by Rating", () => {
    it("should sort products by rating highest first", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("sortBy", "rating");
      });

      await waitFor(() => {
        const sortedProducts = result.current.filteredProducts;
        expect(sortedProducts[0].rating).toBe(4.8);
        expect(sortedProducts[1].rating).toBe(4.7);
        expect(sortedProducts[2].rating).toBe(4.5);
        expect(sortedProducts[3].rating).toBe(4.2);
        expect(sortedProducts[4].rating).toBe(4.0);
      });
    });
  });

  describe("Sort with Filters", () => {
    it("should sort filtered products correctly", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
        result.current.handleFilterChange("sortBy", "price-low");
      });

      await waitFor(() => {
        const sortedProducts = result.current.filteredProducts;
        expect(sortedProducts).toHaveLength(3);
        expect(
          sortedProducts.every((product) => product.category === "Electronics")
        ).toBe(true);
        expect(sortedProducts[0].price).toBe(49.99);
        expect(sortedProducts[1].price).toBe(99.99);
        expect(sortedProducts[2].price).toBe(499.99);
      });
    });

    it("should maintain sort when filters change", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("sortBy", "rating");
      });

      act(() => {
        result.current.handleFilterChange("category", "Electronics");
      });

      await waitFor(() => {
        const sortedProducts = result.current.filteredProducts;
        expect(sortedProducts).toHaveLength(3);
        expect(sortedProducts[0].rating).toBe(4.8);
        expect(sortedProducts[1].rating).toBe(4.5);
        expect(sortedProducts[2].rating).toBe(4.0);
      });
    });
  });

  describe("Sort State Persistence", () => {
    it("should maintain sort state when other filters change", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("sortBy", "name");
      });

      act(() => {
        result.current.handleFilterChange("search", "wireless");
      });

      await waitFor(() => {
        expect(result.current.filters.sortBy).toBe("name");
      });
    });

    it("should reset sort when clear filters is called", async () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.handleFilterChange("sortBy", "price-high");
        result.current.handleFilterChange("category", "Electronics");
      });

      act(() => {
        result.current.clearFilters();
      });

      await waitFor(() => {
        expect(result.current.filters.sortBy).toBe("name");
      });
    });
  });

  describe("Sort Performance", () => {
    it("should handle sorting large product lists efficiently", async () => {
      const largeProductList = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        category: "Electronics",
        brand: "Brand A",
        price: Math.random() * 1000,
        rating: Math.random() * 5,
      }));

      const { result } = renderHook(() => useProductFilters(largeProductList));

      act(() => {
        result.current.handleFilterChange("sortBy", "price-low");
      });

      await waitFor(() => {
        expect(result.current.filteredProducts).toHaveLength(1000);
        const sortedProducts = result.current.filteredProducts;
        for (let i = 1; i < sortedProducts.length; i++) {
          expect(sortedProducts[i].price).toBeGreaterThanOrEqual(
            sortedProducts[i - 1].price
          );
        }
      });
    });
  });

  describe("Sort Edge Cases", () => {
    it("should handle empty product list", async () => {
      const { result } = renderHook(() => useProductFilters([]));

      act(() => {
        result.current.handleFilterChange("sortBy", "name");
      });

      await waitFor(() => {
        expect(result.current.filteredProducts).toHaveLength(0);
      });
    });

    it("should handle single product", async () => {
      const singleProduct = [mockProducts[0]];
      const { result } = renderHook(() => useProductFilters(singleProduct));

      act(() => {
        result.current.handleFilterChange("sortBy", "price-high");
      });

      await waitFor(() => {
        expect(result.current.filteredProducts).toHaveLength(1);
        expect(result.current.filteredProducts[0]).toEqual(singleProduct[0]);
      });
    });

    it("should handle products with same values", async () => {
      const samePriceProducts = [
        { ...mockProducts[0], price: 100 },
        { ...mockProducts[1], price: 100 },
        { ...mockProducts[2], price: 100 },
      ];

      const { result } = renderHook(() => useProductFilters(samePriceProducts));

      act(() => {
        result.current.handleFilterChange("sortBy", "price-low");
      });

      await waitFor(() => {
        expect(result.current.filteredProducts).toHaveLength(3);
        expect(
          result.current.filteredProducts.every(
            (product) => product.price === 100
          )
        ).toBe(true);
      });
    });
  });
});
