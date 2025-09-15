import {
  parseUrlParams,
  updateUrlParams,
  clearUrlParams,
  hasUrlParams,
} from "../urlParams";

const mockLocation = {
  search: "",
  href: "http://localhost:3000",
};

const mockHistory = {
  pushState: jest.fn(),
  replaceState: jest.fn(),
};

Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
  configurable: true,
});

Object.defineProperty(window, "history", {
  value: mockHistory,
  writable: true,
});

describe("urlParams", () => {
  beforeEach(() => {
    mockLocation.search = "";
    mockHistory.pushState.mockClear();
    mockHistory.replaceState.mockClear();
  });

  describe("parseUrlParams", () => {
    it("should parse URL parameters into filter object", () => {
      const mockURLSearchParams = jest.fn();
      mockURLSearchParams.mockImplementation((search) => ({
        get: (key) => {
          const params = {
            search: "",
            category: "Electronics",
            brand: "BrandA",
            minPrice: "100",
            maxPrice: "500",
            minRating: "",
            sortBy: "price",
          };
          return params[key] || "";
        },
      }));

      global.URLSearchParams = mockURLSearchParams;

      const result = parseUrlParams();

      expect(result).toEqual({
        search: "",
        category: "Electronics",
        brand: "BrandA",
        minPrice: "100",
        maxPrice: "500",
        minRating: "",
        sortBy: "price",
      });
    });

    it("should return default values for missing parameters", () => {
      const mockURLSearchParams = jest.fn();
      mockURLSearchParams.mockImplementation(() => ({
        get: (key) => {
          const params = {
            search: "",
            category: "Electronics",
            brand: "",
            minPrice: "",
            maxPrice: "",
            minRating: "",
            sortBy: "name",
          };
          return params[key] || "";
        },
      }));

      global.URLSearchParams = mockURLSearchParams;

      const result = parseUrlParams();

      expect(result).toEqual({
        search: "",
        category: "Electronics",
        brand: "",
        minPrice: "",
        maxPrice: "",
        minRating: "",
        sortBy: "name",
      });
    });

    it("should handle empty URL parameters", () => {
      const mockURLSearchParams = jest.fn();
      mockURLSearchParams.mockImplementation(() => ({
        get: () => "",
      }));

      global.URLSearchParams = mockURLSearchParams;

      const result = parseUrlParams();

      expect(result).toEqual({
        search: "",
        category: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        minRating: "",
        sortBy: "name",
      });
    });
  });

  describe("updateUrlParams", () => {
    it("should update URL with filter parameters", () => {
      const filters = {
        search: "wireless",
        category: "Electronics",
        brand: "BrandA",
        minPrice: "100",
        maxPrice: "500",
        minRating: "4",
        sortBy: "price",
      };

      updateUrlParams(filters);

      expect(mockHistory.pushState).toHaveBeenCalledWith(
        {},
        "",
        expect.stringContaining(
          "search=wireless&category=Electronics&brand=BrandA&minPrice=100&maxPrice=500&minRating=4&sortBy=price"
        )
      );
    });

    it("should skip empty values when updating URL", () => {
      const filters = {
        search: "",
        category: "Electronics",
        brand: "",
        minPrice: "100",
        maxPrice: "",
        minRating: "",
        sortBy: "name",
      };

      updateUrlParams(filters);

      expect(mockHistory.pushState).toHaveBeenCalledWith(
        {},
        "",
        expect.stringContaining("category=Electronics&minPrice=100")
      );
    });

    it("should use replaceState when replace is true", () => {
      const filters = { category: "Electronics" };

      updateUrlParams(filters, true);

      expect(mockHistory.replaceState).toHaveBeenCalled();
      expect(mockHistory.pushState).not.toHaveBeenCalled();
    });
  });

  describe("clearUrlParams", () => {
    it("should clear all URL parameters", () => {
      clearUrlParams();

      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        {},
        "",
        expect.stringContaining("http://localhost")
      );
    });
  });

  describe("hasUrlParams", () => {
    it("should return true when URL has parameters", () => {
      const mockURLSearchParams = jest.fn();
      mockURLSearchParams.mockImplementation(() => ({
        toString: () => "category=Electronics",
      }));

      global.URLSearchParams = mockURLSearchParams;

      expect(hasUrlParams()).toBe(true);
    });

    it("should return false when URL has no parameters", () => {
      const mockURLSearchParams = jest.fn();
      mockURLSearchParams.mockImplementation(() => ({
        toString: () => "",
      }));

      global.URLSearchParams = mockURLSearchParams;

      expect(hasUrlParams()).toBe(false);
    });
  });
});
