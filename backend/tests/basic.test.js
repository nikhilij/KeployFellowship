import { describe, test, expect } from "@jest/globals";

describe("Basic Test", () => {
   test("should run a basic test", () => {
      expect(2 + 2).toBe(4);
   });

   test("should test string operations", () => {
      const str = "Hello World";
      expect(str).toContain("World");
      expect(str.length).toBe(11);
   });

   test("should test array operations", () => {
      const arr = [1, 2, 3, 4, 5];
      expect(arr).toHaveLength(5);
      expect(arr).toContain(3);
   });
});
