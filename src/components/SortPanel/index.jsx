const SortPanel = ({ filteredCount, totalCount, sortBy, onSortChange }) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full shadow-lg">
            <span className="text-sm font-bold">
              {filteredCount} of {totalCount} products
            </span>
          </div>
          <div className="text-sm text-gray-600 font-medium flex items-center space-x-2">
            <span>
              {filteredCount === totalCount
                ? "All products shown"
                : "Filtered results"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-indigo-500"
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
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md font-medium w-full sm:min-w-[200px] sm:w-auto"
          >
            <option value="name">Name A-Z</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SortPanel;
