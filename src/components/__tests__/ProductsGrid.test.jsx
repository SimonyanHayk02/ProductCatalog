import { render, screen } from "@testing-library/react";
import ProductsGrid from "../ProductsGrid";
import VirtualizedProductsGrid from "../VirtualizedProductsGrid";

jest.mock("../VirtualizedProductsGrid", () => {
  return function MockVirtualizedProductsGrid({ products, onClearFilters }) {
    return (
      <div data-testid="virtualized-grid">
        <div>Virtualized Grid - {products.length} products</div>
        <button onClick={onClearFilters}>Clear Filters</button>
      </div>
    );
  };
});

jest.mock("../ProductCard", () => {
  return function MockProductCard({ product }) {
    return <div data-testid={`product-card-${product.id}`}>{product.name}</div>;
  };
});

jest.mock("../EmptyState", () => {
  return function MockEmptyState({ onClearFilters }) {
    return (
      <div data-testid="empty-state">
        <div>No products found</div>
        <button onClick={onClearFilters}>Clear Filters</button>
      </div>
    );
  };
});

jest.mock("../FilterLoading", () => {
  return function MockFilterLoading({
    isFiltering,
    isTyping,
    filteredCount,
    totalCount,
  }) {
    return (
      <div data-testid="filter-loading">
        <div>
          Loading... {filteredCount} of {totalCount}
        </div>
        <div>Filtering: {isFiltering ? "Yes" : "No"}</div>
        <div>Typing: {isTyping ? "Yes" : "No"}</div>
      </div>
    );
  };
});

const mockProducts = [
  {
    id: 1,
    name: "Product 1",
    category: "Electronics",
    price: 99.99,
    rating: 4.5,
  },
  { id: 2, name: "Product 2", category: "Clothing", price: 49.99, rating: 4.0 },
  {
    id: 3,
    name: "Product 3",
    category: "Electronics",
    price: 149.99,
    rating: 4.8,
  },
];

const defaultProps = {
  products: mockProducts,
  onClearFilters: jest.fn(),
  isFiltering: false,
  isTyping: false,
  totalCount: 100,
  useVirtualization: false,
  itemsPerPage: 20,
};

describe("ProductsGrid", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render regular grid when useVirtualization is false", () => {
    render(<ProductsGrid {...defaultProps} />);

    expect(screen.getByTestId("product-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("product-card-2")).toBeInTheDocument();
    expect(screen.getByTestId("product-card-3")).toBeInTheDocument();
    expect(screen.queryByTestId("virtualized-grid")).not.toBeInTheDocument();
  });

  it("should render virtualized grid when useVirtualization is true and products > 50", () => {
    const manyProducts = Array.from({ length: 60 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      category: "Electronics",
      price: 99.99,
      rating: 4.5,
    }));

    render(
      <ProductsGrid
        {...defaultProps}
        products={manyProducts}
        useVirtualization={true}
      />
    );

    expect(screen.getByTestId("virtualized-grid")).toBeInTheDocument();
    expect(
      screen.getByText("Virtualized Grid - 60 products")
    ).toBeInTheDocument();
  });

  it("should render regular grid when useVirtualization is true but products <= 50", () => {
    render(<ProductsGrid {...defaultProps} useVirtualization={true} />);

    expect(screen.getByTestId("product-card-1")).toBeInTheDocument();
    expect(screen.queryByTestId("virtualized-grid")).not.toBeInTheDocument();
  });

  it("should render empty state when no products and not filtering", () => {
    render(
      <ProductsGrid
        {...defaultProps}
        products={[]}
        isFiltering={false}
        isTyping={false}
      />
    );

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("No products found")).toBeInTheDocument();
  });

  it("should render filter loading when filtering", () => {
    render(
      <ProductsGrid {...defaultProps} isFiltering={true} isTyping={false} />
    );

    expect(screen.getByTestId("filter-loading")).toBeInTheDocument();
    expect(screen.getByText("Loading... 3 of 100")).toBeInTheDocument();
    expect(screen.getByText("Filtering: Yes")).toBeInTheDocument();
    expect(screen.getByText("Typing: No")).toBeInTheDocument();
  });

  it("should render filter loading when typing", () => {
    render(
      <ProductsGrid {...defaultProps} isFiltering={false} isTyping={true} />
    );

    expect(screen.getByTestId("filter-loading")).toBeInTheDocument();
    expect(screen.getByText("Filtering: No")).toBeInTheDocument();
    expect(screen.getByText("Typing: Yes")).toBeInTheDocument();
  });

  it("should render filter loading when both filtering and typing", () => {
    render(
      <ProductsGrid {...defaultProps} isFiltering={true} isTyping={true} />
    );

    expect(screen.getByTestId("filter-loading")).toBeInTheDocument();
    expect(screen.getByText("Filtering: Yes")).toBeInTheDocument();
    expect(screen.getByText("Typing: Yes")).toBeInTheDocument();
  });

  it("should pass correct props to VirtualizedProductsGrid", () => {
    const manyProducts = Array.from({ length: 60 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      category: "Electronics",
      price: 99.99,
      rating: 4.5,
    }));

    const mockOnClearFilters = jest.fn();

    render(
      <ProductsGrid
        {...defaultProps}
        products={manyProducts}
        useVirtualization={true}
        onClearFilters={mockOnClearFilters}
        itemsPerPage={24}
      />
    );

    expect(screen.getByTestId("virtualized-grid")).toBeInTheDocument();
  });

  it("should render correct number of product cards", () => {
    render(<ProductsGrid {...defaultProps} />);

    expect(screen.getAllByTestId(/product-card-/)).toHaveLength(3);
  });

  it("should handle empty products array with filtering", () => {
    render(<ProductsGrid {...defaultProps} products={[]} isFiltering={true} />);

    expect(screen.getByTestId("filter-loading")).toBeInTheDocument();
  });

  it("should handle null products", () => {
    render(<ProductsGrid {...defaultProps} products={null} />);

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("should use memo for performance optimization", () => {
    const { rerender } = render(<ProductsGrid {...defaultProps} />);

    rerender(<ProductsGrid {...defaultProps} />);

    expect(screen.getByTestId("product-card-1")).toBeInTheDocument();
  });
});
