import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));

    expect(result.current).toBe("initial");
  });

  it("should debounce value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    expect(result.current).toBe("initial");

    // Change value
    rerender({ value: "updated", delay: 500 });

    // Value should not change immediately
    expect(result.current).toBe("initial");

    // Fast forward time by 250ms (less than delay)
    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(result.current).toBe("initial");

    // Fast forward time by another 250ms (total 500ms)
    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(result.current).toBe("updated");
  });

  it("should reset debounce timer on rapid changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    expect(result.current).toBe("initial");

    // Rapid changes
    rerender({ value: "change1", delay: 500 });
    act(() => {
      jest.advanceTimersByTime(250);
    });

    rerender({ value: "change2", delay: 500 });
    act(() => {
      jest.advanceTimersByTime(250);
    });

    rerender({ value: "change3", delay: 500 });
    act(() => {
      jest.advanceTimersByTime(250);
    });

    // Value should still be initial
    expect(result.current).toBe("initial");

    // Complete the delay
    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(result.current).toBe("change3");
  });

  it("should handle different delay values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 1000 } }
    );

    rerender({ value: "updated", delay: 1000 });

    // Should not update after 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe("initial");

    // Should update after 1000ms
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe("updated");
  });

  it("should handle zero delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 0 } }
    );

    rerender({ value: "updated", delay: 0 });

    // Even with zero delay, it still uses setTimeout, so we need to advance timers
    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current).toBe("updated");
  });

  it("should handle undefined and null values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 100 } }
    );

    rerender({ value: undefined, delay: 100 });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBeUndefined();

    rerender({ value: null, delay: 100 });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBeNull();
  });

  it("should clean up timer on unmount", () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    const { unmount } = renderHook(() => useDebounce("test", 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it("should handle rapid mount/unmount cycles", () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    rerender({ value: "updated", delay: 500 });

    // Unmount before delay completes
    unmount();

    // Remount
    const { result: newResult } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "new", delay: 500 } }
    );

    expect(newResult.current).toBe("new");
  });
});
