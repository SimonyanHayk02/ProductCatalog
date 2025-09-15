import { memo } from "react";
import ProductImage from "../ProductImage";

const ProductCard = memo(({ product }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/30 overflow-hidden group hover:shadow-2xl sm:hover:shadow-3xl hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-500 hover:border-blue-200">
      <div className="relative h-56 sm:h-64 lg:h-72 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        <div className="absolute top-5 left-5">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm tracking-wide">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            {product.brand}
          </span>
          <div className="flex items-center bg-gray-50 rounded-full px-3 py-1.5">
            <div className="flex items-center mr-2">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {product.rating}
            </span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-800 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 min-h-[3rem] sm:min-h-[3.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              ${product.price}
            </span>
            <span className="text-xs text-gray-500 font-normal">per item</span>
          </div>
          <div className="flex flex-col items-end">
            <button
              disabled
              className="bg-gray-300 text-gray-500 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm cursor-not-allowed flex items-center space-x-1 sm:space-x-1.5"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 3.6a.8.8 0 00.8 1.2h9m-6 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
              <span>Add</span>
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center font-medium">
              <svg
                className="w-3.5 h-3.5 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              will be available in 2 days
            </span>
            <span className="flex items-center font-medium">
              <svg
                className="w-3.5 h-3.5 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Fast Delivery
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
