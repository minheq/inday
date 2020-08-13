import {
  textFiltersByRule,
  numberFiltersByRule,
  dateFiltersByRule,
  singleSelectFiltersByRule,
  multiSelectFiltersByRule,
  booleanFiltersByRule,
  Filter,
  updateFilterGroup,
} from './filters';
import { parseDay } from '../../lib/datetime/day';

describe('textFiltersByRule', () => {
  describe('contains', () => {
    const filter = textFiltersByRule.contains;

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
    const filter = textFiltersByRule.doesNotContain;

    test('ok', () => {
      expect(filter('abc', 'd')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('abc', 'a')).toBeFalsy();
    });
  });

  describe('is', () => {
    const filter = textFiltersByRule.is;

    test('ok', () => {
      expect(filter('abc', 'abc')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('abc', 'b')).toBeFalsy();
    });
  });

  describe('isNot', () => {
    const filter = textFiltersByRule.isNot;

    test('ok', () => {
      expect(filter('abc', 'b')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('abc', 'abc')).toBeFalsy();
    });
  });

  describe('isEmpty', () => {
    const filter = textFiltersByRule.isEmpty;

    test('ok', () => {
      expect(filter('', '')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('abc', '')).toBeFalsy();
    });
  });

  describe('isNotEmpty', () => {
    const filter = textFiltersByRule.isNotEmpty;

    test('ok', () => {
      expect(filter('abc', '')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('', '')).toBeFalsy();
    });
  });
});

describe('numberFiltersByRule', () => {
  describe('equal', () => {
    const filter = numberFiltersByRule.equal;

    test('ok', () => {
      expect(filter(1, 1)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(1, 2)).toBeFalsy();
    });
  });

  describe('notEqual', () => {
    const filter = numberFiltersByRule.notEqual;

    test('ok', () => {
      expect(filter(1, 2)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(1, 1)).toBeFalsy();
    });
  });

  describe('lessThan', () => {
    const filter = numberFiltersByRule.lessThan;

    test('ok', () => {
      expect(filter(1, 2)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(2, 1)).toBeFalsy();
    });
  });

  describe('greaterThan', () => {
    const filter = numberFiltersByRule.greaterThan;

    test('ok', () => {
      expect(filter(2, 1)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(1, 2)).toBeFalsy();
    });
  });

  describe('lessThanOrEqual', () => {
    const filter = numberFiltersByRule.lessThanOrEqual;

    test('ok', () => {
      expect(filter(1, 2)).toBeTruthy();
      expect(filter(2, 2)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(2, 1)).toBeFalsy();
    });
  });

  describe('greaterThanOrEqual', () => {
    const filter = numberFiltersByRule.greaterThanOrEqual;

    test('ok', () => {
      expect(filter(2, 1)).toBeTruthy();
      expect(filter(2, 2)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(1, 2)).toBeFalsy();
    });
  });

  describe('isEmpty', () => {
    const filter = numberFiltersByRule.isEmpty;

    test('ok', () => {
      expect(filter(null, 0)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(1, 0)).toBeFalsy();
    });
  });

  describe('isNotEmpty', () => {
    const filter = numberFiltersByRule.isNotEmpty;

    test('ok', () => {
      expect(filter(1, 0)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(null, 0)).toBeFalsy();
    });
  });
});

describe('dateFiltersByRule', () => {
  describe('is', () => {
    const filter = dateFiltersByRule.is;

    test('ok', () => {
      expect(
        filter(parseDay('2020-08-03'), parseDay('2020-08-03')),
      ).toBeTruthy();
    });

    test('not ok', () => {
      expect(
        filter(parseDay('2020-08-03'), parseDay('2020-08-04')),
      ).toBeFalsy();
    });
  });

  describe('isWithin', () => {
    const filter = dateFiltersByRule.isWithin;

    test('ok', () => {
      expect(
        filter(parseDay('2020-08-03'), {
          start: parseDay('2020-08-02'),
          end: parseDay('2020-08-04'),
        }),
      ).toBeTruthy();
    });

    test('not ok', () => {
      expect(
        filter(parseDay('2020-08-05'), {
          start: parseDay('2020-08-02'),
          end: parseDay('2020-08-04'),
        }),
      ).toBeFalsy();
    });
  });

  describe('isBefore', () => {
    const filter = dateFiltersByRule.isBefore;

    test('ok', () => {
      expect(
        filter(parseDay('2020-08-03'), parseDay('2020-08-04')),
      ).toBeTruthy();
    });

    test('not ok', () => {
      expect(
        filter(parseDay('2020-08-05'), parseDay('2020-08-04')),
      ).toBeFalsy();
    });
  });

  describe('isAfter', () => {
    const filter = dateFiltersByRule.isAfter;

    test('ok', () => {
      expect(
        filter(parseDay('2020-08-05'), parseDay('2020-08-04')),
      ).toBeTruthy();
    });

    test('not ok', () => {
      expect(
        filter(parseDay('2020-08-03'), parseDay('2020-08-04')),
      ).toBeFalsy();
    });
  });

  describe('isOnOrBefore', () => {
    const filter = dateFiltersByRule.isOnOrBefore;

    test('ok', () => {
      expect(
        filter(parseDay('2020-08-03'), parseDay('2020-08-04')),
      ).toBeTruthy();
      expect(
        filter(parseDay('2020-08-04'), parseDay('2020-08-04')),
      ).toBeTruthy();
    });

    test('not ok', () => {
      expect(
        filter(parseDay('2020-08-05'), parseDay('2020-08-04')),
      ).toBeFalsy();
    });
  });

  describe('isOnOrAfter', () => {
    const filter = dateFiltersByRule.isOnOrAfter;

    test('ok', () => {
      expect(
        filter(parseDay('2020-08-05'), parseDay('2020-08-04')),
      ).toBeTruthy();
      expect(
        filter(parseDay('2020-08-04'), parseDay('2020-08-04')),
      ).toBeTruthy();
    });

    test('not ok', () => {
      expect(
        filter(parseDay('2020-08-03'), parseDay('2020-08-04')),
      ).toBeFalsy();
    });
  });

  describe('isNot', () => {
    const filter = dateFiltersByRule.isNot;

    test('ok', () => {
      expect(
        filter(parseDay('2020-08-05'), parseDay('2020-08-04')),
      ).toBeTruthy();
    });

    test('not ok', () => {
      expect(
        filter(parseDay('2020-08-04'), parseDay('2020-08-04')),
      ).toBeFalsy();
    });
  });

  describe('isEmpty', () => {
    const filter = dateFiltersByRule.isEmpty;

    test('ok', () => {
      expect(filter(null, new Date())).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(parseDay('2020-08-04'), new Date())).toBeFalsy();
    });
  });

  describe('isNotEmpty', () => {
    const filter = dateFiltersByRule.isNotEmpty;

    test('ok', () => {
      expect(filter(parseDay('2020-08-04'), new Date())).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(null, new Date())).toBeFalsy();
    });
  });
});

describe('singleSelectFiltersByRule', () => {
  describe('is', () => {
    const filter = singleSelectFiltersByRule.is;

    test('ok', () => {
      expect(filter('a', 'a')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('a', 'b')).toBeFalsy();
    });
  });

  describe('isNot', () => {
    const filter = singleSelectFiltersByRule.isNot;

    test('ok', () => {
      expect(filter('ab', 'a')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('a', 'a')).toBeFalsy();
    });
  });

  describe('isAnyOf', () => {
    const filter = singleSelectFiltersByRule.isAnyOf;

    test('ok', () => {
      expect(filter('a', ['a', 'b'])).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('a', ['b', 'c'])).toBeFalsy();
    });
  });

  describe('isNoneOf', () => {
    const filter = singleSelectFiltersByRule.isNoneOf;

    test('ok', () => {
      expect(filter('a', ['b', 'c'])).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('a', ['a', 'b'])).toBeFalsy();
    });
  });

  describe('isEmpty', () => {
    const filter = singleSelectFiltersByRule.isEmpty;

    test('ok', () => {
      expect(filter(null, '')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('abc', '')).toBeFalsy();
    });
  });

  describe('isNotEmpty', () => {
    const filter = singleSelectFiltersByRule.isNotEmpty;

    test('ok', () => {
      expect(filter('abc', '')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(null, '')).toBeFalsy();
    });
  });
});

describe('multiSelectFiltersByRule', () => {
  describe('hasAnyOf', () => {
    const filter = multiSelectFiltersByRule.hasAnyOf;

    test('ok', () => {
      expect(filter(['a'], ['a', 'b'])).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(['a'], ['b', 'c'])).toBeFalsy();
    });
  });

  describe('hasAllOf', () => {
    const filter = multiSelectFiltersByRule.hasAllOf;

    test('ok', () => {
      expect(filter(['b', 'a'], ['a', 'b'])).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(['a'], ['a', 'b'])).toBeFalsy();
    });
  });

  describe('hasNoneOf', () => {
    const filter = multiSelectFiltersByRule.hasNoneOf;

    test('ok', () => {
      expect(filter(['a'], ['b', 'c'])).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(['a'], ['a', 'b'])).toBeFalsy();
    });
  });

  describe('isEmpty', () => {
    const filter = multiSelectFiltersByRule.isEmpty;

    test('ok', () => {
      expect(filter([], [])).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(['a'], [])).toBeFalsy();
    });
  });

  describe('isNotEmpty', () => {
    const filter = multiSelectFiltersByRule.isNotEmpty;

    test('ok', () => {
      expect(filter(['a'], [])).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter([], [])).toBeFalsy();
    });
  });
});

describe('booleanFiltersByRule', () => {
  describe('is', () => {
    const filter = booleanFiltersByRule.is;

    test('ok', () => {
      expect(filter(true, true)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(true, false)).toBeFalsy();
    });
  });
});

describe('updateFilterGroup', () => {
  describe('3 or filters', () => {
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

    test('f1 and f2 or f3', () => {
      const updatedFilters = updateFilterGroup(filter2, 'and', filters);

      const updatedFilter2 = updatedFilters[filter2.id];
      const updatedFilter3 = updatedFilters[filter3.id];

      expect(updatedFilter2.group).toBe(1);
      expect(updatedFilter3.group).toBe(2);
    });

    test('f1 or f2 and f3', () => {
      const updatedFilters = updateFilterGroup(filter3, 'and', filters);

      const updatedFilter3 = updatedFilters[filter3.id];

      expect(updatedFilter3.group).toBe(2);
    });
  });

  describe('3 and filters', () => {
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
