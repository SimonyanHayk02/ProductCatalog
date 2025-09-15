import { useState, useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner";

const FilterLoading = ({
  isFiltering = false,
  isTyping = false,
  filteredCount = 0,
  totalCount = 0,
}) => {
  const [loadingText, setLoadingText] = useState("Filtering products...");
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (isFiltering || isTyping) {
      const interval = setInterval(() => {
        setDots((prev) => {
          if (prev === "...") return "";
          return prev + ".";
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isFiltering, isTyping]);

  useEffect(() => {
    if (isTyping) {
      setLoadingText("Typing");
    } else if (isFiltering) {
      setLoadingText("Filtering products");
    }
  }, [isFiltering, isTyping]);

  if (!isFiltering && !isTyping) return null;

  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner
          type="clip"
          size="large"
          color="blue"
          text=""
          showText={false}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-blue-100/30 animate-ping"></div>
        </LoadingSpinner>

        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700 mb-1">
            {loadingText}
            {dots}
          </p>
          <p className="text-sm text-gray-500">
            {isTyping
              ? "Please wait while we process your input..."
              : `Found ${filteredCount} of ${totalCount} products`}
          </p>
        </div>

        {isTyping && (
          <div className="w-48 bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterLoading;
