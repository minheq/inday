import { isEqual } from "./lang_utils";

describe("isEqual", () => {
  describe("objects", () => {
    test("simple", () => {
      expect(isEqual({ a: 1 }, { a: 1 })).toBeTruthy();
      expect(isEqual({ a: 1 }, { b: 1 })).toBeFalsy();
    });

    test("different property order", () => {
      expect(
        isEqual({ b: 2, a: 1, c: "str1" }, { a: 1, c: "str1", b: 2 })
      ).toBeTruthy();
      expect(
        isEqual({ b: 2, a: 1, c: "str1" }, { a: 1, c: "str1", b: 2 })
      ).toBeTruthy();
    });

    test("different property values", () => {
      expect(
        isEqual({ b: 2, a: 1, c: "str1" }, { a: 1, c: "str2", b: 2 })
      ).toBeFalsy();
    });

    test("array", () => {
      expect(isEqual({ a: [1, 2] }, { a: [1, 2] })).toBeTruthy();
      expect(isEqual({ a: [2, 1] }, { a: [1, 2] })).toBeFalsy();
    });
  });
});
