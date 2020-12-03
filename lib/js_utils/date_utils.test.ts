import { test } from '../testing';
import { DateUtils } from './date_utils';
import { ErrorUtils } from './error_utils';

test('m/d/y', (t) => {
  let date = DateUtils.parseString('12/30/2020', 'm/d/y');
  if (ErrorUtils.isError(date)) {
    t.fail(date.message);
  } else {
    t.deepEqual(
      DateUtils.formatISO(date, { representation: 'date' }),
      '2020-12-30',
    );
  }

  date = DateUtils.parseString('12/30/20', 'm/d/y');
  if (ErrorUtils.isError(date)) {
    t.fail(date.message);
  } else {
    t.deepEqual(
      DateUtils.formatISO(date, { representation: 'date' }),
      '2020-12-30',
    );
  }

  date = DateUtils.parseString('1/1/1', 'm/d/y');
  if (ErrorUtils.isError(date)) {
    t.fail(date.message);
  } else {
    t.deepEqual(
      DateUtils.formatISO(date, { representation: 'date' }),
      '2001-01-01',
    );
  }

  date = DateUtils.parseString('30/12/2020', 'm/d/y');
  if (DateUtils.isDate(date)) {
    t.fail(
      `expected error. got ${DateUtils.formatISO(date, {
        representation: 'date',
      })}`,
    );
  }
  date = DateUtils.parseString('2020/30/12', 'm/d/y');
  if (DateUtils.isDate(date)) {
    t.fail(
      `expected error. got ${DateUtils.formatISO(date, {
        representation: 'date',
      })}`,
    );
  }
  date = DateUtils.parseString('2020/12/30', 'm/d/y');
  if (DateUtils.isDate(date)) {
    t.fail(
      `expected error. got ${DateUtils.formatISO(date, {
        representation: 'date',
      })}`,
    );
  }
  date = DateUtils.parseString('12/2020/30', 'm/d/y');
  if (DateUtils.isDate(date)) {
    t.fail(
      `expected error. got ${DateUtils.formatISO(date, {
        representation: 'date',
      })}`,
    );
  }
});

test('y/m/d', (t) => {
  let date = DateUtils.parseString('2020/12/30', 'y/m/d');

  if (ErrorUtils.isError(date)) {
    t.fail(date.message);
  } else {
    t.deepEqual(
      DateUtils.formatISO(date, { representation: 'date' }),
      '2020-12-30',
    );
  }

  date = DateUtils.parseString('20/12/30', 'y/m/d');
  if (ErrorUtils.isError(date)) {
    t.fail(date.message);
  } else {
    t.deepEqual(
      DateUtils.formatISO(date, { representation: 'date' }),
      '2020-12-30',
    );
  }

  date = DateUtils.parseString('1/1/1', 'y/m/d');
  if (ErrorUtils.isError(date)) {
    t.fail(date.message);
  } else {
    t.deepEqual(
      DateUtils.formatISO(date, { representation: 'date' }),
      '2001-01-01',
    );
  }

  date = DateUtils.parseString('12/30/2020', 'y/m/d');
  if (DateUtils.isDate(date)) {
    t.fail(
      `expected error. got ${DateUtils.formatISO(date, {
        representation: 'date',
      })}`,
    );
  }
  date = DateUtils.parseString('30/12/2020', 'y/m/d');
  if (DateUtils.isDate(date)) {
    t.fail(
      `expected error. got ${DateUtils.formatISO(date, {
        representation: 'date',
      })}`,
    );
  }
  date = DateUtils.parseString('2020/30/12', 'y/m/d');
  if (DateUtils.isDate(date)) {
    t.fail(
      `expected error. got ${DateUtils.formatISO(date, {
        representation: 'date',
      })}`,
    );
  }
  date = DateUtils.parseString('12/2020/30', 'y/m/d');
  if (DateUtils.isDate(date)) {
    t.fail(
      `expected error. got ${DateUtils.formatISO(date, {
        representation: 'date',
      })}`,
    );
  }
});

test('d/m/y', (t) => {
  let date = DateUtils.parseString('30/12/2020', 'd/m/y');

  if (ErrorUtils.isError(date)) {
    t.fail(date.message);
  } else {
    t.deepEqual(
      DateUtils.formatISO(date, { representation: 'date' }),
      '2020-12-30',
    );
  }

  date = DateUtils.parseString('30/12/20', 'd/m/y');
  if (ErrorUtils.isError(date)) {
    t.fail(date.message);
  } else {
    t.deepEqual(
      DateUtils.formatISO(date, { representation: 'date' }),
      '2020-12-30',
    );
  }

  date = DateUtils.parseString('1/1/1', 'd/m/y');
  if (ErrorUtils.isError(date)) {
    t.fail(date.message);
  } else {
    t.deepEqual(
      DateUtils.formatISO(date, { representation: 'date' }),
      '2001-01-01',
    );
  }

  date = DateUtils.parseString('12/30/2020', 'd/m/y');
  if (DateUtils.isDate(date)) {
    t.fail(
      `expected error. got ${DateUtils.formatISO(date, {
        representation: 'date',
      })}`,
    );
  }
  date = DateUtils.parseString('2020/12/30', 'd/m/y');
  if (DateUtils.isDate(date)) {
    t.fail(
      `expected error. got ${DateUtils.formatISO(date, {
        representation: 'date',
      })}`,
    );
  }
  date = DateUtils.parseString('2020/30/12', 'd/m/y');
  if (DateUtils.isDate(date)) {
    t.fail(
      `expected error. got ${DateUtils.formatISO(date, {
        representation: 'date',
      })}`,
    );
  }
  date = DateUtils.parseString('12/2020/30', 'd/m/y');
  if (DateUtils.isDate(date)) {
    t.fail(
      `expected error. got ${DateUtils.formatISO(date, {
        representation: 'date',
      })}`,
    );
  }
});

test('acceptable delimiters', (t) => {
  let date = DateUtils.parseString('2020/12/30', 'y/m/d');

  if (ErrorUtils.isError(date)) {
    t.fail(date.message);
  } else {
    t.deepEqual(
      DateUtils.formatISO(date, { representation: 'date' }),
      '2020-12-30',
    );
  }

  date = DateUtils.parseString('2020-12-30', 'y/m/d');

  if (ErrorUtils.isError(date)) {
    t.fail(date.message);
  } else {
    t.deepEqual(
      DateUtils.formatISO(date, { representation: 'date' }),
      '2020-12-30',
    );
  }

  date = DateUtils.parseString('2020.12.30', 'y/m/d');

  if (ErrorUtils.isError(date)) {
    t.fail(date.message);
  } else {
    t.deepEqual(
      DateUtils.formatISO(date, { representation: 'date' }),
      '2020-12-30',
    );
  }

  t.deepEqual(
    ErrorUtils.isError(DateUtils.parseString('2020,12,30', 'y/m/d')),
    true,
  );
});
