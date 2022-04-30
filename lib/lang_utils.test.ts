import { isEqual } from "./lang_utils";

describe("isEqual", () => {
  test("objects", () => {
    expect(isEqual({ a: 1 }, { a: 1 })).toBeTruthy();
    expect(
      isEqual({ b: 2, a: 1, c: "str1" }, { a: 1, c: "str1", b: 2 })
    ).toBeTruthy();
    expect(isEqual({ a: 1 }, { b: 1 })).toBeFalsy();
    expect(
      isEqual({ b: 2, a: 1, c: "str1" }, { a: 1, c: "str2", b: 2 })
    ).toBeFalsy();
  });
});
