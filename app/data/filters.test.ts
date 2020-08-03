import {
  textFiltersByCondition,
  numberFiltersByCondition,
  dateFiltersByCondition,
} from './filters';
import { parseDay } from '../../lib/datetime/day';

describe('textFiltersByCondition', () => {
  describe('contains', () => {
    const filter = textFiltersByCondition.contains;

    test('ok', () => {
      expect(filter('abc', 'a')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('abc', 'd')).toBeFalsy();
    });
  });

  describe('doesNotContain', () => {
    const filter = textFiltersByCondition.doesNotContain;

    test('ok', () => {
      expect(filter('abc', 'd')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('abc', 'a')).toBeFalsy();
    });
  });

  describe('is', () => {
    const filter = textFiltersByCondition.is;

    test('ok', () => {
      expect(filter('abc', 'abc')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('abc', 'b')).toBeFalsy();
    });
  });

  describe('isNot', () => {
    const filter = textFiltersByCondition.isNot;

    test('ok', () => {
      expect(filter('abc', 'b')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('abc', 'abc')).toBeFalsy();
    });
  });

  describe('isEmpty', () => {
    const filter = textFiltersByCondition.isEmpty;

    test('ok', () => {
      expect(filter('', '')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('abc', '')).toBeFalsy();
    });
  });

  describe('isNotEmpty', () => {
    const filter = textFiltersByCondition.isNotEmpty;

    test('ok', () => {
      expect(filter('abc', '')).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter('', '')).toBeFalsy();
    });
  });
});

describe('numberFiltersByCondition', () => {
  describe('equal', () => {
    const filter = numberFiltersByCondition.equal;

    test('ok', () => {
      expect(filter(1, 1)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(1, 2)).toBeFalsy();
    });
  });

  describe('notEqual', () => {
    const filter = numberFiltersByCondition.notEqual;

    test('ok', () => {
      expect(filter(1, 2)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(1, 1)).toBeFalsy();
    });
  });

  describe('lessThan', () => {
    const filter = numberFiltersByCondition.lessThan;

    test('ok', () => {
      expect(filter(1, 2)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(2, 1)).toBeFalsy();
    });
  });

  describe('greaterThan', () => {
    const filter = numberFiltersByCondition.greaterThan;

    test('ok', () => {
      expect(filter(2, 1)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(1, 2)).toBeFalsy();
    });
  });

  describe('lessThanOrEqual', () => {
    const filter = numberFiltersByCondition.lessThanOrEqual;

    test('ok', () => {
      expect(filter(1, 2)).toBeTruthy();
      expect(filter(2, 2)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(2, 1)).toBeFalsy();
    });
  });

  describe('greaterThanOrEqual', () => {
    const filter = numberFiltersByCondition.greaterThanOrEqual;

    test('ok', () => {
      expect(filter(2, 1)).toBeTruthy();
      expect(filter(2, 2)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(1, 2)).toBeFalsy();
    });
  });

  describe('isEmpty', () => {
    const filter = numberFiltersByCondition.isEmpty;

    test('ok', () => {
      expect(filter(null, 0)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(1, 0)).toBeFalsy();
    });
  });

  describe('isNotEmpty', () => {
    const filter = numberFiltersByCondition.isNotEmpty;

    test('ok', () => {
      expect(filter(1, 0)).toBeTruthy();
    });

    test('not ok', () => {
      expect(filter(null, 0)).toBeFalsy();
    });
  });
});

describe('dateFiltersByCondition', () => {
  describe('is', () => {
    const filter = dateFiltersByCondition.is;

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
    const filter = dateFiltersByCondition.isWithin;

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
});
