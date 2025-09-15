import { render, screen, fireEvent } from "@testing-library/react";
import SortPanel from "../SortPanel";

const defaultProps = {
  filteredCount: 10,
  totalCount: 50,
  sortBy: "name",
  onSortChange: jest.fn(),
};

describe("SortPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render with correct product counts", () => {
    render(<SortPanel {...defaultProps} />);

    expect(screen.getByText("10 of 50 products")).toBeInTheDocument();
    expect(screen.getByText("Filtered results")).toBeInTheDocument();
  });

  it('should show "All products shown" when filtered count equals total count', () => {
    render(<SortPanel {...defaultProps} filteredCount={50} totalCount={50} />);

    expect(screen.getByText("All products shown")).toBeInTheDocument();
  });

  it("should render sort dropdown with correct options", () => {
    render(<SortPanel {...defaultProps} />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("name");

    expect(screen.getByText("Name A-Z")).toBeInTheDocument();
    expect(screen.getByText("Price: Low to High")).toBeInTheDocument();
    expect(screen.getByText("Price: High to Low")).toBeInTheDocument();
    expect(screen.getByText("Highest Rated")).toBeInTheDocument();
  });

  it("should call onSortChange when sort option is changed", () => {
    const mockOnSortChange = jest.fn();
    render(<SortPanel {...defaultProps} onSortChange={mockOnSortChange} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "price-low" } });

    expect(mockOnSortChange).toHaveBeenCalledWith("price-low");
  });

  it("should display correct selected sort option", () => {
    render(<SortPanel {...defaultProps} sortBy="price-high" />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("price-high");
  });

  it("should render with different sort options", () => {
    const sortOptions = ["name", "price-low", "price-high", "rating"];

    sortOptions.forEach((sortBy) => {
      const { unmount } = render(
        <SortPanel {...defaultProps} sortBy={sortBy} />
      );

      const select = screen.getByRole("combobox");
      expect(select).toHaveValue(sortBy);

      unmount();
    });
  });

  it("should have proper accessibility attributes", () => {
    render(<SortPanel {...defaultProps} />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();

    const label = screen.getByText("Sort by:");
    expect(label).toBeInTheDocument();
  });

  it("should handle zero filtered count", () => {
    render(<SortPanel {...defaultProps} filteredCount={0} />);

    expect(screen.getByText("0 of 50 products")).toBeInTheDocument();
    expect(screen.getByText("Filtered results")).toBeInTheDocument();
  });

  it("should handle large numbers", () => {
    render(
      <SortPanel {...defaultProps} filteredCount={1234} totalCount={5678} />
    );

    expect(screen.getByText("1234 of 5678 products")).toBeInTheDocument();
  });

  it("should render sort section", () => {
    render(<SortPanel {...defaultProps} />);

    const sortSection = screen.getByText("Sort by:");
    expect(sortSection).toBeInTheDocument();
  });

  it("should maintain focus after sort change", () => {
    const mockOnSortChange = jest.fn();
    render(<SortPanel {...defaultProps} onSortChange={mockOnSortChange} />);

    const select = screen.getByRole("combobox");
    select.focus();

    fireEvent.change(select, { target: { value: "rating" } });

    expect(select).toHaveFocus();
    expect(mockOnSortChange).toHaveBeenCalledWith("rating");
  });
});
