import { memo, useMemo } from "react";
import ProductCard from "../ProductCard";
import EmptyState from "../EmptyState";
import FilterLoading from "../FilterLoading";
import VirtualizedProductsGrid from "../VirtualizedProductsGrid";

const ProductsGrid = memo(
  ({
    products,
    onClearFilters,
    isFiltering = false,
    isTyping = false,
    totalCount = 0,
    useVirtualization = false,
    itemsPerPage = 20,
  }) => {
    const shouldUseVirtualization = useMemo(() => {
      return useVirtualization && products && products.length > 50;
    }, [useVirtualization, products]);

    if ((!products || products.length === 0) && !isFiltering && !isTyping) {
      return <EmptyState onClearFilters={onClearFilters} />;
    }

    if (isFiltering || isTyping) {
      return (
        <FilterLoading
          isFiltering={isFiltering}
          isTyping={isTyping}
          filteredCount={products.length}
          totalCount={totalCount}
        />
      );
    }

    if (shouldUseVirtualization) {
      return (
        <VirtualizedProductsGrid
          products={products}
          onClearFilters={onClearFilters}
          isFiltering={isFiltering}
          isTyping={isTyping}
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
        />
      );
    }

    return (
      <div
        data-testid="products-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 xl:gap-12"
      >
        {products &&
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    );
  }
);

ProductsGrid.displayName = "ProductsGrid";

export default ProductsGrid;
