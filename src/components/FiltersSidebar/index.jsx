const FiltersSidebar = ({
  filters,
  onFilterChange,
  onClearFilters,
  categories,
  brands,
  prices,
  isTyping = false,
  isMobile = false,
  onClose = null,
}) => {
  return (
    <div className={`${isMobile ? "w-full h-full" : "lg:w-80 flex-shrink-0"}`}>
      <div
        className={`${
          isMobile
            ? "h-full bg-white"
            : "bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20"
        } p-6 ${isMobile ? "" : "sticky top-8"}`}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </div>
            <h2
              id="mobile-filter-title"
              className="text-lg font-semibold text-gray-800"
            >
              Filters
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {isMobile && onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 touch-manipulation"
                aria-label="Close filter menu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={onClearFilters}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-full text-sm font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-600 mb-3 flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search Products
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name..."
              value={filters.search}
              onChange={(e) => onFilterChange("search", e.target.value)}
              className={`w-full pl-10 pr-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-base ${
                isMobile ? "touch-manipulation" : ""
              } ${isTyping ? "border-blue-300 bg-blue-50" : ""}`}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-600 mb-3 flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange("category", e.target.value)}
            className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-sm font-normal"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-600 mb-3 flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            Brand
          </label>
          <select
            value={filters.brand}
            onChange={(e) => onFilterChange("brand", e.target.value)}
            className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-sm font-normal"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-600 mb-3 flex items-center">
            <svg
              className="w-6 h-6 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
            Price Range
          </label>
          <div className="mb-4">
            <div className="relative">
              <input
                type="range"
                min={Math.min(...prices)}
                max={Math.max(...prices)}
                value={filters.maxPrice || Math.max(...prices)}
                onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #f97316 0%, #f97316 ${
                    (((filters.maxPrice || Math.max(...prices)) -
                      Math.min(...prices)) /
                      (Math.max(...prices) - Math.min(...prices))) *
                    100
                  }%, #e5e7eb ${
                    (((filters.maxPrice || Math.max(...prices)) -
                      Math.min(...prices)) /
                      (Math.max(...prices) - Math.min(...prices))) *
                    100
                  }%, #e5e7eb 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>${Math.min(...prices)}</span>
                <span className="font-medium text-orange-600">
                  ${filters.maxPrice || Math.max(...prices)}
                </span>
                <span>${Math.max(...prices)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="relative">
              <input
                type="number"
                placeholder=" Min"
                value={filters.minPrice}
                onChange={(e) => onFilterChange("minPrice", e.target.value)}
                className={`w-full pl-8 pr-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-sm font-normal ${
                  isTyping ? "border-orange-300 bg-orange-50" : ""
                }`}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 font-medium text-sm">$</span>
              </div>
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder=" Max"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                className={`w-full pl-8 pr-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-sm font-normal ${
                  isTyping ? "border-orange-300 bg-orange-50" : ""
                }`}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 font-medium text-sm">$</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg p-3 text-center">
            <span className="text-sm font-medium text-orange-700">
              Range: ${Math.min(...prices)} - ${Math.max(...prices)}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-600 mb-3 flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            Minimum Rating
          </label>
          <select
            value={filters.minRating}
            onChange={(e) => onFilterChange("minRating", e.target.value)}
            className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-sm font-normal"
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars ⭐⭐⭐⭐</option>
            <option value="4.5">4.5+ Stars ⭐⭐⭐⭐⭐</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltersSidebar;
