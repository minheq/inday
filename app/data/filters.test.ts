import { test } from '../../lib/testing';
import {
  Filter,
  updateFilterGroup,
  filterRecords,
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
  filterBySingleSelectFieldKindFilterRuleIs,
  filterBySingleSelectFieldKindFilterRuleIsNot,
  filterBySingleSelectFieldKindFilterRuleIsAnyOf,
  filterBySingleSelectFieldKindFilterRuleIsNoneOf,
  filterBySingleSelectFieldKindFilterRuleIsEmpty,
  filterBySingleSelectFieldKindFilterRuleIsNotEmpty,
  filterByMultiSelectFieldKindFilterRuleHasAnyOf,
  filterByMultiSelectFieldKindFilterRuleHasAllOf,
  filterByMultiSelectFieldKindFilterRuleHasNoneOf,
  filterByMultiSelectFieldKindFilterRuleIsEmpty,
  filterByMultiSelectFieldKindFilterRuleIsNotEmpty,
  filterByBooleanFieldKindFilterRuleIs,
} from './filters';

import {
  makeCollection,
  makeField,
  addFieldsToCollection,
  makeRecord,
  makeFilter,
} from './factory';
import { FieldType, FieldValue, FieldID } from './fields';
import { parseISODate } from '../../lib/date_utils';

test('no filter', (t) => {
  const values = ['AWord', 'BWord'];
  const { records, getters } = prepare(FieldType.SingleLineText, values);
  const result = filterRecords([], records, getters);

  t.deepEqual(result.length, values.length);
});

const values = ['AWord', 'BWord'];
const { records, getters, field } = prepare(FieldType.SingleLineText, values);

test('filter text - contains same case', (t) => {
  const filter = makeFilter(
    {},
    {
      rule: TextFieldKindFilterRule.Contains,
      value: 'Word',
      fieldID: field.id,
    },
  );
  const result = filterRecords([[filter]], records, getters);

  t.deepEqual(result.length, values.length);
});

test('filter text - one word different case', (t) => {
  const filter = makeFilter(
    {},
    {
      rule: TextFieldKindFilterRule.Contains,
      value: 'aword',
      fieldID: field.id,
    },
  );
  const result = filterRecords([[filter]], records, getters);

  t.deepEqual(result.length, 1);
});

test('filter text - 2 for one', (t) => {
  const filter1 = makeFilter(
    {},
    {
      rule: TextFieldKindFilterRule.Contains,
      value: 'word',
      fieldID: field.id,
    },
  );
  const filter2 = makeFilter(
    {},
    { rule: TextFieldKindFilterRule.Contains, value: 'a', fieldID: field.id },
  );
  const result = filterRecords([[filter1, filter2]], records, getters);

  t.deepEqual(result.length, 1);
});

test('filterByTextFieldKindFilterRuleContains', (t) => {
  const filter = filterByTextFieldKindFilterRuleContains;

  t.deepEqual(filter('abc', 'a'), true);
  t.deepEqual(filter('abc', 'A'), true);
  t.deepEqual(filter('abc', 'd'), false);
});

test('filterByTextFieldKindFilterRuleDoesNotContain', (t) => {
  const filter = filterByTextFieldKindFilterRuleDoesNotContain;

  t.deepEqual(filter('abc', 'd'), true);
  t.deepEqual(filter('abc', 'a'), false);
});

test('filterByTextFieldKindFilterRuleIs', (t) => {
  const filter = filterByTextFieldKindFilterRuleIs;

  t.deepEqual(filter('abc', 'abc'), true);
  t.deepEqual(filter('abc', 'b'), false);
});

test('filterByTextFieldKindFilterRuleIsNot', (t) => {
  const filter = filterByTextFieldKindFilterRuleIsNot;

  t.deepEqual(filter('abc', 'b'), true);
  t.deepEqual(filter('abc', 'abc'), false);
});

test('filterByTextFieldKindFilterRuleIsEmpty', (t) => {
  const filter = filterByTextFieldKindFilterRuleIsEmpty;

  t.deepEqual(filter(''), true);
  t.deepEqual(filter('abc'), false);
});

test('filterByTextFieldKindFilterRuleIsNotEmpty', (t) => {
  const filter = filterByTextFieldKindFilterRuleIsNotEmpty;

  t.deepEqual(filter('abc'), true);
  t.deepEqual(filter(''), false);
});

test('filterByNumberFieldKindFilterRuleEqual', (t) => {
  const filter = filterByNumberFieldKindFilterRuleEqual;

  t.deepEqual(filter(1, 1), true);
  t.deepEqual(filter(1, 2), false);
});

test('filterByNumberFieldKindFilterRuleNotEqual', (t) => {
  const filter = filterByNumberFieldKindFilterRuleNotEqual;

  t.deepEqual(filter(1, 2), true);
  t.deepEqual(filter(1, 1), false);
});

test('filterByNumberFieldKindFilterRuleLessThan', (t) => {
  const filter = filterByNumberFieldKindFilterRuleLessThan;

  t.deepEqual(filter(1, 2), true);
  t.deepEqual(filter(2, 1), false);
});

test('filterByNumberFieldKindFilterRuleGreaterThan', (t) => {
  const filter = filterByNumberFieldKindFilterRuleGreaterThan;

  t.deepEqual(filter(2, 1), true);
  t.deepEqual(filter(1, 2), false);
});

test('filterByNumberFieldKindFilterRuleLessThanOrEqual', (t) => {
  const filter = filterByNumberFieldKindFilterRuleLessThanOrEqual;

  t.deepEqual(filter(1, 2), true);
  t.deepEqual(filter(2, 2), true);
  t.deepEqual(filter(2, 1), false);
});

test('filterByNumberFieldKindFilterRuleGreaterThanOrEqual', (t) => {
  const filter = filterByNumberFieldKindFilterRuleGreaterThanOrEqual;

  t.deepEqual(filter(2, 1), true);
  t.deepEqual(filter(2, 2), true);
  t.deepEqual(filter(1, 2), false);
});

test('filterByNumberFieldKindFilterRuleIsEmpty', (t) => {
  const filter = filterByNumberFieldKindFilterRuleIsEmpty;

  t.deepEqual(filter(null), true);
  t.deepEqual(filter(1), false);
});

test('filterByNumberFieldKindFilterRuleIsNotEmpty', (t) => {
  const filter = filterByNumberFieldKindFilterRuleIsNotEmpty;

  t.deepEqual(filter(1), true);
  t.deepEqual(filter(null), false);
});

test('filterByDateFieldKindFilterRuleIs', (t) => {
  const filter = filterByDateFieldKindFilterRuleIs;

  t.deepEqual(
    filter(parseISODate('2020-08-03'), parseISODate('2020-08-03')),
    true,
  );
  t.deepEqual(
    filter(parseISODate('2020-08-03'), parseISODate('2020-08-04')),
    false,
  );
});

test('filterByDateFieldKindFilterRuleIsWithin', (t) => {
  const filter = filterByDateFieldKindFilterRuleIsWithin;

  t.deepEqual(
    filter(parseISODate('2020-08-03'), {
      start: parseISODate('2020-08-02'),
      end: parseISODate('2020-08-04'),
    }),
    true,
  );

  t.deepEqual(
    filter(parseISODate('2020-08-05'), {
      start: parseISODate('2020-08-02'),
      end: parseISODate('2020-08-04'),
    }),
    false,
  );
});

test('filterByDateFieldKindFilterRuleIsBefore', (t) => {
  const filter = filterByDateFieldKindFilterRuleIsBefore;

  t.deepEqual(
    filter(parseISODate('2020-08-03'), parseISODate('2020-08-04')),
    true,
  );
  t.deepEqual(
    filter(parseISODate('2020-08-05'), parseISODate('2020-08-04')),
    false,
  );
});

test('filterByDateFieldKindFilterRuleIsAfter', (t) => {
  const filter = filterByDateFieldKindFilterRuleIsAfter;

  t.deepEqual(
    filter(parseISODate('2020-08-05'), parseISODate('2020-08-04')),
    true,
  );
  t.deepEqual(
    filter(parseISODate('2020-08-03'), parseISODate('2020-08-04')),
    false,
  );
});

test('filterByDateFieldKindFilterRuleIsOnOrBefore', (t) => {
  const filter = filterByDateFieldKindFilterRuleIsOnOrBefore;

  t.deepEqual(
    filter(parseISODate('2020-08-03'), parseISODate('2020-08-04')),
    true,
  );
  t.deepEqual(
    filter(parseISODate('2020-08-04'), parseISODate('2020-08-04')),
    true,
  );
  t.deepEqual(
    filter(parseISODate('2020-08-05'), parseISODate('2020-08-04')),
    false,
  );
});

test('filterByDateFieldKindFilterRuleIsOnOrAfter', (t) => {
  const filter = filterByDateFieldKindFilterRuleIsOnOrAfter;

  t.deepEqual(
    filter(parseISODate('2020-08-05'), parseISODate('2020-08-04')),
    true,
  );
  t.deepEqual(
    filter(parseISODate('2020-08-04'), parseISODate('2020-08-04')),
    true,
  );
  t.deepEqual(
    filter(parseISODate('2020-08-03'), parseISODate('2020-08-04')),
    false,
  );
});

test('filterByDateFieldKindFilterRuleIsNot', (t) => {
  const filter = filterByDateFieldKindFilterRuleIsNot;

  t.deepEqual(
    filter(parseISODate('2020-08-05'), parseISODate('2020-08-04')),
    true,
  );
  t.deepEqual(
    filter(parseISODate('2020-08-04'), parseISODate('2020-08-04')),
    false,
  );
});

test('filterByDateFieldKindFilterRuleIsEmpty', (t) => {
  const filter = filterByDateFieldKindFilterRuleIsEmpty;

  t.deepEqual(filter(null), true);
  t.deepEqual(filter(parseISODate('2020-08-04')), false);
});

test('filterByDateFieldKindFilterRuleIsNotEmpty', (t) => {
  const filter = filterByDateFieldKindFilterRuleIsNotEmpty;

  t.deepEqual(filter(parseISODate('2020-08-04')), true);
  t.deepEqual(filter(null), false);
});

test('filterBySingleSelectFieldKindFilterRuleIs', (t) => {
  const filter = filterBySingleSelectFieldKindFilterRuleIs;

  t.deepEqual(filter('opt1', 'opt1'), true);
  t.deepEqual(filter('opt1', 'opt2'), false);
});

test('filterBySingleSelectFieldKindFilterRuleIsNot', (t) => {
  const filter = filterBySingleSelectFieldKindFilterRuleIsNot;

  t.deepEqual(filter('opt1', 'opt2'), true);
  t.deepEqual(filter('opt1', 'opt1'), false);
});

test('filterBySingleSelectFieldKindFilterRuleIsAnyOf', (t) => {
  const filter = filterBySingleSelectFieldKindFilterRuleIsAnyOf;

  t.deepEqual(filter('a', ['a', 'b']), true);
  t.deepEqual(filter('a', ['b', 'c']), false);
});

test('filterBySingleSelectFieldKindFilterRuleIsNoneOf', (t) => {
  const filter = filterBySingleSelectFieldKindFilterRuleIsNoneOf;

  t.deepEqual(filter('a', ['b', 'c']), true);
  t.deepEqual(filter('a', ['a', 'b']), false);
});

test('filterBySingleSelectFieldKindFilterRuleIsEmpty', (t) => {
  const filter = filterBySingleSelectFieldKindFilterRuleIsEmpty;

  t.deepEqual(filter(null), true);
  t.deepEqual(filter('abc'), false);
});

test('filterBySingleSelectFieldKindFilterRuleIsNotEmpty', (t) => {
  const filter = filterBySingleSelectFieldKindFilterRuleIsNotEmpty;

  t.deepEqual(filter('abc'), true);
  t.deepEqual(filter(null), false);
});

test('filterByMultiSelectFieldKindFilterRuleHasAnyOf', (t) => {
  const filter = filterByMultiSelectFieldKindFilterRuleHasAnyOf;

  t.deepEqual(filter(['a'], ['a', 'b']), true);
  t.deepEqual(filter(['a'], ['b', 'c']), false);
});

test('filterByMultiSelectFieldKindFilterRuleHasAllOf', (t) => {
  const filter = filterByMultiSelectFieldKindFilterRuleHasAllOf;

  t.deepEqual(filter(['b', 'a'], ['a', 'b']), true);
  t.deepEqual(filter(['a'], ['a', 'b']), false);
});

test('filterByMultiSelectFieldKindFilterRuleHasNoneOf', (t) => {
  const filter = filterByMultiSelectFieldKindFilterRuleHasNoneOf;

  t.deepEqual(filter(['a'], ['b', 'c']), true);
  t.deepEqual(filter(['a'], ['a', 'b']), false);
});

test('filterByMultiSelectFieldKindFilterRuleIsEmpty', (t) => {
  const filter = filterByMultiSelectFieldKindFilterRuleIsEmpty;

  t.deepEqual(filter([]), true);
  t.deepEqual(filter(['a']), false);
});

test('filterByMultiSelectFieldKindFilterRuleIsNotEmpty', (t) => {
  const filter = filterByMultiSelectFieldKindFilterRuleIsNotEmpty;

  t.deepEqual(filter(['a']), true);
  t.deepEqual(filter([]), false);
});

test('filterByBooleanFieldKindFilterRuleIs', (t) => {
  const filter = filterByBooleanFieldKindFilterRuleIs;

  t.deepEqual(filter(true, true), true);
  t.deepEqual(filter(true, false), false);
});

function getOrFilters() {
  const filter1: Filter = {
    id: '1',
    viewID: '1',
    group: 1,
    fieldID: '1',
    rule: 'contains',
    value: 's',
  };

  const filter2: Filter = {
    id: '2',
    viewID: '1',
    group: 2,
    fieldID: '1',
    rule: 'contains',
    value: 's',
  };

  const filter3: Filter = {
    id: '3',
    viewID: '1',
    group: 3,
    fieldID: '1',
    rule: 'contains',
    value: 's',
  };

  return [filter1, filter2, filter3];
}

test('updateFilterGroup - 3 "OR" filters to f1 AND f2 OR f3', (t) => {
  const filters = getOrFilters();
  const [, filter2, filter3] = filters;

  const updatedFilters = updateFilterGroup(filter2, 'and', filters);

  const updatedFilter2 = updatedFilters[filter2.id];
  const updatedFilter3 = updatedFilters[filter3.id];

  t.deepEqual(updatedFilter2.group, 1);
  t.deepEqual(updatedFilter3.group, 2);
});

test('updateFilterGroup - 3 "OR" filters to f1 OR f2 AND f3', (t) => {
  const filters = getOrFilters();
  const [, , filter3] = filters;

  const updatedFilters = updateFilterGroup(filter3, 'and', filters);
  const updatedFilter3 = updatedFilters[filter3.id];

  t.deepEqual(updatedFilter3.group, 2);
});

function getAndFilters() {
  const filter1: Filter = {
    id: '1',
    viewID: '1',
    group: 1,
    fieldID: '1',
    rule: 'contains',
    value: 's',
  };

  const filter2: Filter = {
    id: '2',
    viewID: '1',
    group: 1,
    fieldID: '1',
    rule: 'contains',
    value: 's',
  };

  const filter3: Filter = {
    id: '3',
    viewID: '1',
    group: 1,
    fieldID: '1',
    rule: 'contains',
    value: 's',
  };

  return [filter1, filter2, filter3];
}

test('updateFilterGroup - 3 "AND" filters - f1 and f2 or f3', (t) => {
  const filters = getAndFilters();
  const [, , filter3] = filters;

  const updatedFilters = updateFilterGroup(filter3, 'or', filters);

  const updatedFilter3 = updatedFilters[filter3.id];

  t.deepEqual(updatedFilter3.group, 2);
});

test('updateFilterGroup - 3 "AND" filters - f1 or f2 and f3', (t) => {
  const filters = getAndFilters();
  const [, filter2, filter3] = filters;

  const updatedFilters = updateFilterGroup(filter2, 'or', filters);
  const updatedFilter2 = updatedFilters[filter2.id];
  const updatedFilter3 = updatedFilters[filter3.id];

  t.deepEqual(updatedFilter2.group, 2);
  t.deepEqual(updatedFilter3.group, 2);
});

function prepare(fieldType: FieldType, values: FieldValue[]) {
  const collection = makeCollection({});
  const field = makeField({ type: fieldType });
  const collectionWithFields = addFieldsToCollection(collection, [field]);

  const records = values.map((value) => {
    return makeRecord({ fields: { [field.id]: value } }, collectionWithFields);
  });

  const getField = (_fieldID: FieldID) => field;

  const getters: FilterGetters = {
    getField,
  };

  return { records, field, getters };
}
