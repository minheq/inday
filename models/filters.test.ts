import {
  Filter,
  updateFilterGroup,
  filterDocuments,
  FilterGetters,
  TextFieldKindFilterRule,
  filterByTextFieldKindFilterRuleContains,
  filterByTextFieldKindFilterRuleDoesNotContain,
  filterByTextFieldKindFilterRuleIs,
  filterByTextFieldKindFilterRuleIsNot,
  filterByTextFieldKindFilterRuleIsEmpty,
  filterByTextFieldKindFilterRuleIsNotEmpty,
  filterByNumberFieldKindFilterRuleNotEqual,
  filterByNumberFieldKindFilterRuleEqual,
  filterByNumberFieldKindFilterRuleLessThan,
  filterByNumberFieldKindFilterRuleGreaterThan,
  filterByNumberFieldKindFilterRuleLessThanOrEqual,
  filterByNumberFieldKindFilterRuleGreaterThanOrEqual,
  filterByNumberFieldKindFilterRuleIsEmpty,
  filterByNumberFieldKindFilterRuleIsNotEmpty,
  filterByDateFieldKindFilterRuleIsWithin,
  filterByDateFieldKindFilterRuleIs,
  filterByDateFieldKindFilterRuleIsBefore,
  filterByDateFieldKindFilterRuleIsAfter,
  filterByDateFieldKindFilterRuleIsOnOrBefore,
  filterByDateFieldKindFilterRuleIsOnOrAfter,
  filterByDateFieldKindFilterRuleIsNot,
  filterByDateFieldKindFilterRuleIsEmpty,
  filterByDateFieldKindFilterRuleIsNotEmpty,
  filterBySingleOptionFieldKindFilterRuleIs,
  filterBySingleOptionFieldKindFilterRuleIsNot,
  filterBySingleOptionFieldKindFilterRuleIsAnyOf,
  filterBySingleOptionFieldKindFilterRuleIsNoneOf,
  filterBySingleOptionFieldKindFilterRuleIsEmpty,
  filterBySingleOptionFieldKindFilterRuleIsNotEmpty,
  filterByMultiOptionFieldKindFilterRuleHasAnyOf,
  filterByMultiOptionFieldKindFilterRuleHasAllOf,
  filterByMultiOptionFieldKindFilterRuleHasNoneOf,
  filterByMultiOptionFieldKindFilterRuleIsEmpty,
  filterByMultiOptionFieldKindFilterRuleIsNotEmpty,
  filterByBooleanFieldKindFilterRuleIs,
} from "./filters";

import {
  makeCollection,
  makeField,
  addFieldsToCollection,
  makeDocument,
  makeFilter,
} from "./factory";
import { FieldType, FieldValue } from "./fields";

test("no filter", () => {
  const values = ["AWord", "BWord"];
  const { documents, getters } = prepare(FieldType.SingleLineText, values);
  const result = filterDocuments([], documents, getters);

  expect(result.length).toEqual(values.length);
});

test("filter text - contains same case", () => {
  const values = ["AWord", "BWord"];
  const { documents, getters, field } = prepare(
    FieldType.SingleLineText,
    values
  );

  const filter = makeFilter(
    {},
    {
      rule: TextFieldKindFilterRule.Contains,
      value: "Word",
      fieldID: field.id,
    }
  );
  const result = filterDocuments([[filter]], documents, getters);

  expect(result.length).toEqual(values.length);
});

test("filter text - one word different case", () => {
  const values = ["AWord", "BWord"];
  const { documents, getters, field } = prepare(
    FieldType.SingleLineText,
    values
  );
  const filter = makeFilter(
    {},
    {
      rule: TextFieldKindFilterRule.Contains,
      value: "aword",
      fieldID: field.id,
    }
  );
  const result = filterDocuments([[filter]], documents, getters);

  expect(result.length).toEqual(1);
});

test("filter text - 2 for one", () => {
  const values = ["AWord", "BWord"];
  const { documents, getters, field } = prepare(
    FieldType.SingleLineText,
    values
  );
  const filter1 = makeFilter(
    {},
    {
      rule: TextFieldKindFilterRule.Contains,
      value: "word",
      fieldID: field.id,
    }
  );
  const filter2 = makeFilter(
    {},
    {
      rule: TextFieldKindFilterRule.Contains,
      value: "a",
      fieldID: field.id,
    }
  );
  const result = filterDocuments([[filter1, filter2]], documents, getters);

  expect(result.length).toEqual(1);
});

test("filterByTextFieldKindFilterRuleContains", () => {
  const filter = filterByTextFieldKindFilterRuleContains;

  expect(filter("abc", "a")).toBeTruthy();
  expect(filter("abc", "A")).toBeTruthy();
  expect(filter("abc", "d")).toBeFalsy();
});

test("filterByTextFieldKindFilterRuleDoesNotContain", () => {
  const filter = filterByTextFieldKindFilterRuleDoesNotContain;

  expect(filter("abc", "d")).toBeTruthy();
  expect(filter("abc", "a")).toBeFalsy();
});

test("filterByTextFieldKindFilterRuleIs", () => {
  const filter = filterByTextFieldKindFilterRuleIs;

  expect(filter("abc", "abc")).toBeTruthy();
  expect(filter("abc", "b")).toBeFalsy();
});

test("filterByTextFieldKindFilterRuleIsNot", () => {
  const filter = filterByTextFieldKindFilterRuleIsNot;

  expect(filter("abc", "b")).toBeTruthy();
  expect(filter("abc", "abc")).toBeFalsy();
});

test("filterByTextFieldKindFilterRuleIsEmpty", () => {
  const filter = filterByTextFieldKindFilterRuleIsEmpty;

  expect(filter("")).toBeTruthy();
  expect(filter("abc")).toBeFalsy();
});

test("filterByTextFieldKindFilterRuleIsNotEmpty", () => {
  const filter = filterByTextFieldKindFilterRuleIsNotEmpty;

  expect(filter("abc")).toBeTruthy();
  expect(filter("")).toBeFalsy();
});

test("filterByNumberFieldKindFilterRuleEqual", () => {
  const filter = filterByNumberFieldKindFilterRuleEqual;

  expect(filter(1, 1)).toBeTruthy();
  expect(filter(1, 2)).toBeFalsy();
});

test("filterByNumberFieldKindFilterRuleNotEqual", () => {
  const filter = filterByNumberFieldKindFilterRuleNotEqual;

  expect(filter(1, 2)).toBeTruthy();
  expect(filter(1, 1)).toBeFalsy();
});

test("filterByNumberFieldKindFilterRuleLessThan", () => {
  const filter = filterByNumberFieldKindFilterRuleLessThan;

  expect(filter(1, 2)).toBeTruthy();
  expect(filter(2, 1)).toBeFalsy();
});

test("filterByNumberFieldKindFilterRuleGreaterThan", () => {
  const filter = filterByNumberFieldKindFilterRuleGreaterThan;

  expect(filter(2, 1)).toBeTruthy();
  expect(filter(1, 2)).toBeFalsy();
});

test("filterByNumberFieldKindFilterRuleLessThanOrEqual", () => {
  const filter = filterByNumberFieldKindFilterRuleLessThanOrEqual;

  expect(filter(1, 2)).toBeTruthy();
  expect(filter(2, 2)).toBeTruthy();
  expect(filter(2, 1)).toBeFalsy();
});

test("filterByNumberFieldKindFilterRuleGreaterThanOrEqual", () => {
  const filter = filterByNumberFieldKindFilterRuleGreaterThanOrEqual;

  expect(filter(2, 1)).toBeTruthy();
  expect(filter(2, 2)).toBeTruthy();
  expect(filter(1, 2)).toBeFalsy();
});

test("filterByNumberFieldKindFilterRuleIsEmpty", () => {
  const filter = filterByNumberFieldKindFilterRuleIsEmpty;

  expect(filter(null)).toBeTruthy();
  expect(filter(1)).toBeFalsy();
});

test("filterByNumberFieldKindFilterRuleIsNotEmpty", () => {
  const filter = filterByNumberFieldKindFilterRuleIsNotEmpty;

  expect(filter(1)).toBeTruthy();
  expect(filter(null)).toBeFalsy();
});

test("filterByDateFieldKindFilterRuleIs", () => {
  const filter = filterByDateFieldKindFilterRuleIs;

  expect(filter("2020-08-03", "2020-08-03")).toBeTruthy();
  expect(filter("2020-08-03", "2020-08-04")).toBeFalsy();
});

test("filterByDateFieldKindFilterRuleIsWithin", () => {
  const filter = filterByDateFieldKindFilterRuleIsWithin;

  expect(
    filter("2020-08-03", {
      start: "2020-08-02",
      end: "2020-08-04",
    })
  ).toBeTruthy();

  expect(
    filter("2020-08-05", {
      start: "2020-08-02",
      end: "2020-08-04",
    })
  ).toBeFalsy();
});

test("filterByDateFieldKindFilterRuleIsBefore", () => {
  const filter = filterByDateFieldKindFilterRuleIsBefore;

  expect(filter("2020-08-03", "2020-08-04")).toBeTruthy();
  expect(filter("2020-08-05", "2020-08-04")).toBeFalsy();
});

test("filterByDateFieldKindFilterRuleIsAfter", () => {
  const filter = filterByDateFieldKindFilterRuleIsAfter;

  expect(filter("2020-08-05", "2020-08-04")).toBeTruthy();
  expect(filter("2020-08-03", "2020-08-04")).toBeFalsy();
});

test("filterByDateFieldKindFilterRuleIsOnOrBefore", () => {
  const filter = filterByDateFieldKindFilterRuleIsOnOrBefore;

  expect(filter("2020-08-03", "2020-08-04")).toBeTruthy();
  expect(filter("2020-08-04", "2020-08-04")).toBeTruthy();
  expect(filter("2020-08-05", "2020-08-04")).toBeFalsy();
});

test("filterByDateFieldKindFilterRuleIsOnOrAfter", () => {
  const filter = filterByDateFieldKindFilterRuleIsOnOrAfter;

  expect(filter("2020-08-05", "2020-08-04")).toBeTruthy();
  expect(filter("2020-08-04", "2020-08-04")).toBeTruthy();
  expect(filter("2020-08-03", "2020-08-04")).toBeFalsy();
});

test("filterByDateFieldKindFilterRuleIsNot", () => {
  const filter = filterByDateFieldKindFilterRuleIsNot;

  expect(filter("2020-08-05", "2020-08-04")).toBeTruthy();
  expect(filter("2020-08-04", "2020-08-04")).toBeFalsy();
});

test("filterByDateFieldKindFilterRuleIsEmpty", () => {
  const filter = filterByDateFieldKindFilterRuleIsEmpty;

  expect(filter(null)).toBeTruthy();
  expect(filter("2020-08-04")).toBeFalsy();
});

test("filterByDateFieldKindFilterRuleIsNotEmpty", () => {
  const filter = filterByDateFieldKindFilterRuleIsNotEmpty;

  expect(filter("2020-08-04")).toBeTruthy();
  expect(filter(null)).toBeFalsy();
});

test("filterBySingleOptionFieldKindFilterRuleIs", () => {
  const filter = filterBySingleOptionFieldKindFilterRuleIs;

  expect(filter("opt1", "opt1")).toBeTruthy();
  expect(filter("opt1", "opt2")).toBeFalsy();
});

test("filterBySingleOptionFieldKindFilterRuleIsNot", () => {
  const filter = filterBySingleOptionFieldKindFilterRuleIsNot;

  expect(filter("opt1", "opt2")).toBeTruthy();
  expect(filter("opt1", "opt1")).toBeFalsy();
});

test("filterBySingleOptionFieldKindFilterRuleIsAnyOf", () => {
  const filter = filterBySingleOptionFieldKindFilterRuleIsAnyOf;

  expect(filter("opta", ["opta", "optb"])).toBeTruthy();
  expect(filter("opta", ["optb", "opt"])).toBeFalsy();
});

test("filterBySingleOptionFieldKindFilterRuleIsNoneOf", () => {
  const filter = filterBySingleOptionFieldKindFilterRuleIsNoneOf;

  expect(filter("opta", ["optb", "opt"])).toBeTruthy();
  expect(filter("opta", ["opta", "optb"])).toBeFalsy();
});

test("filterBySingleOptionFieldKindFilterRuleIsEmpty", () => {
  const filter = filterBySingleOptionFieldKindFilterRuleIsEmpty;

  expect(filter(null)).toBeTruthy();
  expect(filter("opta")).toBeFalsy();
});

test("filterBySingleOptionFieldKindFilterRuleIsNotEmpty", () => {
  const filter = filterBySingleOptionFieldKindFilterRuleIsNotEmpty;

  expect(filter("opta")).toBeTruthy();
  expect(filter(null)).toBeFalsy();
});

test("filterByMultiOptionFieldKindFilterRuleHasAnyOf", () => {
  const filter = filterByMultiOptionFieldKindFilterRuleHasAnyOf;

  expect(filter(["opta"], ["opta", "optb"])).toBeTruthy();
  expect(filter(["opta"], ["optb", "opt"])).toBeFalsy();
});

test("filterByMultiOptionFieldKindFilterRuleHasAllOf", () => {
  const filter = filterByMultiOptionFieldKindFilterRuleHasAllOf;

  expect(filter(["optb", "opta"], ["opta", "optb"])).toBeTruthy();
  expect(filter(["opta"], ["opta", "optb"])).toBeFalsy();
});

test("filterByMultiOptionFieldKindFilterRuleHasNoneOf", () => {
  const filter = filterByMultiOptionFieldKindFilterRuleHasNoneOf;

  expect(filter(["opta"], ["optb", "opt"])).toBeTruthy();
  expect(filter(["opta"], ["opta", "optb"])).toBeFalsy();
});

test("filterByMultiOptionFieldKindFilterRuleIsEmpty", () => {
  const filter = filterByMultiOptionFieldKindFilterRuleIsEmpty;

  expect(filter([])).toBeTruthy();
  expect(filter(["opta"])).toBeFalsy();
});

test("filterByMultiOptionFieldKindFilterRuleIsNotEmpty", () => {
  const filter = filterByMultiOptionFieldKindFilterRuleIsNotEmpty;

  expect(filter(["opta"])).toBeTruthy();
  expect(filter([])).toBeFalsy();
});

test("filterByBooleanFieldKindFilterRuleIs", () => {
  const filter = filterByBooleanFieldKindFilterRuleIs;

  expect(filter(true, true)).toBeTruthy();
  expect(filter(true, false)).toBeFalsy();
});

function getOrFilters() {
  const filter1: Filter = {
    id: "fil1",
    viewID: "viw1",
    group: 1,
    fieldID: "fld1",
    rule: TextFieldKindFilterRule.Contains,
    value: "s",
  };

  const filter2: Filter = {
    id: "fil2",
    viewID: "viw1",
    group: 2,
    fieldID: "fld1",
    rule: TextFieldKindFilterRule.Contains,
    value: "s",
  };

  const filter3: Filter = {
    id: "fil3",
    viewID: "viw1",
    group: 3,
    fieldID: "fld1",
    rule: TextFieldKindFilterRule.Contains,
    value: "s",
  };

  return [filter1, filter2, filter3];
}

test('updateFilterGroup - 3 "OR" filters to f1 AND f2 OR f3', () => {
  const filters = getOrFilters();
  const [, filter2, filter3] = filters;

  const updatedFilters = updateFilterGroup(filter2, "and", filters);

  const updatedFilter2 = updatedFilters[filter2.id];
  const updatedFilter3 = updatedFilters[filter3.id];

  expect(updatedFilter2.group).toEqual(1);
  expect(updatedFilter3.group).toEqual(2);
});

test('updateFilterGroup - 3 "OR" filters to f1 OR f2 AND f3', () => {
  const filters = getOrFilters();
  const [, , filter3] = filters;

  const updatedFilters = updateFilterGroup(filter3, "and", filters);
  const updatedFilter3 = updatedFilters[filter3.id];

  expect(updatedFilter3.group).toEqual(2);
});

function getAndFilters() {
  const filter1: Filter = {
    id: "fil1",
    viewID: "viw1",
    group: 1,
    fieldID: "fld1",
    rule: TextFieldKindFilterRule.Contains,
    value: "s",
  };

  const filter2: Filter = {
    id: "fil2",
    viewID: "viw1",
    group: 1,
    fieldID: "fld1",
    rule: TextFieldKindFilterRule.Contains,
    value: "s",
  };

  const filter3: Filter = {
    id: "fil3",
    viewID: "viw1",
    group: 1,
    fieldID: "fld1",
    rule: TextFieldKindFilterRule.Contains,
    value: "s",
  };

  return [filter1, filter2, filter3];
}

test('updateFilterGroup - 3 "AND" filters - f1 and f2 or f3', () => {
  const filters = getAndFilters();
  const [, , filter3] = filters;

  const updatedFilters = updateFilterGroup(filter3, "or", filters);

  const updatedFilter3 = updatedFilters[filter3.id];

  expect(updatedFilter3.group).toEqual(2);
});

test('updateFilterGroup - 3 "AND" filters - f1 or f2 and f3', () => {
  const filters = getAndFilters();
  const [, filter2, filter3] = filters;

  const updatedFilters = updateFilterGroup(filter2, "or", filters);
  const updatedFilter2 = updatedFilters[filter2.id];
  const updatedFilter3 = updatedFilters[filter3.id];

  expect(updatedFilter2.group).toEqual(2);
  expect(updatedFilter3.group).toEqual(2);
});

function prepare(fieldType: FieldType, values: FieldValue[]) {
  const collection = makeCollection({});
  const field = makeField({ type: fieldType });
  const collectionWithFields = addFieldsToCollection(collection, [field]);

  const documents = values.map((value) => {
    return makeDocument(
      { fields: { [field.id]: value } },
      collectionWithFields
    );
  });

  const getField = () => field;

  const getters: FilterGetters = {
    getField,
  };

  return { documents, field, getters };
}
