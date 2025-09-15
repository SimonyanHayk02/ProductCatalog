import { renderHook, act } from "@testing-library/react";
import { useMobileFilter } from "../useMobileFilter";

describe("useMobileFilter", () => {
  it("should initialize with closed state", () => {
    const { result } = renderHook(() => useMobileFilter());

    expect(result.current.isMobileFilterOpen).toBe(false);
    expect(typeof result.current.toggleMobileFilter).toBe("function");
    expect(typeof result.current.closeMobileFilter).toBe("function");
  });

  it("should toggle mobile filter state", () => {
    const { result } = renderHook(() => useMobileFilter());

    expect(result.current.isMobileFilterOpen).toBe(false);

    act(() => {
      result.current.toggleMobileFilter();
    });

    expect(result.current.isMobileFilterOpen).toBe(true);

    act(() => {
      result.current.toggleMobileFilter();
    });

    expect(result.current.isMobileFilterOpen).toBe(false);
  });

  it("should close mobile filter", () => {
    const { result } = renderHook(() => useMobileFilter());

    // Open filter first
    act(() => {
      result.current.toggleMobileFilter();
    });

    expect(result.current.isMobileFilterOpen).toBe(true);

    // Close filter
    act(() => {
      result.current.closeMobileFilter();
    });

    expect(result.current.isMobileFilterOpen).toBe(false);
  });

  it("should close mobile filter when already closed", () => {
    const { result } = renderHook(() => useMobileFilter());

    expect(result.current.isMobileFilterOpen).toBe(false);

    act(() => {
      result.current.closeMobileFilter();
    });

    expect(result.current.isMobileFilterOpen).toBe(false);
  });

  it("should maintain state across multiple toggles", () => {
    const { result } = renderHook(() => useMobileFilter());

    // Multiple toggles
    act(() => {
      result.current.toggleMobileFilter();
    });
    expect(result.current.isMobileFilterOpen).toBe(true);

    act(() => {
      result.current.toggleMobileFilter();
    });
    expect(result.current.isMobileFilterOpen).toBe(false);

    act(() => {
      result.current.toggleMobileFilter();
    });
    expect(result.current.isMobileFilterOpen).toBe(true);

    act(() => {
      result.current.toggleMobileFilter();
    });
    expect(result.current.isMobileFilterOpen).toBe(false);
  });

  it("should provide function references", () => {
    const { result } = renderHook(() => useMobileFilter());

    expect(typeof result.current.toggleMobileFilter).toBe("function");
    expect(typeof result.current.closeMobileFilter).toBe("function");
  });

  it("should handle rapid state changes", () => {
    const { result } = renderHook(() => useMobileFilter());

    // Rapid toggles
    act(() => {
      result.current.toggleMobileFilter();
      result.current.toggleMobileFilter();
      result.current.toggleMobileFilter();
    });

    expect(result.current.isMobileFilterOpen).toBe(true);
  });

  it("should work with multiple hook instances", () => {
    const { result: result1 } = renderHook(() => useMobileFilter());
    const { result: result2 } = renderHook(() => useMobileFilter());

    expect(result1.current.isMobileFilterOpen).toBe(false);
    expect(result2.current.isMobileFilterOpen).toBe(false);

    act(() => {
      result1.current.toggleMobileFilter();
    });

    expect(result1.current.isMobileFilterOpen).toBe(true);
    expect(result2.current.isMobileFilterOpen).toBe(false);
  });
});
