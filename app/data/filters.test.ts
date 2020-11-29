import { test } from '../../lib/testing';
import {
  textFieldKindFiltersByRule,
  numberFieldKindFiltersByRule,
  dateFieldKindFiltersByRule,
  singleSelectFieldKindFiltersByRule,
  multiSelectFieldKindFiltersByRule,
  booleanFieldKindFiltersByRule,
  Filter,
  updateFilterGroup,
  filterRecords,
  FilterGetters,
} from './filters';
import { Day } from '../../lib/datetime';

import {
  makeCollection,
  makeField,
  addFieldsToCollection,
  makeRecord,
  makeFilter,
} from './factory';
import { FieldType, FieldValue, FieldID } from './fields';

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
    { rule: 'contains', value: 'Word', fieldID: field.id },
  );
  const result = filterRecords([[filter]], records, getters);

  t.deepEqual(result.length, values.length);
});

test('filter text - one word different case', (t) => {
  const filter = makeFilter(
    {},
    { rule: 'contains', value: 'aword', fieldID: field.id },
  );
  const result = filterRecords([[filter]], records, getters);

  t.deepEqual(result.length, 1);
});

test('filter text - 2 for one', (t) => {
  const filter1 = makeFilter(
    {},
    { rule: 'contains', value: 'word', fieldID: field.id },
  );
  const filter2 = makeFilter(
    {},
    { rule: 'contains', value: 'a', fieldID: field.id },
  );
  const result = filterRecords([[filter1, filter2]], records, getters);

  t.deepEqual(result.length, 1);
});

test('textFieldKindFiltersByRule - contains', (t) => {
  const filter = textFieldKindFiltersByRule.contains;

  t.deepEqual(filter('abc', 'a'), true, 'ok same case');
  t.deepEqual(filter('abc', 'A'), true);
  t.deepEqual(filter('abc', 'd'), false);
});

test('textFieldKindFiltersByRule - doesNotContain', (t) => {
  const filter = textFieldKindFiltersByRule.doesNotContain;

  t.deepEqual(filter('abc', 'd'), true);
  t.deepEqual(filter('abc', 'a'), false);
});

test('textFieldKindFiltersByRule - is', (t) => {
  const filter = textFieldKindFiltersByRule.is;

  t.deepEqual(filter('abc', 'abc'), true);
  t.deepEqual(filter('abc', 'b'), false);
});

test('textFieldKindFiltersByRule - isNot', (t) => {
  const filter = textFieldKindFiltersByRule.isNot;

  t.deepEqual(filter('abc', 'b'), true);
  t.deepEqual(filter('abc', 'abc'), false);
});

test('textFieldKindFiltersByRule - isEmpty', (t) => {
  const filter = textFieldKindFiltersByRule.isEmpty;

  t.deepEqual(filter('', ''), true);
  t.deepEqual(filter('abc', ''), false);
});

test('textFieldKindFiltersByRule - isNotEmpty', (t) => {
  const filter = textFieldKindFiltersByRule.isNotEmpty;

  t.deepEqual(filter('abc', ''), true);
  t.deepEqual(filter('', ''), false);
});

test('numberFieldKindFiltersByRule - equal', (t) => {
  const filter = numberFieldKindFiltersByRule.equal;

  t.deepEqual(filter(1, 1), true);
  t.deepEqual(filter(1, 2), false);
});

test('numberFieldKindFiltersByRule - notEqual', (t) => {
  const filter = numberFieldKindFiltersByRule.notEqual;

  t.deepEqual(filter(1, 2), true);
  t.deepEqual(filter(1, 1), false);
});

test('numberFieldKindFiltersByRule - lessThan', (t) => {
  const filter = numberFieldKindFiltersByRule.lessThan;

  t.deepEqual(filter(1, 2), true);
  t.deepEqual(filter(2, 1), false);
});

test('numberFieldKindFiltersByRule - greaterThan', (t) => {
  const filter = numberFieldKindFiltersByRule.greaterThan;

  t.deepEqual(filter(2, 1), true);
  t.deepEqual(filter(1, 2), false);
});

test('numberFieldKindFiltersByRule - lessThanOrEqual', (t) => {
  const filter = numberFieldKindFiltersByRule.lessThanOrEqual;

  t.deepEqual(filter(1, 2), true);
  t.deepEqual(filter(2, 2), true);
  t.deepEqual(filter(2, 1), false);
});

test('numberFieldKindFiltersByRule - greaterThanOrEqual', (t) => {
  const filter = numberFieldKindFiltersByRule.greaterThanOrEqual;

  t.deepEqual(filter(2, 1), true);
  t.deepEqual(filter(2, 2), true);
  t.deepEqual(filter(1, 2), false);
});

test('numberFieldKindFiltersByRule - isEmpty', (t) => {
  const filter = numberFieldKindFiltersByRule.isEmpty;

  t.deepEqual(filter(null, 0), true);
  t.deepEqual(filter(1, 0), false);
});

test('numberFieldKindFiltersByRule - isNotEmpty', (t) => {
  const filter = numberFieldKindFiltersByRule.isNotEmpty;

  t.deepEqual(filter(1, 0), true);
  t.deepEqual(filter(null, 0), false);
});

test('dateFieldKindFiltersByRule - is', (t) => {
  const filter = dateFieldKindFiltersByRule.is;

  t.deepEqual(filter(Day.toDate('2020-08-03'), Day.toDate('2020-08-03')), true);
  t.deepEqual(
    filter(Day.toDate('2020-08-03'), Day.toDate('2020-08-04')),
    false,
  );
});

test('dateFieldKindFiltersByRule - isWithin', (t) => {
  const filter = dateFieldKindFiltersByRule.isWithin;

  t.deepEqual(
    filter(Day.toDate('2020-08-03'), {
      start: Day.toDate('2020-08-02'),
      end: Day.toDate('2020-08-04'),
    }),
    true,
  );

  t.deepEqual(
    filter(Day.toDate('2020-08-05'), {
      start: Day.toDate('2020-08-02'),
      end: Day.toDate('2020-08-04'),
    }),
    false,
  );
});

test('dateFieldKindFiltersByRule - isBefore', (t) => {
  const filter = dateFieldKindFiltersByRule.isBefore;

  t.deepEqual(filter(Day.toDate('2020-08-03'), Day.toDate('2020-08-04')), true);
  t.deepEqual(
    filter(Day.toDate('2020-08-05'), Day.toDate('2020-08-04')),
    false,
  );
});

test('dateFieldKindFiltersByRule - isAfter', (t) => {
  const filter = dateFieldKindFiltersByRule.isAfter;

  t.deepEqual(filter(Day.toDate('2020-08-05'), Day.toDate('2020-08-04')), true);
  t.deepEqual(
    filter(Day.toDate('2020-08-03'), Day.toDate('2020-08-04')),
    false,
  );
});

test('dateFieldKindFiltersByRule - isOnOrBefore', (t) => {
  const filter = dateFieldKindFiltersByRule.isOnOrBefore;

  t.deepEqual(filter(Day.toDate('2020-08-03'), Day.toDate('2020-08-04')), true);
  t.deepEqual(filter(Day.toDate('2020-08-04'), Day.toDate('2020-08-04')), true);
  t.deepEqual(
    filter(Day.toDate('2020-08-05'), Day.toDate('2020-08-04')),
    false,
  );
});

test('dateFieldKindFiltersByRule - isOnOrAfter', (t) => {
  const filter = dateFieldKindFiltersByRule.isOnOrAfter;

  t.deepEqual(filter(Day.toDate('2020-08-05'), Day.toDate('2020-08-04')), true);
  t.deepEqual(filter(Day.toDate('2020-08-04'), Day.toDate('2020-08-04')), true);
  t.deepEqual(
    filter(Day.toDate('2020-08-03'), Day.toDate('2020-08-04')),
    false,
  );
});

test('dateFieldKindFiltersByRule - isNot', (t) => {
  const filter = dateFieldKindFiltersByRule.isNot;

  t.deepEqual(filter(Day.toDate('2020-08-05'), Day.toDate('2020-08-04')), true);
  t.deepEqual(
    filter(Day.toDate('2020-08-04'), Day.toDate('2020-08-04')),
    false,
  );
});

test('dateFieldKindFiltersByRule - isEmpty', (t) => {
  const filter = dateFieldKindFiltersByRule.isEmpty;

  t.deepEqual(filter(null, new Date()), true);
  t.deepEqual(filter(Day.toDate('2020-08-04'), new Date()), false);
});

test('dateFieldKindFiltersByRule - isNotEmpty', (t) => {
  const filter = dateFieldKindFiltersByRule.isNotEmpty;

  t.deepEqual(filter(Day.toDate('2020-08-04'), new Date()), true);
  t.deepEqual(filter(null, new Date()), false);
});

test('singleSelectFieldKindFiltersByRule - is', (t) => {
  const filter = singleSelectFieldKindFiltersByRule.is;

  t.deepEqual(filter('opt1', 'opt1'), true);
  t.deepEqual(filter('opt1', 'opt2'), false);
});

test('singleSelectFieldKindFiltersByRule - isNot', (t) => {
  const filter = singleSelectFieldKindFiltersByRule.isNot;

  t.deepEqual(filter('opt1', 'opt2'), true);
  t.deepEqual(filter('opt1', 'opt1'), false);
});

test('singleSelectFieldKindFiltersByRule - isAnyOf', (t) => {
  const filter = singleSelectFieldKindFiltersByRule.isAnyOf;

  t.deepEqual(filter('a', ['a', 'b']), true);
  t.deepEqual(filter('a', ['b', 'c']), false);
});

test('singleSelectFieldKindFiltersByRule - isNoneOf', (t) => {
  const filter = singleSelectFieldKindFiltersByRule.isNoneOf;

  t.deepEqual(filter('a', ['b', 'c']), true);
  t.deepEqual(filter('a', ['a', 'b']), false);
});

test('singleSelectFieldKindFiltersByRule - isEmpty', (t) => {
  const filter = singleSelectFieldKindFiltersByRule.isEmpty;

  t.deepEqual(filter(null, ''), true);
  t.deepEqual(filter('abc', ''), false);
});

test('singleSelectFieldKindFiltersByRule - isNotEmpty', (t) => {
  const filter = singleSelectFieldKindFiltersByRule.isNotEmpty;

  t.deepEqual(filter('abc', ''), true);
  t.deepEqual(filter(null, ''), false);
});

test('multiSelectFieldKindFiltersByRule - hasAnyOf', (t) => {
  const filter = multiSelectFieldKindFiltersByRule.hasAnyOf;

  t.deepEqual(filter(['a'], ['a', 'b']), true);
  t.deepEqual(filter(['a'], ['b', 'c']), false);
});

test('multiSelectFieldKindFiltersByRule - hasAllOf', (t) => {
  const filter = multiSelectFieldKindFiltersByRule.hasAllOf;

  t.deepEqual(filter(['b', 'a'], ['a', 'b']), true);
  t.deepEqual(filter(['a'], ['a', 'b']), false);
});

test('multiSelectFieldKindFiltersByRule - hasNoneOf', (t) => {
  const filter = multiSelectFieldKindFiltersByRule.hasNoneOf;

  t.deepEqual(filter(['a'], ['b', 'c']), true);
  t.deepEqual(filter(['a'], ['a', 'b']), false);
});

test('multiSelectFieldKindFiltersByRule - isEmpty', (t) => {
  const filter = multiSelectFieldKindFiltersByRule.isEmpty;

  t.deepEqual(filter([], []), true);
  t.deepEqual(filter(['a'], []), false);
});

test('multiSelectFieldKindFiltersByRule - isNotEmpty', (t) => {
  const filter = multiSelectFieldKindFiltersByRule.isNotEmpty;

  t.deepEqual(filter(['a'], []), true);
  t.deepEqual(filter([], []), false);
});

test('booleanFieldKindFiltersByRule - is', (t) => {
  const filter = booleanFieldKindFiltersByRule.is;

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
  // f1 AND f2 OR f3

  const updatedFilter2 = updatedFilters[filter2.id];
  const updatedFilter3 = updatedFilters[filter3.id];

  t.deepEqual(updatedFilter2.group, 1);
  t.deepEqual(updatedFilter3.group, 2);
});

test('updateFilterGroup - 3 "OR" filters to f1 AND f2 OR f3', (t) => {
  const filters = getOrFilters();
  const [, , filter3] = filters;
  // f1 OR f2 AND f3
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
