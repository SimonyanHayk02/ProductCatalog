# Testing Guide

This project includes comprehensive unit tests for the filtering system using Jest and React Testing Library.

## Test Structure

### Unit Tests

- **`src/utils/__tests__/filterHelpers.test.js`** - Tests for utility functions (filtering, sorting, data extraction)
- **`src/hooks/__tests__/useProductFilters.test.js`** - Tests for the main filtering hook
- **`src/components/__tests__/SortPanel.test.jsx`** - Tests for the sort panel component
- **`src/components/__tests__/ProductsGrid.test.jsx`** - Tests for the products grid component
- **`src/components/__tests__/VirtualizedProductsGrid.test.jsx`** - Tests for the virtualized grid component

### Integration Tests

- **`src/__tests__/integration/filtering-system.test.js`** - Tests for the complete filtering and sorting integration

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

The tests cover:

### Filtering Functionality

- ✅ Search by product name (case-insensitive)
- ✅ Filter by category
- ✅ Filter by brand
- ✅ Filter by price range (min/max)
- ✅ Filter by minimum rating
- ✅ Multiple filters combined
- ✅ Empty filter states
- ✅ Edge cases and error handling

### Sorting Functionality

- ✅ Sort by name (A-Z)
- ✅ Sort by price (low to high)
- ✅ Sort by price (high to low)
- ✅ Sort by rating (highest first)
- ✅ Sort integration with filtering
- ✅ Sort state persistence

### Pagination & Virtualization

- ✅ Page navigation (next/previous)
- ✅ Direct page selection
- ✅ Page boundary handling
- ✅ Scroll-to-top functionality
- ✅ Virtualization threshold (50+ products)
- ✅ Pagination controls visibility

### Component Behavior

- ✅ Loading states (filtering/typing)
- ✅ Empty states
- ✅ Error handling
- ✅ Accessibility features
- ✅ User interactions

### Performance

- ✅ Memoization and optimization
- ✅ Debounced search
- ✅ Efficient re-renders
- ✅ State management

## Test Data

Tests use mock product data that includes:

- Various categories (Electronics, Clothing, Footwear, etc.)
- Different price ranges ($19.99 - $1299.99)
- Rating values (4.0 - 4.8)
- Different brands
- Edge cases (empty arrays, null values)

## Configuration

### Jest Configuration (`jest.config.js`)

- Uses jsdom environment for React testing
- Includes setup files for global mocks
- Configured for ES modules
- Coverage reporting enabled

### Setup Files (`src/setupTests.js`)

- Configures Jest DOM matchers
- Mocks browser APIs (scrollTo, requestAnimationFrame)
- Sets up global test utilities

### Babel Configuration (`babel.config.js`)

- Configured for React and modern JavaScript
- Supports JSX transformation
- Optimized for testing environment

## Mocking Strategy

- **Components**: Mocked child components to isolate testing
- **Hooks**: Mocked custom hooks for independent testing
- **Browser APIs**: Mocked window.scrollTo and animation frames
- **Utilities**: Mocked utility functions for controlled testing

## Best Practices

1. **Isolation**: Each test is independent and doesn't affect others
2. **Clarity**: Test names clearly describe what is being tested
3. **Coverage**: All major code paths are covered
4. **Maintainability**: Tests are easy to read and update
5. **Performance**: Tests run quickly and efficiently

## Debugging Tests

To debug failing tests:

1. Run specific test file: `npm test -- filterHelpers.test.js`
2. Use `--verbose` flag for detailed output
3. Add `console.log` statements in test files
4. Use `screen.debug()` in React component tests
5. Check test coverage report for uncovered code

## Adding New Tests

When adding new features to the filtering system:

1. Add unit tests for new utility functions
2. Add component tests for new UI elements
3. Add integration tests for new workflows
4. Update existing tests if behavior changes
5. Ensure test coverage remains high (>90%)

## Continuous Integration

Tests are designed to run in CI environments:

- No external dependencies
- Deterministic results
- Fast execution
- Clear error messages
- Comprehensive coverage reporting
