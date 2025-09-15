import { useState, useEffect, useCallback } from "react";

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useDebouncedInput = (initialValue, delay = 500) => {
  const [value, setValue] = useState(initialValue);
  const [isTyping, setIsTyping] = useState(false);
  const debouncedValue = useDebounce(value, delay);

  useEffect(() => {
    setIsTyping(value !== debouncedValue);
  }, [value, debouncedValue]);

  const handleChange = useCallback((newValue) => {
    setValue(newValue);
  }, []);

  return {
    value,
    debouncedValue,
    isTyping,
    handleChange,
  };
};

export const useDebouncedCallback = (callback, delay, deps = []) => {
  const [timeoutId, setTimeoutId] = useState(null);

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() => {
        callback(...args);
      }, delay);

      setTimeoutId(newTimeoutId);
    },
    [callback, delay, ...deps]
  );

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return debouncedCallback;
};
