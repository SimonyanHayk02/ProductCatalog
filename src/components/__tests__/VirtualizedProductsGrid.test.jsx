import { render, screen, fireEvent } from "@testing-library/react";
import VirtualizedProductsGrid from "../VirtualizedProductsGrid";

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

const mockScrollTo = jest.fn();
Object.defineProperty(window, "scrollTo", {
  value: mockScrollTo,
  writable: true,
});

const mockProducts = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  category: "Electronics",
  price: 99.99,
  rating: 4.5,
}));

const defaultProps = {
  products: mockProducts,
  onClearFilters: jest.fn(),
  isFiltering: false,
  isTyping: false,
  totalCount: 100,
  itemsPerPage: 10,
};

describe("VirtualizedProductsGrid", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockScrollTo.mockClear();
  });

  it("should render first page of products", () => {
    render(<VirtualizedProductsGrid {...defaultProps} />);

    expect(screen.getByTestId("product-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("product-card-10")).toBeInTheDocument();
    expect(screen.queryByTestId("product-card-11")).not.toBeInTheDocument();
  });

  it("should show pagination controls when more than one page", () => {
    render(<VirtualizedProductsGrid {...defaultProps} />);

    expect(
      screen.getByText("Showing 1 to 10 of 25 products")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Previous" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
  });

  it("should not show pagination when only one page", () => {
    const fewProducts = mockProducts.slice(0, 5);
    render(
      <VirtualizedProductsGrid
        {...defaultProps}
        products={fewProducts}
        itemsPerPage={10}
      />
    );

    expect(
      screen.queryByText(/Showing \d+ to \d+ of \d+ products/)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Previous" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Next" })
    ).not.toBeInTheDocument();
  });

  it("should navigate to next page", () => {
    render(<VirtualizedProductsGrid {...defaultProps} />);

    const nextButton = screen.getByRole("button", { name: "Next" });
    fireEvent.click(nextButton);

    expect(screen.getByTestId("product-card-11")).toBeInTheDocument();
    expect(screen.getByTestId("product-card-20")).toBeInTheDocument();
    expect(screen.queryByTestId("product-card-1")).not.toBeInTheDocument();
    expect(
      screen.getByText("Showing 11 to 20 of 25 products")
    ).toBeInTheDocument();
  });

  it("should navigate to previous page", () => {
    render(<VirtualizedProductsGrid {...defaultProps} />);

    const nextButton = screen.getByRole("button", { name: "Next" });
    fireEvent.click(nextButton);

    const prevButton = screen.getByRole("button", { name: "Previous" });
    fireEvent.click(prevButton);

    expect(screen.getByTestId("product-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("product-card-10")).toBeInTheDocument();
    expect(
      screen.getByText("Showing 1 to 10 of 25 products")
    ).toBeInTheDocument();
  });

  it("should navigate to specific page", () => {
    render(<VirtualizedProductsGrid {...defaultProps} />);

    const page3Button = screen.getByRole("button", { name: "3" });
    fireEvent.click(page3Button);

    expect(screen.getByTestId("product-card-21")).toBeInTheDocument();
    expect(screen.getByTestId("product-card-25")).toBeInTheDocument();
    expect(screen.queryByTestId("product-card-1")).not.toBeInTheDocument();
    expect(
      screen.getByText("Showing 21 to 25 of 25 products")
    ).toBeInTheDocument();
  });

  it("should disable Previous button on first page", () => {
    render(<VirtualizedProductsGrid {...defaultProps} />);

    const prevButton = screen.getByRole("button", { name: "Previous" });
    expect(prevButton).toBeDisabled();
  });

  it("should disable Next button on last page", () => {
    render(<VirtualizedProductsGrid {...defaultProps} />);

    const page3Button = screen.getByRole("button", { name: "3" });
    fireEvent.click(page3Button);

    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(nextButton).toBeDisabled();
  });

  it("should scroll to top when changing pages", () => {
    render(<VirtualizedProductsGrid {...defaultProps} />);

    const nextButton = screen.getByRole("button", { name: "Next" });
    fireEvent.click(nextButton);

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("should reset to page 1 when products change", () => {
    const { rerender } = render(<VirtualizedProductsGrid {...defaultProps} />);

    const nextButton = screen.getByRole("button", { name: "Next" });
    fireEvent.click(nextButton);
    expect(
      screen.getByText("Showing 11 to 20 of 25 products")
    ).toBeInTheDocument();

    const newProducts = mockProducts.slice(0, 15);
    rerender(
      <VirtualizedProductsGrid {...defaultProps} products={newProducts} />
    );

    expect(
      screen.getByText("Showing 1 to 10 of 15 products")
    ).toBeInTheDocument();
  });

  it("should render empty state when no products", () => {
    render(
      <VirtualizedProductsGrid
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
      <VirtualizedProductsGrid
        {...defaultProps}
        isFiltering={true}
        isTyping={false}
      />
    );

    expect(screen.getByTestId("filter-loading")).toBeInTheDocument();
    expect(screen.getByText("Loading... 25 of 100")).toBeInTheDocument();
  });

  it("should render filter loading when typing", () => {
    render(
      <VirtualizedProductsGrid
        {...defaultProps}
        isFiltering={false}
        isTyping={true}
      />
    );

    expect(screen.getByTestId("filter-loading")).toBeInTheDocument();
  });

  it("should handle edge case with exact page boundary", () => {
    const exactPageProducts = mockProducts.slice(0, 20);
    render(
      <VirtualizedProductsGrid
        {...defaultProps}
        products={exactPageProducts}
        itemsPerPage={10}
      />
    );

    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "3" })).not.toBeInTheDocument();
  });

  it("should show correct page numbers with many pages", () => {
    const manyProducts = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      category: "Electronics",
      price: 99.99,
      rating: 4.5,
    }));

    render(
      <VirtualizedProductsGrid
        {...defaultProps}
        products={manyProducts}
        itemsPerPage={10}
      />
    );

    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
  });

  it("should handle page navigation beyond available pages", () => {
    render(<VirtualizedProductsGrid {...defaultProps} />);

    const page3Button = screen.getByRole("button", { name: "3" });
    fireEvent.click(page3Button);

    expect(
      screen.getByText("Showing 21 to 25 of 25 products")
    ).toBeInTheDocument();
  });
});
