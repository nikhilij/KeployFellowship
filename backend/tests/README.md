# Books API Testing Suite

This directory contains comprehensive tests for the Books API server, including unit tests, integration tests, and API tests.

## 📁 Test Structure

```
tests/
├── unit/                 # Unit tests for individual components
│   ├── book.model.test.js      # Book model unit tests
│   └── utils.test.js           # Utility functions unit tests
├── integration/          # Integration tests for database operations
│   └── database.test.js        # Database integration tests
├── api/                  # API endpoint tests
│   ├── books.api.test.js       # Books API endpoint tests
│   └── e2e.test.js            # End-to-end workflow tests
├── fixtures/             # Test data fixtures
│   └── books.js               # Sample book data
├── helpers/              # Test helper functions
│   └── database.js            # Database test utilities
└── setup.js              # Global test setup
```

## 🧪 Test Types

### Unit Tests

- **Book Model Tests**: Test MongoDB model validation, queries, updates, and deletions
- **Utility Tests**: Test validation helpers, query builders, and error handling utilities
- **Coverage**: Targets individual functions and methods in isolation

### Integration Tests

- **Database Integration**: Test interaction between app and MongoDB
- **CRUD Operations**: Test complete database operation cycles
- **Performance Tests**: Test with larger datasets and concurrent operations
- **Transaction Simulation**: Test concurrent operations and error handling

### API Tests

- **Endpoint Testing**: Test all REST API endpoints (GET, POST, PUT, DELETE)
- **Error Handling**: Test various error scenarios and edge cases
- **Input Validation**: Test request validation and sanitization
- **Response Validation**: Test response formats and status codes
- **End-to-End Workflows**: Test complete user workflows and scenarios

## 🛠️ Testing Technologies

- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertion library for API testing
- **MongoDB Memory Server**: In-memory MongoDB for testing
- **ESM Support**: Full ES modules support in tests

## 📊 Test Coverage

The test suite aims for:

- **Unit Tests**: 70%+ code coverage
- **Integration Tests**: Complete database operation coverage
- **API Tests**: 100% endpoint coverage
- **Error Scenarios**: Comprehensive error handling coverage

## 🚀 Running Tests

### All Tests

```bash
npm test
```

### Test Categories

```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# API tests only
npm run test:api

# With coverage report
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### Individual Test Files

```bash
# Run specific test file
npx jest tests/unit/book.model.test.js

# Run with verbose output
npx jest --verbose tests/api/books.api.test.js
```

## 📈 Coverage Reports

Coverage reports are generated in the `coverage/` directory:

- **HTML Report**: `coverage/lcov-report/index.html`
- **Text Summary**: Displayed in terminal
- **LCOV Format**: `coverage/lcov.info`

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`)

- ESM support enabled
- MongoDB Memory Server integration
- Coverage collection settings
- Test timeout configurations

### Environment Variables

Tests use the following environment variables:

- `NODE_ENV=test`: Set automatically during test runs
- `MONGODB_URI`: Overridden by MongoDB Memory Server

## 📝 Test Data

### Fixtures (`tests/fixtures/books.js`)

Provides reusable test data:

- `validBook`: Standard valid book object
- `anotherValidBook`: Second valid book for multi-book tests
- `invalidBooks`: Various invalid book objects for error testing
- `booksArray`: Array of books for bulk operations

### Database Helpers (`tests/helpers/database.js`)

Utility functions for test database management:

- `setupTestDB()`: Initialize in-memory MongoDB
- `teardownTestDB()`: Clean up test database
- `clearTestDB()`: Clear all collections
- `seedTestData()`: Insert test data

## 🧩 Test Patterns

### Test Structure

```javascript
describe("Feature", () => {
   beforeAll(async () => {
      // Setup test environment
      await setupTestDB();
   });

   afterAll(async () => {
      // Clean up test environment
      await teardownTestDB();
   });

   beforeEach(async () => {
      // Reset state before each test
      await clearTestDB();
   });

   test("should perform expected behavior", async () => {
      // Arrange
      const testData = validBook;

      // Act
      const result = await performAction(testData);

      // Assert
      expect(result).toMatchExpectedResult();
   });
});
```

### API Test Pattern

```javascript
test("should create book with valid data", async () => {
   const response = await request(app).post("/api/books").send(validBook).expect(201);

   expect(response.body).toHaveProperty("_id");
   expect(response.body.title).toBe(validBook.title);
});
```

## 🔍 Test Best Practices

### 1. Isolation

- Each test is independent and can run in any order
- Database is cleared between tests
- No shared state between tests

### 2. Clarity

- Descriptive test names that explain what is being tested
- Clear arrange-act-assert structure
- Meaningful assertions with specific expectations

### 3. Coverage

- Test both success and failure scenarios
- Include edge cases and boundary conditions
- Test error handling and validation

### 4. Performance

- Use in-memory database for fast execution
- Parallel test execution where possible
- Timeout protection for long-running tests

### 5. Maintainability

- Reusable test fixtures and helpers
- DRY principle applied to test setup
- Clear test organization and naming

## 🐛 Debugging Tests

### Running Single Test

```bash
npx jest --testNamePattern="should create a new book"
```

### Debug Mode

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Verbose Output

```bash
npm test -- --verbose
```

### Coverage Analysis

```bash
npm run test:coverage
# Open coverage/lcov-report/index.html in browser
```

## 📋 Test Checklist

- [ ] All endpoints tested (GET, POST, PUT, DELETE)
- [ ] Success scenarios covered
- [ ] Error scenarios covered
- [ ] Input validation tested
- [ ] Database operations tested
- [ ] Edge cases handled
- [ ] Performance considerations
- [ ] Error handling verified
- [ ] Response formats validated
- [ ] Status codes correct

## 🚨 Common Issues

### MongoDB Connection

If tests fail with MongoDB connection errors:

1. Ensure MongoDB Memory Server is properly installed
2. Check if ports are available
3. Verify Jest configuration for async operations

### ES Modules

If you encounter ES module errors:

1. Ensure `"type": "module"` in package.json
2. Use `.js` extensions in imports
3. Check Jest configuration for ESM support

### Test Timeouts

If tests timeout:

1. Increase timeout in Jest configuration
2. Check for unhandled promises
3. Ensure proper cleanup in afterAll hooks

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
