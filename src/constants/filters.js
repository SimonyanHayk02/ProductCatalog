export const FILTER_KEYS = {
  CATEGORY: "category",
  BRAND: "brand",
  MIN_PRICE: "minPrice",
  MAX_PRICE: "maxPrice",
  MIN_RATING: "minRating",
  SEARCH: "search",
  SORT_BY: "sortBy",
};

export const SORT_OPTIONS = {
  NAME: "name",
  PRICE_LOW: "price-low",
  PRICE_HIGH: "price-high",
  RATING: "rating",
};

export const DEFAULT_FILTERS = {
  [FILTER_KEYS.CATEGORY]: "",
  [FILTER_KEYS.BRAND]: "",
  [FILTER_KEYS.MIN_PRICE]: "",
  [FILTER_KEYS.MAX_PRICE]: "",
  [FILTER_KEYS.MIN_RATING]: "",
  [FILTER_KEYS.SEARCH]: "",
  [FILTER_KEYS.SORT_BY]: SORT_OPTIONS.NAME,
};

export const RATING_OPTIONS = [
  { value: "", label: "Any Rating" },
  { value: "4", label: "4+ Stars ⭐⭐⭐⭐" },
  { value: "4.5", label: "4.5+ Stars ⭐⭐⭐⭐⭐" },
];
