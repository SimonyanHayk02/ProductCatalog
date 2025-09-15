const Header = ({ filteredProducts = [] }) => {
  const productCount = filteredProducts?.length || 0;
  const productText = productCount === 1 ? "product found" : "products found";

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-9xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4 lg:py-6">
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent truncate">
                Product Catalog
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-0.5 sm:mt-1 font-medium hidden xs:block">
                Discover amazing products
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full shadow-lg">
              <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                {productCount} {productText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
