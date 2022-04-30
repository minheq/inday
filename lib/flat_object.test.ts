import { FlatObject } from "./flat_object";

test("happy", () => {
  const obj = FlatObject();

  obj.set(["a", "b", "c"], 1);

  const result = obj.get(["a", "b", "c"]);

  expect(result).toEqual(1);
});
