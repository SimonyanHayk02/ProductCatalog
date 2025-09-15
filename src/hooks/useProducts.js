import { useState, useMemo } from "react";
import productData from "../data/data.json";

export const useProducts = () => {
  const [products] = useState(productData);

  const productStats = useMemo(
    () => ({
      total: products.length,
      categories: [...new Set(products.map((product) => product.category))],
      brands: [...new Set(products.map((product) => product.brand))],
      priceRange: {
        min: Math.min(...products.map((product) => product.price)),
        max: Math.max(...products.map((product) => product.price)),
      },
    }),
    [products]
  );

  return {
    products,
    productStats,
  };
};
