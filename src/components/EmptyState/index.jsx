const EmptyState = ({ onClearFilters }) => {
  return (
    <div
      data-testid="empty-state"
      className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center"
    >
      <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-12 h-12 text-gray-500"
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
      <h3 className="text-2xl font-bold text-gray-800 mb-3">
        No products found
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        We couldn't find any products matching your current filters. Try
        adjusting your search criteria.
      </p>
      <button
        onClick={onClearFilters}
        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default EmptyState;
