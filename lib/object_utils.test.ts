import { mergeObjects } from "./object_utils";

describe("mergeObjects", () => {
  test("simple objects", () => {
    const result = mergeObjects({ a: 1 }, { b: 2 }, { c: 3 });

    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  test("nested objects", () => {
    const result = mergeObjects({ a: 1, b: { c: 2 } }, { d: 3, b: { e: 4 } });

    expect(result).toEqual({ a: 1, b: { c: 2, e: 4 }, d: 3 });
  });
});
