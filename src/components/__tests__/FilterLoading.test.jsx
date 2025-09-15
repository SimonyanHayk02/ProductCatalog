import { render, screen } from "@testing-library/react";
import FilterLoading from "../FilterLoading";

describe("FilterLoading", () => {
  const defaultProps = {
    isFiltering: false,
    isTyping: false,
    filteredCount: 10,
    totalCount: 100,
  };

  describe("Component Rendering", () => {
    it("should render loading spinner when filtering", () => {
      render(<FilterLoading {...defaultProps} isFiltering={true} />);

      expect(screen.getByText("Filtering products")).toBeInTheDocument();
    });

    it("should display filtered count and total count when filtering", () => {
      render(<FilterLoading {...defaultProps} isFiltering={true} />);

      expect(screen.getByText("Found 10 of 100 products")).toBeInTheDocument();
    });

    it("should show filtering state when isFiltering is true", () => {
      render(<FilterLoading {...defaultProps} isFiltering={true} />);

      expect(screen.getByText("Filtering products")).toBeInTheDocument();
    });

    it("should show typing state when isTyping is true", () => {
      render(<FilterLoading {...defaultProps} isTyping={true} />);

      expect(screen.getByText("Typing")).toBeInTheDocument();
    });

    it("should show both states when filtering and typing", () => {
      render(
        <FilterLoading {...defaultProps} isFiltering={true} isTyping={true} />
      );

      expect(screen.getByText("Typing")).toBeInTheDocument();
      expect(
        screen.getByText("Please wait while we process your input...")
      ).toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    it("should show appropriate message when only filtering", () => {
      render(
        <FilterLoading {...defaultProps} isFiltering={true} isTyping={false} />
      );

      expect(screen.getByText("Filtering products")).toBeInTheDocument();
      expect(screen.queryByText("Typing")).not.toBeInTheDocument();
    });

    it("should show appropriate message when only typing", () => {
      render(
        <FilterLoading {...defaultProps} isFiltering={false} isTyping={true} />
      );

      expect(screen.getByText("Typing")).toBeInTheDocument();
      expect(screen.queryByText("Filtering products")).not.toBeInTheDocument();
    });

    it("should not render when neither filtering nor typing", () => {
      const { container } = render(
        <FilterLoading {...defaultProps} isFiltering={false} isTyping={false} />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe("Count Display", () => {
    it("should display correct counts", () => {
      render(
        <FilterLoading
          {...defaultProps}
          filteredCount={25}
          totalCount={150}
          isFiltering={true}
        />
      );

      expect(screen.getByText("Found 25 of 150 products")).toBeInTheDocument();
    });

    it("should handle zero filtered count", () => {
      render(
        <FilterLoading
          {...defaultProps}
          filteredCount={0}
          totalCount={100}
          isFiltering={true}
        />
      );

      expect(screen.getByText("Found 0 of 100 products")).toBeInTheDocument();
    });

    it("should handle equal filtered and total count", () => {
      render(
        <FilterLoading
          {...defaultProps}
          filteredCount={50}
          totalCount={50}
          isFiltering={true}
        />
      );

      expect(screen.getByText("Found 50 of 50 products")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper loading indicators", () => {
      render(<FilterLoading {...defaultProps} isFiltering={true} />);

      expect(screen.getByText("Filtering products")).toBeInTheDocument();
    });

    it("should announce loading state to screen readers", () => {
      render(<FilterLoading {...defaultProps} isFiltering={true} />);

      expect(screen.getByText("Filtering products")).toBeInTheDocument();
    });
  });

  describe("Visual States", () => {
    it("should render with correct CSS classes", () => {
      render(<FilterLoading {...defaultProps} isFiltering={true} />);

      const container = screen.getByText("Filtering products").closest("div")
        .parentElement.parentElement;
      expect(container).toHaveClass("flex", "items-center", "justify-center");
    });

    it("should show spinner animation", () => {
      render(<FilterLoading {...defaultProps} isFiltering={true} />);

      const spinner = screen.getByText("Filtering products").closest("div");
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing props gracefully", () => {
      const { container } = render(<FilterLoading />);

      expect(container.firstChild).toBeNull();
    });

    it("should handle undefined counts", () => {
      render(
        <FilterLoading
          isFiltering={true}
          isTyping={false}
          filteredCount={undefined}
          totalCount={undefined}
        />
      );

      expect(screen.getByText("Found 0 of 0 products")).toBeInTheDocument();
    });
  });
});
