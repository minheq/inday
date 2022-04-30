import { matchPathname, compilePathname } from "./pathname";

test("match", () => {
  expect(matchPathname("/p/:id", "/p/1/2/3")).toEqual({ id: "1" });
  expect(matchPathname("/p/:id", "/p/1")).toEqual({ id: "1" });
  expect(matchPathname("/p/:id", "/P/1A")).toEqual({ id: "1A" });
  expect(matchPathname("/p/:id/:id2", "/p/1/2")).toEqual({ id: "1", id2: "2" });
  expect(matchPathname("/p", "/p")).toEqual({});

  expect(matchPathname("/p/:id", "/p")).toBeFalsy();
  expect(matchPathname("/p/:id/:id2", "/p")).toBeFalsy();
  expect(matchPathname("/p/:id/:id2", "/p/1")).toBeFalsy();
  expect(matchPathname("/p/", "/other")).toBeFalsy();
});

test("compiles", () => {
  expect(compilePathname("/p", { id: "1" })).toEqual("/p");
  expect(compilePathname("/p/:id", {})).toEqual("/p");
  expect(compilePathname("/p/:id", { id: "1" })).toEqual("/p/1");
  expect(compilePathname("/P/:id", { id: "1" })).toEqual("/P/1");
  expect(compilePathname("/p/:id/:id2", {})).toEqual("/p");
  expect(compilePathname("/p/:id/:id2", { id2: "1" })).toEqual("/p");
  expect(compilePathname("/p/:id/:id2", { id: "1" })).toEqual("/p/1");
  expect(compilePathname("/p/:id/:id2", { id: "1", id2: "1" })).toEqual(
    "/p/1/1"
  );
});
