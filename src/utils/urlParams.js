export const parseUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);

  return {
    search: urlParams.get("search") || "",
    category: urlParams.get("category") || "",
    brand: urlParams.get("brand") || "",
    minPrice: urlParams.get("minPrice") || "",
    maxPrice: urlParams.get("maxPrice") || "",
    minRating: urlParams.get("minRating") || "",
    sortBy: urlParams.get("sortBy") || "name",
  };
};

export const updateUrlParams = (filters, replace = false) => {
  const url = new URL(window.location);
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "" && value !== "all") {
      params.set(key, value);
    }
  });

  url.search = params.toString();

  if (replace) {
    window.history.replaceState({}, "", url);
  } else {
    window.history.pushState({}, "", url);
  }
};

export const clearUrlParams = () => {
  const url = new URL(window.location);
  url.search = "";
  window.history.replaceState({}, "", url);
};

export const hasUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.toString().length > 0;
};
