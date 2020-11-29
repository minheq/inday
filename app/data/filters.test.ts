import { test } from 'zora';
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
  t.test('all records', (t) => {
    const values = ['AWord', 'BWord'];
    const { records, getters } = prepare(FieldType.SingleLineText, values);
    const result = filterRecords([], records, getters);

    t.equals(result.length, values.length);
  });
});

test('filtering text', (t) => {
  const values = ['AWord', 'BWord'];
  const { records, getters, field } = prepare(FieldType.SingleLineText, values);

  t.test('contains same case', (t) => {
    const filter = makeFilter(
      {},
      { rule: 'contains', value: 'Word', fieldID: field.id },
    );
    const result = filterRecords([[filter]], records, getters);

    t.equals(result.length, values.length);
  });

  t.test('one word different case', (t) => {
    const filter = makeFilter(
      {},
      { rule: 'contains', value: 'aword', fieldID: field.id },
    );
    const result = filterRecords([[filter]], records, getters);

    t.equals(result.length, 1);
  });

  t.test('2 for one', (t) => {
    const filter1 = makeFilter(
      {},
      { rule: 'contains', value: 'word', fieldID: field.id },
    );
    const filter2 = makeFilter(
      {},
      { rule: 'contains', value: 'a', fieldID: field.id },
    );
    const result = filterRecords([[filter1, filter2]], records, getters);

    t.equals(result.length, 1);
  });
});

test('textFieldKindFiltersByRule', (t) => {
  t.test('contains', (t) => {
    const filter = textFieldKindFiltersByRule.contains;

    t.test('ok same case', (t) => {
      t.equals(filter('abc', 'a'), true);
    });

    t.test('ok difference case', (t) => {
      t.equals(filter('abc', 'A'), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter('abc', 'd'), false);
    });
  });

  t.test('doesNotContain', (t) => {
    const filter = textFieldKindFiltersByRule.doesNotContain;

    t.test('ok', (t) => {
      t.equals(filter('abc', 'd'), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter('abc', 'a'), false);
    });
  });

  t.test('is', (t) => {
    const filter = textFieldKindFiltersByRule.is;

    t.test('ok', (t) => {
      t.equals(filter('abc', 'abc'), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter('abc', 'b'), false);
    });
  });

  t.test('isNot', (t) => {
    const filter = textFieldKindFiltersByRule.isNot;

    t.test('ok', (t) => {
      t.equals(filter('abc', 'b'), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter('abc', 'abc'), false);
    });
  });

  t.test('isEmpty', (t) => {
    const filter = textFieldKindFiltersByRule.isEmpty;

    t.test('ok', (t) => {
      t.equals(filter('', ''), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter('abc', ''), false);
    });
  });

  t.test('isNotEmpty', (t) => {
    const filter = textFieldKindFiltersByRule.isNotEmpty;

    t.test('ok', (t) => {
      t.equals(filter('abc', ''), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter('', ''), false);
    });
  });
});

test('numberFieldKindFiltersByRule', (t) => {
  t.test('equal', (t) => {
    const filter = numberFieldKindFiltersByRule.equal;

    t.test('ok', (t) => {
      t.equals(filter(1, 1), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter(1, 2), false);
    });
  });

  t.test('notEqual', (t) => {
    const filter = numberFieldKindFiltersByRule.notEqual;

    t.test('ok', (t) => {
      t.equals(filter(1, 2), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter(1, 1), false);
    });
  });

  t.test('lessThan', (t) => {
    const filter = numberFieldKindFiltersByRule.lessThan;

    t.test('ok', (t) => {
      t.equals(filter(1, 2), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter(2, 1), false);
    });
  });

  t.test('greaterThan', (t) => {
    const filter = numberFieldKindFiltersByRule.greaterThan;

    t.test('ok', (t) => {
      t.equals(filter(2, 1), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter(1, 2), false);
    });
  });

  t.test('lessThanOrEqual', (t) => {
    const filter = numberFieldKindFiltersByRule.lessThanOrEqual;

    t.test('ok', (t) => {
      t.equals(filter(1, 2), true);
      t.equals(filter(2, 2), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter(2, 1), false);
    });
  });

  t.test('greaterThanOrEqual', (t) => {
    const filter = numberFieldKindFiltersByRule.greaterThanOrEqual;

    t.test('ok', (t) => {
      t.equals(filter(2, 1), true);
      t.equals(filter(2, 2), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter(1, 2), false);
    });
  });

  t.test('isEmpty', (t) => {
    const filter = numberFieldKindFiltersByRule.isEmpty;

    t.test('ok', (t) => {
      t.equals(filter(null, 0), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter(1, 0), false);
    });
  });

  t.test('isNotEmpty', (t) => {
    const filter = numberFieldKindFiltersByRule.isNotEmpty;

    t.test('ok', (t) => {
      t.equals(filter(1, 0), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter(null, 0), false);
    });
  });
});

test('dateFieldKindFiltersByRule', (t) => {
  t.test('is', (t) => {
    const filter = dateFieldKindFiltersByRule.is;

    t.test('ok', (t) => {
      t.equals(
        filter(Day.toDate('2020-08-03'), Day.toDate('2020-08-03')),
        true,
      );
    });

    t.test('not ok', (t) => {
      t.equals(
        filter(Day.toDate('2020-08-03'), Day.toDate('2020-08-04')),
        false,
      );
    });
  });

  t.test('isWithin', (t) => {
    const filter = dateFieldKindFiltersByRule.isWithin;

    t.test('ok', (t) => {
      t.equals(
        filter(Day.toDate('2020-08-03'), {
          start: Day.toDate('2020-08-02'),
          end: Day.toDate('2020-08-04'),
        }),
        true,
      );
    });

    t.test('not ok', (t) => {
      t.equals(
        filter(Day.toDate('2020-08-05'), {
          start: Day.toDate('2020-08-02'),
          end: Day.toDate('2020-08-04'),
        }),
        false,
      );
    });
  });

  t.test('isBefore', (t) => {
    const filter = dateFieldKindFiltersByRule.isBefore;

    t.test('ok', (t) => {
      t.equals(
        filter(Day.toDate('2020-08-03'), Day.toDate('2020-08-04')),
        true,
      );
    });

    t.test('not ok', (t) => {
      t.equals(
        filter(Day.toDate('2020-08-05'), Day.toDate('2020-08-04')),
        false,
      );
    });
  });

  t.test('isAfter', (t) => {
    const filter = dateFieldKindFiltersByRule.isAfter;

    t.test('ok', (t) => {
      t.equals(
        filter(Day.toDate('2020-08-05'), Day.toDate('2020-08-04')),
        true,
      );
    });

    t.test('not ok', (t) => {
      t.equals(
        filter(Day.toDate('2020-08-03'), Day.toDate('2020-08-04')),
        false,
      );
    });
  });

  t.test('isOnOrBefore', (t) => {
    const filter = dateFieldKindFiltersByRule.isOnOrBefore;

    t.test('ok', (t) => {
      t.equals(
        filter(Day.toDate('2020-08-03'), Day.toDate('2020-08-04')),
        true,
      );
      t.equals(
        filter(Day.toDate('2020-08-04'), Day.toDate('2020-08-04')),
        true,
      );
    });

    t.test('not ok', (t) => {
      t.equals(
        filter(Day.toDate('2020-08-05'), Day.toDate('2020-08-04')),
        false,
      );
    });
  });

  t.test('isOnOrAfter', (t) => {
    const filter = dateFieldKindFiltersByRule.isOnOrAfter;

    t.test('ok', (t) => {
      t.equals(
        filter(Day.toDate('2020-08-05'), Day.toDate('2020-08-04')),
        true,
      );
      t.equals(
        filter(Day.toDate('2020-08-04'), Day.toDate('2020-08-04')),
        true,
      );
    });

    t.test('not ok', (t) => {
      t.equals(
        filter(Day.toDate('2020-08-03'), Day.toDate('2020-08-04')),
        false,
      );
    });
  });

  t.test('isNot', (t) => {
    const filter = dateFieldKindFiltersByRule.isNot;

    t.test('ok', (t) => {
      t.equals(
        filter(Day.toDate('2020-08-05'), Day.toDate('2020-08-04')),
        true,
      );
    });

    t.test('not ok', (t) => {
      t.equals(
        filter(Day.toDate('2020-08-04'), Day.toDate('2020-08-04')),
        false,
      );
    });
  });

  t.test('isEmpty', (t) => {
    const filter = dateFieldKindFiltersByRule.isEmpty;

    t.test('ok', (t) => {
      t.equals(filter(null, new Date()), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter(Day.toDate('2020-08-04'), new Date()), false);
    });
  });

  t.test('isNotEmpty', (t) => {
    const filter = dateFieldKindFiltersByRule.isNotEmpty;

    t.test('ok', (t) => {
      t.equals(filter(Day.toDate('2020-08-04'), new Date()), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter(null, new Date()), false);
    });
  });
});

test('singleSelectFieldKindFiltersByRule', (t) => {
  t.test('is', (t) => {
    const filter = singleSelectFieldKindFiltersByRule.is;

    t.test('ok', (t) => {
      t.equals(filter('opt1', 'opt1'), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter('opt1', 'opt2'), false);
    });
  });

  t.test('isNot', (t) => {
    const filter = singleSelectFieldKindFiltersByRule.isNot;

    t.test('ok', (t) => {
      t.equals(filter('opt1', 'opt2'), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter('opt1', 'opt1'), false);
    });
  });

  t.test('isAnyOf', (t) => {
    const filter = singleSelectFieldKindFiltersByRule.isAnyOf;

    t.test('ok', (t) => {
      t.equals(filter('a', ['a', 'b']), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter('a', ['b', 'c']), false);
    });
  });

  t.test('isNoneOf', (t) => {
    const filter = singleSelectFieldKindFiltersByRule.isNoneOf;

    t.test('ok', (t) => {
      t.equals(filter('a', ['b', 'c']), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter('a', ['a', 'b']), false);
    });
  });

  t.test('isEmpty', (t) => {
    const filter = singleSelectFieldKindFiltersByRule.isEmpty;

    t.test('ok', (t) => {
      t.equals(filter(null, ''), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter('abc', ''), false);
    });
  });

  t.test('isNotEmpty', (t) => {
    const filter = singleSelectFieldKindFiltersByRule.isNotEmpty;

    t.test('ok', (t) => {
      t.equals(filter('abc', ''), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter(null, ''), false);
    });
  });
});

test('multiSelectFieldKindFiltersByRule', (t) => {
  t.test('hasAnyOf', (t) => {
    const filter = multiSelectFieldKindFiltersByRule.hasAnyOf;

    t.test('ok', (t) => {
      t.equals(filter(['a'], ['a', 'b']), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter(['a'], ['b', 'c']), false);
    });
  });

  t.test('hasAllOf', (t) => {
    const filter = multiSelectFieldKindFiltersByRule.hasAllOf;

    t.test('ok', (t) => {
      t.equals(filter(['b', 'a'], ['a', 'b']), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter(['a'], ['a', 'b']), false);
    });
  });

  t.test('hasNoneOf', (t) => {
    const filter = multiSelectFieldKindFiltersByRule.hasNoneOf;

    t.test('ok', (t) => {
      t.equals(filter(['a'], ['b', 'c']), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter(['a'], ['a', 'b']), false);
    });
  });

  t.test('isEmpty', (t) => {
    const filter = multiSelectFieldKindFiltersByRule.isEmpty;

    t.test('ok', (t) => {
      t.equals(filter([], []), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter(['a'], []), false);
    });
  });

  t.test('isNotEmpty', (t) => {
    const filter = multiSelectFieldKindFiltersByRule.isNotEmpty;

    t.test('ok', (t) => {
      t.equals(filter(['a'], []), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter([], []), false);
    });
  });
});

test('booleanFieldKindFiltersByRule', (t) => {
  t.test('is', (t) => {
    const filter = booleanFieldKindFiltersByRule.is;

    t.test('ok', (t) => {
      t.equals(filter(true, true), true);
    });

    t.test('not ok', (t) => {
      t.equals(filter(true, false), false);
    });
  });
});

test('updateFilterGroup', (t) => {
  t.test('3 "OR" filters', (t) => {
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

    t.test('f1 AND f2 OR f3', (t) => {
      const updatedFilters = updateFilterGroup(filter2, 'and', filters);

      const updatedFilter2 = updatedFilters[filter2.id];
      const updatedFilter3 = updatedFilters[filter3.id];

      t.equals(updatedFilter2.group, 1);
      t.equals(updatedFilter3.group, 2);
    });

    t.test('f1 OR f2 AND f3', (t) => {
      const updatedFilters = updateFilterGroup(filter3, 'and', filters);

      const updatedFilter3 = updatedFilters[filter3.id];

      t.equals(updatedFilter3.group, 2);
    });
  });

  t.test('3 "AND" filters', (t) => {
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

    t.test('f1 and f2 or f3', (t) => {
      const updatedFilters = updateFilterGroup(filter3, 'or', filters);

      const updatedFilter3 = updatedFilters[filter3.id];

      t.equals(updatedFilter3.group, 2);
    });

    t.test('f1 or f2 and f3', (t) => {
      const updatedFilters = updateFilterGroup(filter2, 'or', filters);
      const updatedFilter2 = updatedFilters[filter2.id];
      const updatedFilter3 = updatedFilters[filter3.id];

      t.equals(updatedFilter2.group, 2);
      t.equals(updatedFilter3.group, 2);
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
