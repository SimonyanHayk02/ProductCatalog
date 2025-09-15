import { render, screen, fireEvent } from "@testing-library/react";
import EmptyState from "../EmptyState";

describe("EmptyState", () => {
  const defaultProps = {
    onClearFilters: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render empty state message", () => {
      render(<EmptyState {...defaultProps} />);

      expect(screen.getByText("No products found")).toBeInTheDocument();
      expect(
        screen.getByText(
          "We couldn't find any products matching your current filters. Try adjusting your search criteria."
        )
      ).toBeInTheDocument();
    });

    it("should render clear filters button", () => {
      render(<EmptyState {...defaultProps} />);

      const clearButton = screen.getByText("Clear All Filters");
      expect(clearButton).toBeInTheDocument();
    });

    it("should render empty state icon", () => {
      render(<EmptyState {...defaultProps} />);

      const iconPath = screen
        .getByText("No products found")
        .closest("div")
        .querySelector("svg path");
      expect(iconPath).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should call onClearFilters when clear button is clicked", () => {
      const mockOnClearFilters = jest.fn();
      render(<EmptyState onClearFilters={mockOnClearFilters} />);

      const clearButton = screen.getByText("Clear All Filters");
      fireEvent.click(clearButton);

      expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
    });

    it("should handle missing onClearFilters prop", () => {
      render(<EmptyState />);

      const clearButton = screen.getByText("Clear All Filters");
      expect(clearButton).toBeInTheDocument();

      expect(() => fireEvent.click(clearButton)).not.toThrow();
    });
  });

  describe("Accessibility", () => {
    it("should have proper accessibility attributes", () => {
      render(<EmptyState {...defaultProps} />);

      const clearButton = screen.getByText("Clear All Filters");
      expect(clearButton).toBeInTheDocument();
    });

    it("should be keyboard accessible", () => {
      render(<EmptyState {...defaultProps} />);

      const clearButton = screen.getByText("Clear All Filters");
      clearButton.focus();
      expect(clearButton).toHaveFocus();
    });
  });

  describe("Visual States", () => {
    it("should render with correct CSS classes", () => {
      render(<EmptyState {...defaultProps} />);

      const container = screen.getByText("No products found").closest("div");
      expect(container).toHaveClass("text-center");
    });

    it("should render button with correct styling", () => {
      render(<EmptyState {...defaultProps} />);

      const clearButton = screen.getByText("Clear All Filters");
      expect(clearButton).toHaveClass(
        "bg-gradient-to-r",
        "from-blue-500",
        "to-purple-500",
        "text-white"
      );
    });
  });
});
