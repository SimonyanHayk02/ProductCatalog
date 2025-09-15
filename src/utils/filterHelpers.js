export const filterProducts = (products, filters) => {
  const hasFilters = Object.values(filters).some(
    (value) =>
      value !== null && value !== undefined && value !== "" && value !== "all"
  );

  if (!hasFilters) {
    return products;
  }

  const searchTerm = filters.search ? filters.search.toLowerCase() : null;
  const minPrice = filters.minPrice ? parseFloat(filters.minPrice) : null;
  const maxPrice = filters.maxPrice ? parseFloat(filters.maxPrice) : null;
  const minRating = filters.minRating ? parseFloat(filters.minRating) : null;

  return products.filter((product) => {
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm)) {
      return false;
    }

    if (filters.category && product.category !== filters.category) {
      return false;
    }

    if (filters.brand && product.brand !== filters.brand) {
      return false;
    }

    if (minPrice !== null && product.price < minPrice) {
      return false;
    }

    if (maxPrice !== null && product.price > maxPrice) {
      return false;
    }

    if (minRating !== null && product.rating < minRating) {
      return false;
    }

    return true;
  });
};

export const sortProducts = (products, sortBy) => {
  if (!sortBy || sortBy === "default") {
    return products;
  }

  const sorted = [...products];

  switch (sortBy) {
    case "name":
      sorted.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true })
      );
      break;
    case "price-low":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  return sorted;
};

export const getUniqueValues = (products, key) => {
  if (!products || products.length === 0) return [];

  const seen = new Set();
  const result = [];

  for (const product of products) {
    const value = product[key];
    if (value && !seen.has(value)) {
      seen.add(value);
      result.push(value);
    }
  }

  return result;
};

export const getPriceRange = (products) => {
  if (!products || products.length === 0) {
    return { min: 0, max: 0 };
  }

  let min = products[0].price;
  let max = products[0].price;

  for (let i = 1; i < products.length; i++) {
    const price = products[i].price;
    if (price < min) min = price;
    if (price > max) max = price;
  }

  return { min, max };
};
