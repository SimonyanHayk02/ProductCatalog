import {
  filterProducts,
  sortProducts,
  getUniqueValues,
  getPriceRange,
} from "../filterHelpers";

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

describe("filterHelpers", () => {
  describe("filterProducts", () => {
    it("should return all products when no filters are applied", () => {
      const filters = {
        search: "",
        category: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        minRating: "",
      };

      const result = filterProducts(mockProducts, filters);
      expect(result).toEqual(mockProducts);
    });

    it("should filter by search term", () => {
      const filters = {
        search: "headphones",
        category: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        minRating: "",
      };

      const result = filterProducts(mockProducts, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Wireless Headphones");
    });

    it("should filter by category", () => {
      const filters = {
        search: "",
        category: "Electronics",
        brand: "",
        minPrice: "",
        maxPrice: "",
        minRating: "",
      };

      const result = filterProducts(mockProducts, filters);
      expect(result).toHaveLength(3);
      expect(
        result.every((product) => product.category === "Electronics")
      ).toBe(true);
    });

    it("should filter by brand", () => {
      const filters = {
        search: "",
        category: "",
        brand: "Brand A",
        minPrice: "",
        maxPrice: "",
        minRating: "",
      };

      const result = filterProducts(mockProducts, filters);
      expect(result).toHaveLength(1);
      expect(result[0].brand).toBe("Brand A");
    });

    it("should filter by minimum price", () => {
      const filters = {
        search: "",
        category: "",
        brand: "",
        minPrice: "100",
        maxPrice: "",
        minRating: "",
      };

      const result = filterProducts(mockProducts, filters);
      expect(result).toHaveLength(2);
      expect(result.every((product) => product.price >= 100)).toBe(true);
    });

    it("should filter by maximum price", () => {
      const filters = {
        search: "",
        category: "",
        brand: "",
        minPrice: "",
        maxPrice: "100",
        minRating: "",
      };

      const result = filterProducts(mockProducts, filters);
      expect(result).toHaveLength(3);
      expect(result.every((product) => product.price <= 100)).toBe(true);
    });

    it("should filter by minimum rating", () => {
      const filters = {
        search: "",
        category: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        minRating: "4.5",
      };

      const result = filterProducts(mockProducts, filters);
      expect(result).toHaveLength(3);
      expect(result.every((product) => product.rating >= 4.5)).toBe(true);
    });

    it("should apply multiple filters simultaneously", () => {
      const filters = {
        search: "",
        category: "Electronics",
        brand: "",
        minPrice: "50",
        maxPrice: "200",
        minRating: "4.0",
      };

      const result = filterProducts(mockProducts, filters);
      expect(result).toHaveLength(1);
      expect(
        result.every(
          (product) =>
            product.category === "Electronics" &&
            product.price >= 50 &&
            product.price <= 200 &&
            product.rating >= 4.0
        )
      ).toBe(true);
    });

    it("should handle case-insensitive search", () => {
      const filters = {
        search: "WIRELESS",
        category: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        minRating: "",
      };

      const result = filterProducts(mockProducts, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Wireless Headphones");
    });

    it("should return empty array when no products match filters", () => {
      const filters = {
        search: "nonexistent",
        category: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        minRating: "",
      };

      const result = filterProducts(mockProducts, filters);
      expect(result).toHaveLength(0);
    });
  });

  describe("sortProducts", () => {
    it("should return products unchanged when sortBy is default", () => {
      const result = sortProducts(mockProducts, "default");
      expect(result).toEqual(mockProducts);
    });

    it("should sort by name A-Z", () => {
      const result = sortProducts(mockProducts, "name");
      const names = result.map((product) => product.name);
      expect(names).toEqual([
        "Bluetooth Speaker",
        "Leather Jacket",
        "Running Shoes",
        "Smartphone",
        "Wireless Headphones",
      ]);
    });

    it("should sort by price low to high", () => {
      const result = sortProducts(mockProducts, "price-low");
      const prices = result.map((product) => product.price);
      expect(prices).toEqual([49.99, 59.99, 99.99, 199.99, 499.99]);
    });

    it("should sort by price high to low", () => {
      const result = sortProducts(mockProducts, "price-high");
      const prices = result.map((product) => product.price);
      expect(prices).toEqual([499.99, 199.99, 99.99, 59.99, 49.99]);
    });

    it("should sort by rating highest first", () => {
      const result = sortProducts(mockProducts, "rating");
      const ratings = result.map((product) => product.rating);
      expect(ratings).toEqual([4.8, 4.7, 4.5, 4.2, 4.0]);
    });

    it("should handle empty array", () => {
      const result = sortProducts([], "name");
      expect(result).toEqual([]);
    });

    it("should handle single product", () => {
      const singleProduct = [mockProducts[0]];
      const result = sortProducts(singleProduct, "name");
      expect(result).toEqual(singleProduct);
    });
  });

  describe("getUniqueValues", () => {
    it("should return unique categories", () => {
      const result = getUniqueValues(mockProducts, "category");
      expect(result).toEqual(["Electronics", "Footwear", "Clothing"]);
    });

    it("should return unique brands", () => {
      const result = getUniqueValues(mockProducts, "brand");
      expect(result).toEqual([
        "Brand A",
        "Brand B",
        "Brand C",
        "Brand D",
        "Brand E",
      ]);
    });

    it("should handle empty array", () => {
      const result = getUniqueValues([], "category");
      expect(result).toEqual([]);
    });

    it("should handle null/undefined values", () => {
      const productsWithNulls = [
        { id: 1, category: "Electronics" },
        { id: 2, category: null },
        { id: 3, category: "Clothing" },
        { id: 4, category: undefined },
      ];

      const result = getUniqueValues(productsWithNulls, "category");
      expect(result).toEqual(["Electronics", "Clothing"]);
    });
  });

  describe("getPriceRange", () => {
    it("should return correct price range", () => {
      const result = getPriceRange(mockProducts);
      expect(result).toEqual({ min: 49.99, max: 499.99 });
    });

    it("should handle empty array", () => {
      const result = getPriceRange([]);
      expect(result).toEqual({ min: 0, max: 0 });
    });

    it("should handle single product", () => {
      const singleProduct = [mockProducts[0]];
      const result = getPriceRange(singleProduct);
      expect(result).toEqual({ min: 99.99, max: 99.99 });
    });

    it("should handle products with same price", () => {
      const samePriceProducts = [
        { id: 1, price: 100 },
        { id: 2, price: 100 },
        { id: 3, price: 100 },
      ];

      const result = getPriceRange(samePriceProducts);
      expect(result).toEqual({ min: 100, max: 100 });
    });
  });
});
