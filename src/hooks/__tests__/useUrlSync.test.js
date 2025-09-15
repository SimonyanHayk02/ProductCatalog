import { renderHook, act } from "@testing-library/react";
import { useUrlSync } from "../useUrlSync";
import {
  parseUrlParams,
  updateUrlParams,
  clearUrlParams,
} from "../../utils/urlParams";

jest.mock("../../utils/urlParams", () => ({
  parseUrlParams: jest.fn(),
  updateUrlParams: jest.fn(),
  clearUrlParams: jest.fn(),
}));

jest.mock("../useDebounce", () => ({
  useDebounce: jest.fn((value) => value),
}));

describe("useUrlSync", () => {
  const mockSetFilters = jest.fn();
  const mockClearFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    parseUrlParams.mockReturnValue({
      search: "",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      sortBy: "name",
    });
  });

  it("should load filters from URL on initial load", () => {
    const urlFilters = {
      search: "wireless",
      category: "Electronics",
      brand: "",
      minPrice: "100",
      maxPrice: "500",
      minRating: "",
      sortBy: "price",
    };

    parseUrlParams.mockReturnValue(urlFilters);

    const { result } = renderHook(() =>
      useUrlSync({}, mockSetFilters, mockClearFilters)
    );

    expect(parseUrlParams).toHaveBeenCalled();
    expect(mockSetFilters).toHaveBeenCalledWith(urlFilters);
  });

  it("should not set filters if URL has no meaningful parameters", () => {
    parseUrlParams.mockReturnValue({
      search: "",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      sortBy: "name",
    });

    renderHook(() => useUrlSync({}, mockSetFilters, mockClearFilters));

    expect(parseUrlParams).toHaveBeenCalled();
    expect(mockSetFilters).not.toHaveBeenCalled();
  });

  it("should update URL when filters change", () => {
    const filters = {
      search: "wireless",
      category: "Electronics",
      brand: "",
      minPrice: "100",
      maxPrice: "500",
      minRating: "",
      sortBy: "price",
    };

    renderHook(() => useUrlSync(filters, mockSetFilters, mockClearFilters));

    expect(updateUrlParams).toHaveBeenCalledWith(filters, true);
  });

  it("should provide clearFiltersAndUrl function", () => {
    const { result } = renderHook(() =>
      useUrlSync({}, mockSetFilters, mockClearFilters)
    );

    expect(typeof result.current.clearFiltersAndUrl).toBe("function");

    act(() => {
      result.current.clearFiltersAndUrl();
    });

    expect(mockClearFilters).toHaveBeenCalled();
    expect(clearUrlParams).toHaveBeenCalled();
  });

  it("should handle browser back/forward navigation", () => {
    const mockPopState = jest.fn();
    window.addEventListener = jest.fn((event, callback) => {
      if (event === "popstate") {
        mockPopState.mockImplementation(callback);
      }
    });
    window.removeEventListener = jest.fn();

    const urlFilters = {
      search: "headphones",
      category: "Electronics",
      brand: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      sortBy: "name",
    };

    renderHook(() => useUrlSync({}, mockSetFilters, mockClearFilters));

    act(() => {
      parseUrlParams.mockReturnValue(urlFilters);
      mockPopState();
    });

    expect(parseUrlParams).toHaveBeenCalled();
    expect(mockSetFilters).toHaveBeenCalledWith(urlFilters);
  });
});
