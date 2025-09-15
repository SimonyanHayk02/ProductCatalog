import { render, screen, fireEvent } from "@testing-library/react";
import FiltersSidebar from "../FiltersSidebar";

const mockCategories = ["Electronics", "Clothing", "Footwear"];
const mockBrands = ["Brand A", "Brand B", "Brand C"];
const mockPrices = [0, 1000];

const defaultProps = {
  filters: {
    search: "",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
  },
  onFilterChange: jest.fn(),
  onClearFilters: jest.fn(),
  categories: mockCategories,
  brands: mockBrands,
  prices: mockPrices,
  isFiltering: false,
  isTyping: false,
  isMobile: false,
  onClose: null,
};

describe("FiltersSidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render all filter sections", () => {
      render(<FiltersSidebar {...defaultProps} />);

      expect(screen.getByText("Filters")).toBeInTheDocument();
      expect(screen.getByText("Search Products")).toBeInTheDocument();
      expect(screen.getByText("Category")).toBeInTheDocument();
      expect(screen.getByText("Brand")).toBeInTheDocument();
      expect(screen.getByText("Price Range")).toBeInTheDocument();
      expect(screen.getByText("Minimum Rating")).toBeInTheDocument();
    });

    it("should render search input", () => {
      render(<FiltersSidebar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search by name...");
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveValue("");
    });

    it("should render category dropdown with options", () => {
      render(<FiltersSidebar {...defaultProps} />);

      const categorySelect = screen.getByDisplayValue("All Categories");
      expect(categorySelect).toBeInTheDocument();

      mockCategories.forEach((category) => {
        expect(screen.getByText(category)).toBeInTheDocument();
      });
    });

    it("should render brand dropdown with options", () => {
      render(<FiltersSidebar {...defaultProps} />);

      const brandSelect = screen.getByDisplayValue("All Brands");
      expect(brandSelect).toBeInTheDocument();

      mockBrands.forEach((brand) => {
        expect(screen.getByText(brand)).toBeInTheDocument();
      });
    });

    it("should render price range inputs", () => {
      render(<FiltersSidebar {...defaultProps} />);

      const minPriceInput = screen.getByPlaceholderText("Min");
      const maxPriceInput = screen.getByPlaceholderText("Max");

      expect(minPriceInput).toBeInTheDocument();
      expect(maxPriceInput).toBeInTheDocument();
      expect(minPriceInput).toHaveValue(null);
      expect(maxPriceInput).toHaveValue(null);
    });

    it("should render rating dropdown with options", () => {
      render(<FiltersSidebar {...defaultProps} />);

      const ratingSelect = screen.getByDisplayValue("Any Rating");
      expect(ratingSelect).toBeInTheDocument();

      expect(screen.getByText("4+ Stars ⭐⭐⭐⭐")).toBeInTheDocument();
      expect(screen.getByText("4.5+ Stars ⭐⭐⭐⭐⭐")).toBeInTheDocument();
    });

    it("should render clear filters button", () => {
      render(<FiltersSidebar {...defaultProps} />);

      const clearButton = screen.getByText("Clear All");
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe("Filter Logic", () => {
    it("should call onFilterChange when search input changes", () => {
      const mockOnFilterChange = jest.fn();
      render(
        <FiltersSidebar {...defaultProps} onFilterChange={mockOnFilterChange} />
      );

      const searchInput = screen.getByPlaceholderText("Search by name...");
      fireEvent.change(searchInput, { target: { value: "headphones" } });

      expect(mockOnFilterChange).toHaveBeenCalledWith("search", "headphones");
    });

    it("should call onFilterChange when category changes", () => {
      const mockOnFilterChange = jest.fn();
      render(
        <FiltersSidebar {...defaultProps} onFilterChange={mockOnFilterChange} />
      );

      const categorySelect = screen.getByDisplayValue("All Categories");
      fireEvent.change(categorySelect, { target: { value: "Electronics" } });

      expect(mockOnFilterChange).toHaveBeenCalledWith(
        "category",
        "Electronics"
      );
    });

    it("should call onFilterChange when brand changes", () => {
      const mockOnFilterChange = jest.fn();
      render(
        <FiltersSidebar {...defaultProps} onFilterChange={mockOnFilterChange} />
      );

      const brandSelect = screen.getByDisplayValue("All Brands");
      fireEvent.change(brandSelect, { target: { value: "Brand A" } });

      expect(mockOnFilterChange).toHaveBeenCalledWith("brand", "Brand A");
    });

    it("should call onFilterChange when min price changes", () => {
      const mockOnFilterChange = jest.fn();
      render(
        <FiltersSidebar {...defaultProps} onFilterChange={mockOnFilterChange} />
      );

      const minPriceInput = screen.getByPlaceholderText("Min");
      fireEvent.change(minPriceInput, { target: { value: "100" } });

      expect(mockOnFilterChange).toHaveBeenCalledWith("minPrice", "100");
    });

    it("should call onFilterChange when max price changes", () => {
      const mockOnFilterChange = jest.fn();
      render(
        <FiltersSidebar {...defaultProps} onFilterChange={mockOnFilterChange} />
      );

      const maxPriceInput = screen.getByPlaceholderText("Max");
      fireEvent.change(maxPriceInput, { target: { value: "500" } });

      expect(mockOnFilterChange).toHaveBeenCalledWith("maxPrice", "500");
    });

    it("should call onFilterChange when rating changes", () => {
      const mockOnFilterChange = jest.fn();
      render(
        <FiltersSidebar {...defaultProps} onFilterChange={mockOnFilterChange} />
      );

      const ratingSelect = screen.getByDisplayValue("Any Rating");
      fireEvent.change(ratingSelect, { target: { value: "4.5" } });

      expect(mockOnFilterChange).toHaveBeenCalledWith("minRating", "4.5");
    });

    it("should call onClearFilters when clear button is clicked", () => {
      const mockOnClearFilters = jest.fn();
      render(
        <FiltersSidebar {...defaultProps} onClearFilters={mockOnClearFilters} />
      );

      const clearButton = screen.getByText("Clear All");
      fireEvent.click(clearButton);

      expect(mockOnClearFilters).toHaveBeenCalled();
    });
  });

  describe("Real-time Updates", () => {
    it("should display current filter values", () => {
      const filtersWithValues = {
        search: "wireless",
        category: "Electronics",
        brand: "Brand A",
        minPrice: "100",
        maxPrice: "500",
        minRating: "4.5",
      };

      render(<FiltersSidebar {...defaultProps} filters={filtersWithValues} />);

      expect(screen.getByDisplayValue("wireless")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Electronics")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Brand A")).toBeInTheDocument();
      expect(screen.getByDisplayValue("100")).toBeInTheDocument();
      const elementsWith500 = screen.getAllByDisplayValue("500");
      expect(elementsWith500).toHaveLength(2); 
      expect(screen.getByText("4.5+ Stars ⭐⭐⭐⭐⭐")).toBeInTheDocument();
    });

    it("should update filter values when props change", () => {
      const { rerender } = render(<FiltersSidebar {...defaultProps} />);

      expect(screen.getByDisplayValue("All Categories")).toBeInTheDocument();

      const updatedFilters = {
        ...defaultProps.filters,
        category: "Electronics",
      };

      rerender(<FiltersSidebar {...defaultProps} filters={updatedFilters} />);

      expect(screen.getByDisplayValue("Electronics")).toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    it("should render normally when filtering", () => {
      render(
        <FiltersSidebar {...defaultProps} isFiltering={true} isTyping={false} />
      );

      expect(screen.getByText("Filters")).toBeInTheDocument();
    });

    it("should render normally when typing", () => {
      render(
        <FiltersSidebar {...defaultProps} isFiltering={false} isTyping={true} />
      );

      expect(screen.getByText("Filters")).toBeInTheDocument();
    });

    it("should render normally when filtering and typing", () => {
      render(
        <FiltersSidebar {...defaultProps} isFiltering={true} isTyping={true} />
      );

      expect(screen.getByText("Filters")).toBeInTheDocument();
    });
  });

  describe("Mobile Layout", () => {
    it("should render mobile layout when isMobile is true", () => {
      render(<FiltersSidebar {...defaultProps} isMobile={true} />);

      const mobileContainer = screen.getByText("Filters").closest("div")
        .parentElement.parentElement.parentElement;
      expect(mobileContainer).toHaveClass("w-full", "h-full");
    });

    it("should render desktop layout when isMobile is false", () => {
      render(<FiltersSidebar {...defaultProps} isMobile={false} />);

      const desktopContainer = screen.getByText("Filters").closest("div")
        .parentElement.parentElement.parentElement;
      expect(desktopContainer).toHaveClass("lg:w-80", "flex-shrink-0");
    });

    it("should call onClose when close button is clicked in mobile mode", () => {
      const mockOnClose = jest.fn();
      render(
        <FiltersSidebar
          {...defaultProps}
          isMobile={true}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByLabelText("Close filter menu");
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper form inputs", () => {
      render(<FiltersSidebar {...defaultProps} />);

      expect(
        screen.getByPlaceholderText("Search by name...")
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue("All Categories")).toBeInTheDocument();
      expect(screen.getByDisplayValue("All Brands")).toBeInTheDocument();
    });

    it("should have proper input types", () => {
      render(<FiltersSidebar {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search by name...");
      expect(searchInput).toHaveAttribute("type", "text");

      const categorySelect = screen.getByDisplayValue("All Categories");
      expect(categorySelect).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty categories array", () => {
      render(<FiltersSidebar {...defaultProps} categories={[]} />);

      expect(screen.getByDisplayValue("All Categories")).toBeInTheDocument();
      expect(screen.queryByText("Electronics")).not.toBeInTheDocument();
    });

    it("should handle empty brands array", () => {
      render(<FiltersSidebar {...defaultProps} brands={[]} />);

      expect(screen.getByDisplayValue("All Brands")).toBeInTheDocument();
      expect(screen.queryByText("Brand A")).not.toBeInTheDocument();
    });

    it("should handle prices array", () => {
      render(<FiltersSidebar {...defaultProps} prices={[0, 1000]} />);

      const minPriceInput = screen.getByPlaceholderText(/Min/);
      const maxPriceInput = screen.getByPlaceholderText(/Max/);

      expect(minPriceInput).toBeInTheDocument();
      expect(maxPriceInput).toBeInTheDocument();
    });
  });
});
