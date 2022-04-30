import { differenceBy, intersectBy } from "./array_utils";

test("intersectBy", () => {
  const a = [{ x: 1 }, { x: 2 }, { x: 3 }];
  const b = [{ x: 2 }, { x: 3 }, { x: 4 }];
  const result = intersectBy(a, b, (i) => i.x);

  expect(result).toEqual([{ x: 2 }, { x: 3 }]);
});

test("differenceBy", () => {
  const a = [{ x: 1 }, { x: 2 }, { x: 3 }];
  const b = [{ x: 2 }, { x: 3 }, { x: 4 }];
  const result = differenceBy(a, b, (i) => i.x);

  expect(result).toEqual([{ x: 1 }]);
});
