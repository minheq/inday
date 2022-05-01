import { isEqual, shallowClone } from "./lang_utils";

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

describe("shallowClone", () => {
  describe("objects", () => {
    test("simple", () => {
      const obj = { a: 1 };
      const clone = shallowClone(obj);

      expect(clone).not.toBe(obj);
      expect(clone).toEqual(obj);
    });
  });

  describe("array", () => {
    test("simple", () => {
      const arr = [1];
      const clone = shallowClone(arr);

      expect(clone).not.toBe(arr);
      expect(clone).toEqual(arr);
    });
  });
});
