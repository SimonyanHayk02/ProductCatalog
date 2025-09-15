# 🛍️ Modern Product Catalog

A high-performance, responsive React-based product catalog with advanced filtering, sorting, and virtualization capabilities. Built with modern web technologies and comprehensive test coverage.


## ✨ Features

### 🔍 Advanced Filtering System

- **Real-time Search**: Debounced search with instant results
- **Category Filtering**: Filter products by categories
- **Brand Filtering**: Filter by product brands
- **Price Range**: Min/max price filtering
- **Rating Filter**: Filter by minimum rating
- **Combined Filters**: Multiple filters work together seamlessly

### 📊 Smart Sorting

- **Name**: Alphabetical sorting (A-Z)
- **Price**: Low to High / High to Low
- **Rating**: Highest rated first
- **Real-time**: Sorting updates instantly with filters

### ⚡ Performance Optimizations

- **Virtualization**: Efficient rendering for 50+ products
- **Pagination**: Smooth page navigation with scroll-to-top
- **Debounced Search**: Optimized search performance
- **Memoization**: React.memo for component optimization
- **Lazy Loading**: Efficient data loading

### 📱 Responsive Design

- **Mobile-First**: Optimized for all screen sizes
- **Adaptive Layout**: Responsive grid system
- **Touch-Friendly**: Mobile-optimized interactions
- **Progressive Enhancement**: Works on all devices

### 🧪 Comprehensive Testing

- **276 Tests**: Complete test coverage
- **70%+ Coverage**: Thorough testing of all features
- **Unit Tests**: Component and hook testing
- **Integration Tests**: End-to-end functionality
- **Real-time Testing**: Filter and sort behavior validation

## 🛠️ Tech Stack

### Core Technologies

- **React 19.1.1** - Modern React with latest features
- **Vite 7.1.2** - Fast build tool and dev server
- **React Router 7.9.1** - Client-side routing
- **Tailwind CSS 3.4.0** - Utility-first CSS framework

### Development Tools

- **Jest 30.1.3** - Testing framework
- **React Testing Library 16.3.0** - Component testing
- **ESLint 9.33.0** - Code linting
- **Babel** - JavaScript transpilation
- **Sass** - CSS preprocessing

### Additional Libraries

- **Axios 1.12.2** - HTTP client
- **React Spinners 0.17.0** - Loading animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/product-catalog.git
   cd product-catalog
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Code Quality
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── EmptyState/      # No products found state
│   ├── FilterLoading/   # Loading state for filters
│   ├── FiltersSidebar/  # Filter controls sidebar
│   ├── ProductCard/     # Individual product card
│   ├── ProductsGrid/    # Products grid container
│   ├── SortPanel/       # Sorting controls
│   └── VirtualizedProductsGrid/ # Virtualized grid
├── hooks/               # Custom React hooks
│   ├── useDebounce.js   # Search debouncing
│   ├── useMobileFilter.js # Mobile filter state
│   ├── useProductFilters.js # Main filtering logic
│   └── useProducts.js   # Product data management
├── utils/               # Utility functions
│   ├── filterHelpers.js # Filtering and sorting logic
│   └── performanceMonitor.js # Performance utilities
├── constants/           # Application constants
│   └── filters.js       # Filter configuration
├── data/               # Static data
│   └── data.json       # Product data
├── pages/              # Page components
│   ├── Home/           # Main catalog page
│   └── NotFound/       # 404 page
└── __tests__/          # Test files
    ├── comprehensive-filtering.test.js
    ├── real-time-updates.test.js
    ├── no-products-found.test.js
    └── integration/    # Integration tests
```

## 🎯 Key Components

### ProductsGrid

The main component that intelligently switches between regular and virtualized rendering based on product count.

```jsx
<ProductsGrid
  products={filteredProducts}
  onClearFilters={clearFilters}
  isFiltering={isFiltering}
  isTyping={isTyping}
  totalCount={productStats.total}
  useVirtualization={true}
  itemsPerPage={24}
/>
```

### useProductFilters Hook

Central hook managing all filtering and sorting logic with real-time updates.

```jsx
const {
  filters,
  filteredProducts,
  filterOptions,
  handleFilterChange,
  clearFilters,
  isFiltering,
  isTyping,
} = useProductFilters(products);
```

### VirtualizedProductsGrid

Performance-optimized grid for large datasets with pagination and scroll-to-top functionality.

## 🧪 Testing

The project includes comprehensive testing with 276 tests covering:

- **Component Rendering**: All UI components render correctly
- **Filter Logic**: Complete filtering functionality testing
- **Real-time Updates**: Debouncing and instant updates
- **No Products Found**: Empty state scenarios
- **Sorting Functionality**: All sorting options
- **Hook Behavior**: Custom hook functionality
- **Integration**: End-to-end user workflows

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage

- **Statements**: 70.29%
- **Branches**: 72.4%
- **Functions**: 65.76%
- **Lines**: 69.56%

## 🎨 Customization

### Adding New Filters

1. Update `src/constants/filters.js` with new filter keys
2. Add filter UI in `FiltersSidebar` component
3. Update `useProductFilters` hook logic
4. Add tests for new filter functionality

### Styling

The project uses Tailwind CSS for styling. Customize the design by:

- Modifying Tailwind classes in components
- Adding custom CSS in component files
- Updating the Tailwind configuration

### Data Structure

Products follow this structure:

```json
{
  "id": 1,
  "name": "Product Name",
  "category": "Category",
  "brand": "Brand",
  "price": 99.99,
  "rating": 4.5,
  "imageUrl": "https://example.com/image.jpg"
}
```

## 🚀 Performance Features

### Virtualization

- Automatically enabled for 50+ products
- Efficient rendering of large datasets
- Smooth scrolling and pagination

### Debounced Search

- 500ms debounce delay for search input
- Prevents excessive API calls
- Smooth user experience

### Optimized Re-renders

- React.memo for component optimization
- useMemo for expensive calculations
- useCallback for stable function references

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the fast build tool
- Tailwind CSS for the utility-first approach
- Testing Library for the testing utilities
- All contributors and users

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Check the documentation
- Review the test files for usage examples

---

**Made with ❤️ using React and modern web technologies**
