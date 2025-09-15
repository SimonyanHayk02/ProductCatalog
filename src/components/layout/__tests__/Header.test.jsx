import { render, screen } from "@testing-library/react";
import Header from "../Header/index";

describe("Header Component", () => {
  const mockFilteredProducts = [
    { id: 1, name: "Product 1", category: "Electronics" },
    { id: 2, name: "Product 2", category: "Clothing" },
  ];

  it("should render header with product count", () => {
    render(<Header filteredProducts={mockFilteredProducts} />);

    expect(screen.getByText("Product Catalog")).toBeInTheDocument();
    expect(screen.getByText("2 products found")).toBeInTheDocument();
  });

  it("should render header with zero products", () => {
    render(<Header filteredProducts={[]} />);

    expect(screen.getByText("Product Catalog")).toBeInTheDocument();
    expect(screen.getByText("0 products found")).toBeInTheDocument();
  });

  it("should render header with single product", () => {
    render(<Header filteredProducts={[mockFilteredProducts[0]]} />);

    expect(screen.getByText("Product Catalog")).toBeInTheDocument();
    expect(screen.getByText("1 product found")).toBeInTheDocument();
  });

  it("should handle undefined filteredProducts", () => {
    render(<Header filteredProducts={undefined} />);

    expect(screen.getByText("Product Catalog")).toBeInTheDocument();
    expect(screen.getByText("0 products found")).toBeInTheDocument();
  });

  it("should handle null filteredProducts", () => {
    render(<Header filteredProducts={null} />);

    expect(screen.getByText("Product Catalog")).toBeInTheDocument();
    expect(screen.getByText("0 products found")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<Header filteredProducts={mockFilteredProducts} />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("should display correct styling classes", () => {
    const { container } = render(
      <Header filteredProducts={mockFilteredProducts} />
    );

    const headerElement = container.querySelector("header");
    expect(headerElement).toHaveClass(
      "bg-white/80",
      "backdrop-blur-md",
      "shadow-lg",
      "border-b",
      "border-white/20",
      "sticky",
      "top-0",
      "z-50"
    );
  });
});
