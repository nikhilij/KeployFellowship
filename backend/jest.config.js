// Jest configuration for ES modules
export default {
   testEnvironment: "node",
   collectCoverageFrom: ["**/*.js", "!**/node_modules/**", "!**/tests/**", "!**/coverage/**", "!jest.config.js"],
   coverageDirectory: "coverage",
   coverageReporters: ["text", "lcov", "html", "text-summary"],
   testMatch: ["**/tests/**/*.test.js"],
   verbose: false, // Set to false to reduce noise and let tabular reporter handle output
   detectOpenHandles: true,
   forceExit: true,
   testTimeout: 30000,
   // Add custom tabular reporter
   reporters: ["default", ["./tests/reporters/tabular-reporter.js", {}]],
};
