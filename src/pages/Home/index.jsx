import SortPanel from "../../components/SortPanel";
import Header from "../../components/layout/Header";
import FiltersSidebar from "../../components/FiltersSidebar";
import ProductsGrid from "../../components/ProductsGrid";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useProducts } from "../../hooks/useProducts";
import { useProductFilters } from "../../hooks/useProductFilters";
import { useMobileFilter } from "../../hooks/useMobileFilter";

const Home = () => {
  const { products, productStats } = useProducts();
  const {
    filters,
    filteredProducts,
    filterOptions,
    handleFilterChange,
    clearFilters,
    isFiltering,
    isTyping,
  } = useProductFilters(products);

  const { isMobileFilterOpen, toggleMobileFilter, closeMobileFilter } =
    useMobileFilter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header filteredProducts={filteredProducts} />

      <div className="max-w-9xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="lg:hidden mb-4 sm:mb-6">
          <button
            onClick={toggleMobileFilter}
            className="w-full bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg border border-white/20 p-3 sm:p-4 flex items-center justify-between hover:bg-white/90 transition-all duration-200 touch-manipulation"
            aria-label={`${isMobileFilterOpen ? "Close" : "Open"} filter menu`}
            aria-expanded={isMobileFilterOpen}
          >
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-white"
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
              <span className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                Filters
              </span>
              <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap flex items-center space-x-1">
                <span>({filteredProducts.length})</span>
                {(isFiltering || isTyping) && (
                  <LoadingSpinner
                    type="pulse"
                    size="small"
                    color="blue"
                    showText={false}
                    className="!space-y-0"
                  />
                )}
              </span>
            </div>
            <svg
              className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                isMobileFilterOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <FiltersSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              categories={filterOptions.categories}
              brands={filterOptions.brands}
              prices={[
                filterOptions.priceRange.min,
                filterOptions.priceRange.max,
              ]}
              isFiltering={isFiltering}
              isTyping={isTyping}
            />
          </div>

          {isMobileFilterOpen && (
            <div className="lg:hidden">
              <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={closeMobileFilter}
                aria-label="Close filter menu"
              />
              <div
                className="fixed inset-y-0 left-0 z-50 w-72 xs:w-80 max-w-[90vw] xs:max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out"
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-filter-title"
              >
                <div className="h-full overflow-y-auto">
                  <FiltersSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={() => {
                      clearFilters();
                      closeMobileFilter();
                    }}
                    categories={filterOptions.categories}
                    brands={filterOptions.brands}
                    prices={[
                      filterOptions.priceRange.min,
                      filterOptions.priceRange.max,
                    ]}
                    isFiltering={isFiltering}
                    isTyping={isTyping}
                    isMobile={true}
                    onClose={closeMobileFilter}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            <SortPanel
              filteredCount={filteredProducts.length}
              totalCount={productStats.total}
              sortBy={filters.sortBy}
              onSortChange={(value) => handleFilterChange("sortBy", value)}
              isFiltering={isFiltering || isTyping}
            />

            <ProductsGrid
              products={filteredProducts}
              onClearFilters={clearFilters}
              isFiltering={isFiltering}
              isTyping={isTyping}
              totalCount={productStats.total}
              useVirtualization={true}
              itemsPerPage={24}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
