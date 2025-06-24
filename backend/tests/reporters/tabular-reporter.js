export default class TabularTestReporter {
   constructor(globalConfig, options) {
      this._globalConfig = globalConfig;
      this._options = options;
      this.testResults = [];
   }

   onTestResult(test, testResult) {
      this.testResults.push({
         testFilePath: testResult.testFilePath,
         numPassingTests: testResult.numPassingTests,
         numFailingTests: testResult.numFailingTests,
         numTodoTests: testResult.numTodoTests,
         testResults: testResult.testResults,
         perfStats: testResult.perfStats,
      });
   }

   onRunComplete(contexts, results) {
      console.log("\n");
      console.log("═".repeat(120));
      console.log("📊 TEST RESULTS SUMMARY TABLE");
      console.log("═".repeat(120)); // Test Files Summary Table
      console.log("\n📁 TEST FILES SUMMARY");
      console.log("─".repeat(120));
      console.log("│ Test File                          │ Passed │ Failed │ Total │ Duration │ Status   │");
      console.log("├────────────────────────────────────┼────────┼────────┼───────┼──────────┼──────────┤");

      this.testResults.forEach((result) => {
         // Extract just the filename from the path
         const filePathParts = result.testFilePath.split(/[\\\/]/);
         const rawFileName = filePathParts.pop();

         // Ensure the filename fits within the column width
         let fileName;
         if (rawFileName.length > 34) {
            fileName = rawFileName.substring(0, 31) + "...";
         } else {
            fileName = rawFileName;
         }
         fileName = fileName.padEnd(34);

         const passed = String(result.numPassingTests).padStart(6);
         const failed = String(result.numFailingTests).padStart(6);
         const total = String(result.numPassingTests + result.numFailingTests).padStart(5);
         const duration = `${result.perfStats.runtime}ms`.padStart(8);
         const status = (result.numFailingTests === 0 ? "✅ PASS" : "❌ FAIL").padEnd(8);

         console.log(`│ ${fileName} │ ${passed} │ ${failed} │ ${total} │ ${duration} │ ${status} │`);
      });

      console.log("└────────────────────────────────────┴────────┴────────┴───────┴──────────┴──────────┘"); // Detailed Test Results Table
      console.log("\n🧪 DETAILED TEST RESULTS");
      console.log("─".repeat(120));
      console.log("│ Test Category                      │ Test Name                           │ Status │ Duration │");
      console.log("├────────────────────────────────────┼─────────────────────────────────────┼────────┼──────────┤");

      this.testResults.forEach((result) => {
         const category = this.getTestCategory(result.testFilePath);

         result.testResults.forEach((test) => {
            const categoryName = category.padEnd(34);
            // Ensure the test name doesn't overflow the column width
            // If it's too long, truncate it and add ellipsis
            const testNameVal = test.title || "Unknown";
            let testName;
            if (testNameVal.length > 35) {
               testName = testNameVal.substring(0, 32) + "...";
            } else {
               testName = testNameVal;
            }
            testName = testName.padEnd(35);

            const status = (
               test.status === "passed" ? "✅ PASS" : test.status === "failed" ? "❌ FAIL" : "⏭️ SKIP"
            ).padEnd(6);
            const duration = `${test.duration || 0}ms`.padStart(8);

            console.log(`│ ${categoryName} │ ${testName} │ ${status} │ ${duration} │`);
         });
      });

      console.log("└────────────────────────────────────┴─────────────────────────────────────┴────────┴──────────┘");

      // Overall Statistics Table
      console.log("\n📈 OVERALL STATISTICS");
      console.log("─".repeat(80));
      console.log("│ Metric                    │ Count │ Percentage │ Status      │");
      console.log("├───────────────────────────┼───────┼────────────┼─────────────┤");

      const totalTests = results.numTotalTests;
      const passedTests = results.numPassedTests;
      const failedTests = results.numFailedTests;
      const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : "0.0";

      console.log(
         `│ Total Test Suites         │ ${String(results.numTotalTestSuites).padStart(5)} │ ${"100.0%".padStart(10)} │ ${"ℹ️  INFO".padEnd(11)} │`
      );
      console.log(
         `│ Passed Test Suites        │ ${String(results.numPassedTestSuites).padStart(5)} │ ${(results.numTotalTestSuites > 0 ? ((results.numPassedTestSuites / results.numTotalTestSuites) * 100).toFixed(1) : "0.0").padStart(9)}% │ ${"✅ GOOD".padEnd(11)} │`
      );
      console.log(
         `│ Failed Test Suites        │ ${String(results.numFailedTestSuites).padStart(5)} │ ${(results.numTotalTestSuites > 0 ? ((results.numFailedTestSuites / results.numTotalTestSuites) * 100).toFixed(1) : "0.0").padStart(9)}% │ ${(results.numFailedTestSuites > 0 ? "❌ FAIL" : "✅ GOOD").padEnd(11)} │`
      );
      console.log("├───────────────────────────┼───────┼────────────┼─────────────┤");
      console.log(
         `│ Total Tests               │ ${String(totalTests).padStart(5)} │ ${"100.0%".padStart(10)} │ ${"ℹ️  INFO".padEnd(11)} │`
      );
      console.log(
         `│ Passed Tests              │ ${String(passedTests).padStart(5)} │ ${passRate.padStart(9)}% │ ${"✅ GOOD".padEnd(11)} │`
      );
      console.log(
         `│ Failed Tests              │ ${String(failedTests).padStart(5)} │ ${(totalTests > 0 ? ((failedTests / totalTests) * 100).toFixed(1) : "0.0").padStart(9)}% │ ${(failedTests > 0 ? "❌ FAIL" : "✅ GOOD").padEnd(11)} │`
      );
      console.log("└───────────────────────────┴───────┴────────────┴─────────────┘"); // Test Categories Summary
      console.log("\n🏷️  TEST CATEGORIES SUMMARY");
      console.log("─".repeat(80));
      console.log("│ Category                  │ Tests │ Passed │ Failed │ Status      │");
      console.log("├───────────────────────────┼───────┼────────┼────────┼─────────────┤");

      const categories = this.getCategorySummary();
      Object.keys(categories).forEach((category) => {
         const data = categories[category];
         const categoryName = category.padEnd(25);
         const total = String(data.total).padStart(5);
         const passed = String(data.passed).padStart(6);
         const failed = String(data.failed).padStart(6);
         const status = (data.failed === 0 ? "✅ PASS" : "❌ FAIL").padEnd(11);

         console.log(`│ ${categoryName} │ ${total} │ ${passed} │ ${failed} │ ${status} │`);
      });

      console.log("└───────────────────────────┴───────┴────────┴────────┴─────────────┘");

      // Performance Summary
      console.log("\n⚡ PERFORMANCE SUMMARY");
      console.log("─".repeat(80));
      console.log("│ Metric                    │ Value      │ Unit    │ Status      │");
      console.log("├───────────────────────────┼────────────┼─────────┼─────────────┤");

      const totalTime = this.testResults.reduce((sum, result) => sum + result.perfStats.runtime, 0);
      const avgTime = this.testResults.length > 0 ? (totalTime / this.testResults.length).toFixed(1) : "0.0";

      console.log(
         `│ Total Execution Time      │ ${String(totalTime).padStart(10)} │ ms      │ ${"ℹ️  INFO".padEnd(11)} │`
      );
      console.log(
         `│ Average Test File Time    │ ${avgTime.padStart(10)} │ ms      │ ${(avgTime > 1000 ? "⚠️  SLOW" : "✅ FAST").padEnd(11)} │`
      );
      console.log(
         `│ Tests per Second          │ ${(totalTime > 0 ? (totalTests / (totalTime / 1000)).toFixed(1) : "0.0").padStart(10)} │ tests/s │ ${"ℹ️  INFO".padEnd(11)} │`
      );

      console.log("└───────────────────────────┴────────────┴─────────┴─────────────┘");

      // Final Status
      console.log("\n🎯 FINAL RESULT");
      console.log("═".repeat(80));
      if (results.numFailedTests === 0 && results.numFailedTestSuites === 0) {
         console.log("🎉 ALL TESTS PASSED! ✅");
         console.log(`📊 Coverage Target: 70% | Achieved: Check coverage report`);
      } else {
         console.log("❌ SOME TESTS FAILED");
         console.log(`🔍 Failed Tests: ${results.numFailedTests}`);
         console.log(`🔍 Failed Suites: ${results.numFailedTestSuites}`);
      }
      console.log("═".repeat(80));
      console.log("");
   }

   getTestCategory(filePath) {
      if (filePath.includes("unit")) return "Unit Tests";
      if (filePath.includes("integration")) return "Integration Tests";
      if (filePath.includes("api")) return "API Tests";
      if (filePath.includes("e2e")) return "E2E Tests";
      if (filePath.includes("working")) return "Working API Tests";
      if (filePath.includes("basic")) return "Basic Tests";
      return "Other Tests";
   }

   getCategorySummary() {
      const categories = {};

      this.testResults.forEach((result) => {
         const category = this.getTestCategory(result.testFilePath);

         if (!categories[category]) {
            categories[category] = { total: 0, passed: 0, failed: 0 };
         }

         categories[category].total += result.numPassingTests + result.numFailingTests;
         categories[category].passed += result.numPassingTests;
         categories[category].failed += result.numFailingTests;
      });

      return categories;
   }
}
