import { render, screen } from "@testing-library/react";
import ProductCard from "../ProductCard";

const mockProduct = {
  id: 1,
  name: "Wireless Headphones",
  category: "Electronics",
  brand: "Brand A",
  price: 99.99,
  rating: 4.5,
  imageUrl: "https://example.com/images/headphones.jpg",
};

describe("ProductCard", () => {
  it("should render product information correctly", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
    expect(screen.getByText("Brand A")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("should render product image with correct attributes", () => {
    render(<ProductCard product={mockProduct} />);

    const productImage = screen.getByAltText("Wireless Headphones");
    expect(productImage).toBeInTheDocument();
    expect(productImage).toHaveAttribute(
      "src",
      "https://example.com/images/headphones.jpg"
    );
  });

  it("should render star rating correctly", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("should handle products with different price formats", () => {
    const expensiveProduct = {
      ...mockProduct,
      price: 1299.99,
    };

    render(<ProductCard product={expensiveProduct} />);

    expect(screen.getByText("$1299.99")).toBeInTheDocument();
  });

  it("should handle products with different rating values", () => {
    const lowRatedProduct = {
      ...mockProduct,
      rating: 3.2,
    };

    render(<ProductCard product={lowRatedProduct} />);

    expect(screen.getByText("3.2")).toBeInTheDocument();
  });

  it("should handle products with missing image", () => {
    const productWithoutImage = {
      ...mockProduct,
      imageUrl: null,
    };

    render(<ProductCard product={productWithoutImage} />);

    expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<ProductCard product={mockProduct} />);

    const productImage = screen.getByAltText("Wireless Headphones");
    expect(productImage).toHaveAttribute("alt", "Wireless Headphones");
    expect(productImage).toHaveAttribute(
      "src",
      "https://example.com/images/headphones.jpg"
    );
  });

  it("should render with correct CSS classes", () => {
    render(<ProductCard product={mockProduct} />);

    const productCard = screen
      .getByText("Wireless Headphones")
      .closest("div").parentElement;
    expect(productCard).toHaveClass(
      "bg-white/90",
      "backdrop-blur-sm",
      "rounded-2xl"
    );
  });
});
