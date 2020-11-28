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

describe('no filter', () => {
  test('all records', () => {
    const values = ['AWord', 'BWord'];
    const { records, getters } = prepare(FieldType.SingleLineText, values);
    const result = filterRecords([], records, getters);

    expect(result).toHaveLength(values.length);
  });
});

describe('filtering text', () => {
  const values = ['AWord', 'BWord'];
  const { records, getters, field } = prepare(FieldType.SingleLineText, values);

  test('contains same case', () => {
    const filter = makeFilter(
      {},
      { rule: 'contains', value: 'Word', fieldID: field.id },
    );
    const result = filterRecords([[filter]], records, getters);

    expect(result).toHaveLength(values.length);
  });

  test('one word different case', () => {
    const filter = makeFilter(
      {},
      { rule: 'contains', value: 'aword', fieldID: field.id },
    );
    const result = filterRecords([[filter]], records, getters);

    expect(result).toHaveLength(1);
  });

  test('2 for one', () => {
    const filter1 = makeFilter(
      {},
      { rule: 'contains', value: 'word', fieldID: field.id },
    );
    const filter2 = makeFilter(
      {},
      { rule: 'contains', value: 'a', fieldID: field.id },
    );
    const result = filterRecords([[filter1, filter2]], records, getters);

    expect(result).toHaveLength(1);
  });
});

describe('textFieldKindFiltersByRule', () => {
  describe('contains', () => {
    const filter = textFieldKindFiltersByRule.contains;

    test('ok same case', () => {
      expect(filter('abc', 'a')).toBeTruthy();
    });

    test('ok difference case', () => {
      expect(filter('abc', 'A')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('abc', 'd')).toBeFalsy();
    });
  });

  describe('doesNotContain', () => {
    const filter = textFieldKindFiltersByRule.doesNotContain;

    test('ok', () => {
      expect(filter('abc', 'd')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('abc', 'a')).toBeFalsy();
    });
  });

  describe('is', () => {
    const filter = textFieldKindFiltersByRule.is;

    test('ok', () => {
      expect(filter('abc', 'abc')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('abc', 'b')).toBeFalsy();
    });
  });

  describe('isNot', () => {
    const filter = textFieldKindFiltersByRule.isNot;

    test('ok', () => {
      expect(filter('abc', 'b')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('abc', 'abc')).toBeFalsy();
    });
  });

  describe('isEmpty', () => {
    const filter = textFieldKindFiltersByRule.isEmpty;

    test('ok', () => {
      expect(filter('', '')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('abc', '')).toBeFalsy();
    });
  });

  describe('isNotEmpty', () => {
    const filter = textFieldKindFiltersByRule.isNotEmpty;

    test('ok', () => {
      expect(filter('abc', '')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('', '')).toBeFalsy();
    });
  });
});

describe('numberFieldKindFiltersByRule', () => {
  describe('equal', () => {
    const filter = numberFieldKindFiltersByRule.equal;

    test('ok', () => {
      expect(filter(1, 1)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(1, 2)).toBeFalsy();
    });
  });

  describe('notEqual', () => {
    const filter = numberFieldKindFiltersByRule.notEqual;

    test('ok', () => {
      expect(filter(1, 2)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(1, 1)).toBeFalsy();
    });
  });

  describe('lessThan', () => {
    const filter = numberFieldKindFiltersByRule.lessThan;

    test('ok', () => {
      expect(filter(1, 2)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(2, 1)).toBeFalsy();
    });
  });

  describe('greaterThan', () => {
    const filter = numberFieldKindFiltersByRule.greaterThan;

    test('ok', () => {
      expect(filter(2, 1)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(1, 2)).toBeFalsy();
    });
  });

  describe('lessThanOrEqual', () => {
    const filter = numberFieldKindFiltersByRule.lessThanOrEqual;

    test('ok', () => {
      expect(filter(1, 2)).toBeTruthy();
      expect(filter(2, 2)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(2, 1)).toBeFalsy();
    });
  });

  describe('greaterThanOrEqual', () => {
    const filter = numberFieldKindFiltersByRule.greaterThanOrEqual;

    test('ok', () => {
      expect(filter(2, 1)).toBeTruthy();
      expect(filter(2, 2)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(1, 2)).toBeFalsy();
    });
  });

  describe('isEmpty', () => {
    const filter = numberFieldKindFiltersByRule.isEmpty;

    test('ok', () => {
      expect(filter(null, 0)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(1, 0)).toBeFalsy();
    });
  });

  describe('isNotEmpty', () => {
    const filter = numberFieldKindFiltersByRule.isNotEmpty;

    test('ok', () => {
      expect(filter(1, 0)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(null, 0)).toBeFalsy();
    });
  });
});

describe('dateFieldKindFiltersByRule', () => {
  describe('is', () => {
    const filter = dateFieldKindFiltersByRule.is;

    test('ok', () => {
      expect(
        filter(Day.toDate('2020-08-03'), Day.toDate('2020-08-03')),
      ).toBeTruthy();
    });

    test('not ok', () => {
      expect(
        filter(Day.toDate('2020-08-03'), Day.toDate('2020-08-04')),
      ).toBeFalsy();
    });
  });

  describe('isWithin', () => {
    const filter = dateFieldKindFiltersByRule.isWithin;

    test('ok', () => {
      expect(
        filter(Day.toDate('2020-08-03'), {
          start: Day.toDate('2020-08-02'),
          end: Day.toDate('2020-08-04'),
        }),
      ).toBeTruthy();
    });

    test('not ok', () => {
      expect(
        filter(Day.toDate('2020-08-05'), {
          start: Day.toDate('2020-08-02'),
          end: Day.toDate('2020-08-04'),
        }),
      ).toBeFalsy();
    });
  });

  describe('isBefore', () => {
    const filter = dateFieldKindFiltersByRule.isBefore;

    test('ok', () => {
      expect(
        filter(Day.toDate('2020-08-03'), Day.toDate('2020-08-04')),
      ).toBeTruthy();
    });

    test('not ok', () => {
      expect(
        filter(Day.toDate('2020-08-05'), Day.toDate('2020-08-04')),
      ).toBeFalsy();
    });
  });

  describe('isAfter', () => {
    const filter = dateFieldKindFiltersByRule.isAfter;

    test('ok', () => {
      expect(
        filter(Day.toDate('2020-08-05'), Day.toDate('2020-08-04')),
      ).toBeTruthy();
    });

    test('not ok', () => {
      expect(
        filter(Day.toDate('2020-08-03'), Day.toDate('2020-08-04')),
      ).toBeFalsy();
    });
  });

  describe('isOnOrBefore', () => {
    const filter = dateFieldKindFiltersByRule.isOnOrBefore;

    test('ok', () => {
      expect(
        filter(Day.toDate('2020-08-03'), Day.toDate('2020-08-04')),
      ).toBeTruthy();
      expect(
        filter(Day.toDate('2020-08-04'), Day.toDate('2020-08-04')),
      ).toBeTruthy();
    });

    test('not ok', () => {
      expect(
        filter(Day.toDate('2020-08-05'), Day.toDate('2020-08-04')),
      ).toBeFalsy();
    });
  });

  describe('isOnOrAfter', () => {
    const filter = dateFieldKindFiltersByRule.isOnOrAfter;

    test('ok', () => {
      expect(
        filter(Day.toDate('2020-08-05'), Day.toDate('2020-08-04')),
      ).toBeTruthy();
      expect(
        filter(Day.toDate('2020-08-04'), Day.toDate('2020-08-04')),
      ).toBeTruthy();
    });

    test('not ok', () => {
      expect(
        filter(Day.toDate('2020-08-03'), Day.toDate('2020-08-04')),
      ).toBeFalsy();
    });
  });

  describe('isNot', () => {
    const filter = dateFieldKindFiltersByRule.isNot;

    test('ok', () => {
      expect(
        filter(Day.toDate('2020-08-05'), Day.toDate('2020-08-04')),
      ).toBeTruthy();
    });

    test('not ok', () => {
      expect(
        filter(Day.toDate('2020-08-04'), Day.toDate('2020-08-04')),
      ).toBeFalsy();
    });
  });

  describe('isEmpty', () => {
    const filter = dateFieldKindFiltersByRule.isEmpty;

    test('ok', () => {
      expect(filter(null, new Date())).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(Day.toDate('2020-08-04'), new Date())).toBeFalsy();
    });
  });

  describe('isNotEmpty', () => {
    const filter = dateFieldKindFiltersByRule.isNotEmpty;

    test('ok', () => {
      expect(filter(Day.toDate('2020-08-04'), new Date())).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(null, new Date())).toBeFalsy();
    });
  });
});

describe('singleSelectFieldKindFiltersByRule', () => {
  describe('is', () => {
    const filter = singleSelectFieldKindFiltersByRule.is;

    test('ok', () => {
      expect(filter('a', 'a')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('a', 'b')).toBeFalsy();
    });
  });

  describe('isNot', () => {
    const filter = singleSelectFieldKindFiltersByRule.isNot;

    test('ok', () => {
      expect(filter('ab', 'a')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('a', 'a')).toBeFalsy();
    });
  });

  describe('isAnyOf', () => {
    const filter = singleSelectFieldKindFiltersByRule.isAnyOf;

    test('ok', () => {
      expect(filter('a', ['a', 'b'])).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('a', ['b', 'c'])).toBeFalsy();
    });
  });

  describe('isNoneOf', () => {
    const filter = singleSelectFieldKindFiltersByRule.isNoneOf;

    test('ok', () => {
      expect(filter('a', ['b', 'c'])).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('a', ['a', 'b'])).toBeFalsy();
    });
  });

  describe('isEmpty', () => {
    const filter = singleSelectFieldKindFiltersByRule.isEmpty;

    test('ok', () => {
      expect(filter(null, '')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('abc', '')).toBeFalsy();
    });
  });

  describe('isNotEmpty', () => {
    const filter = singleSelectFieldKindFiltersByRule.isNotEmpty;

    test('ok', () => {
      expect(filter('abc', '')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(null, '')).toBeFalsy();
    });
  });
});

describe('multiSelectFieldKindFiltersByRule', () => {
  describe('hasAnyOf', () => {
    const filter = multiSelectFieldKindFiltersByRule.hasAnyOf;

    test('ok', () => {
      expect(filter(['a'], ['a', 'b'])).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(['a'], ['b', 'c'])).toBeFalsy();
    });
  });

  describe('hasAllOf', () => {
    const filter = multiSelectFieldKindFiltersByRule.hasAllOf;

    test('ok', () => {
      expect(filter(['b', 'a'], ['a', 'b'])).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(['a'], ['a', 'b'])).toBeFalsy();
    });
  });

  describe('hasNoneOf', () => {
    const filter = multiSelectFieldKindFiltersByRule.hasNoneOf;

    test('ok', () => {
      expect(filter(['a'], ['b', 'c'])).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(['a'], ['a', 'b'])).toBeFalsy();
    });
  });

  describe('isEmpty', () => {
    const filter = multiSelectFieldKindFiltersByRule.isEmpty;

    test('ok', () => {
      expect(filter([], [])).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(['a'], [])).toBeFalsy();
    });
  });

  describe('isNotEmpty', () => {
    const filter = multiSelectFieldKindFiltersByRule.isNotEmpty;

    test('ok', () => {
      expect(filter(['a'], [])).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter([], [])).toBeFalsy();
    });
  });
});

describe('booleanFieldKindFiltersByRule', () => {
  describe('is', () => {
    const filter = booleanFieldKindFiltersByRule.is;

    test('ok', () => {
      expect(filter(true, true)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(true, false)).toBeFalsy();
    });
  });
});

describe('updateFilterGroup', () => {
  describe('3 "OR" filters', () => {
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

    const filters: Filter[] = [filter1, filter2, filter3];

    test('f1 AND f2 OR f3', () => {
      const updatedFilters = updateFilterGroup(filter2, 'and', filters);

      const updatedFilter2 = updatedFilters[filter2.id];
      const updatedFilter3 = updatedFilters[filter3.id];

      expect(updatedFilter2.group).toBe(1);
      expect(updatedFilter3.group).toBe(2);
    });

    test('f1 OR f2 AND f3', () => {
      const updatedFilters = updateFilterGroup(filter3, 'and', filters);

      const updatedFilter3 = updatedFilters[filter3.id];

      expect(updatedFilter3.group).toBe(2);
    });
  });

  describe('3 "AND" filters', () => {
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

    const filters: Filter[] = [filter1, filter2, filter3];

    test('f1 and f2 or f3', () => {
      const updatedFilters = updateFilterGroup(filter3, 'or', filters);

      const updatedFilter3 = updatedFilters[filter3.id];

      expect(updatedFilter3.group).toBe(2);
    });

    test('f1 or f2 and f3', () => {
      const updatedFilters = updateFilterGroup(filter2, 'or', filters);
      const updatedFilter2 = updatedFilters[filter2.id];
      const updatedFilter3 = updatedFilters[filter3.id];

      expect(updatedFilter2.group).toBe(2);
      expect(updatedFilter3.group).toBe(2);
    });
  });
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
