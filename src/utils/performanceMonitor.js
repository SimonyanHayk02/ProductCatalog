import { useCallback } from "react";

let filterMetrics = {
  totalFilters: 0,
  debouncedFilters: 0,
  immediateFilters: 0,
  averageFilterTime: 0,
  filterTimes: [],
};

export const logFilterPerformance = (startTime, wasDebounced = false) => {
  const endTime = performance.now();
  const filterTime = endTime - startTime;

  filterMetrics.totalFilters++;
  if (wasDebounced) {
    filterMetrics.debouncedFilters++;
  } else {
    filterMetrics.immediateFilters++;
  }

  filterMetrics.filterTimes.push(filterTime);

  if (filterMetrics.filterTimes.length > 100) {
    filterMetrics.filterTimes = filterMetrics.filterTimes.slice(-100);
  }

  filterMetrics.averageFilterTime =
    filterMetrics.filterTimes.reduce((sum, time) => sum + time, 0) /
    filterMetrics.filterTimes.length;
};

export const getFilterMetrics = () => ({
  ...filterMetrics,
  debounceEffectiveness:
    filterMetrics.totalFilters > 0
      ? (
          (filterMetrics.debouncedFilters / filterMetrics.totalFilters) *
          100
        ).toFixed(1) + "%"
      : "0%",
});

export const resetFilterMetrics = () => {
  filterMetrics = {
    totalFilters: 0,
    debouncedFilters: 0,
    immediateFilters: 0,
    averageFilterTime: 0,
    filterTimes: [],
  };
};

export const useFilterPerformance = (filterType) => {
  const startTiming = useCallback(() => performance.now(), []);

  const endTiming = useCallback(
    (startTime, wasDebounced = false) => {
      logFilterPerformance(filterType, startTime, wasDebounced);
    },
    [filterType]
  );

  return {
    startTiming,
    endTiming,
    getMetrics: getFilterMetrics,
    resetMetrics: resetFilterMetrics,
  };
};
