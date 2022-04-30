import { isDate, formatISODate, parseString } from "./date_utils";
import { isError } from "./error_utils";

test("m/d/y", () => {
  let date = parseString("12/30/2020", "m/d/y");
  if (isError(date)) {
    fail(date.message);
  } else {
    expect(formatISODate(date)).toEqual("2020-12-30");
  }

  date = parseString("12/30/20", "m/d/y");
  if (isError(date)) {
    fail(date.message);
  } else {
    expect(formatISODate(date)).toEqual("2020-12-30");
  }

  date = parseString("1/1/1", "m/d/y");
  if (isError(date)) {
    fail(date.message);
  } else {
    expect(formatISODate(date)).toEqual("2001-01-01");
  }

  date = parseString("30/12/2020", "m/d/y");
  if (isDate(date)) {
    fail(`expected error. got ${formatISODate(date)}`);
  }
  date = parseString("2020/30/12", "m/d/y");
  if (isDate(date)) {
    fail(`expected error. got ${formatISODate(date)}`);
  }
  date = parseString("2020/12/30", "m/d/y");
  if (isDate(date)) {
    fail(`expected error. got ${formatISODate(date)}`);
  }
  date = parseString("12/2020/30", "m/d/y");
  if (isDate(date)) {
    fail(`expected error. got ${formatISODate(date)}`);
  }
});

test("y/m/d", () => {
  let date = parseString("2020/12/30", "y/m/d");

  if (isError(date)) {
    fail(date.message);
  } else {
    expect(formatISODate(date)).toEqual("2020-12-30");
  }

  date = parseString("20/12/30", "y/m/d");
  if (isError(date)) {
    fail(date.message);
  } else {
    expect(formatISODate(date)).toEqual("2020-12-30");
  }

  date = parseString("1/1/1", "y/m/d");
  if (isError(date)) {
    fail(date.message);
  } else {
    expect(formatISODate(date)).toEqual("2001-01-01");
  }

  date = parseString("12/30/2020", "y/m/d");
  if (isDate(date)) {
    fail(`expected error. got ${formatISODate(date)}`);
  }
  date = parseString("30/12/2020", "y/m/d");
  if (isDate(date)) {
    fail(`expected error. got ${formatISODate(date)}`);
  }
  date = parseString("2020/30/12", "y/m/d");
  if (isDate(date)) {
    fail(`expected error. got ${formatISODate(date)}`);
  }
  date = parseString("12/2020/30", "y/m/d");
  if (isDate(date)) {
    fail(`expected error. got ${formatISODate(date)}`);
  }
});

test("d/m/y", () => {
  let date = parseString("30/12/2020", "d/m/y");

  if (isError(date)) {
    fail(date.message);
  } else {
    expect(formatISODate(date)).toEqual("2020-12-30");
  }

  date = parseString("30/12/20", "d/m/y");
  if (isError(date)) {
    fail(date.message);
  } else {
    expect(formatISODate(date)).toEqual("2020-12-30");
  }

  date = parseString("1/1/1", "d/m/y");
  if (isError(date)) {
    fail(date.message);
  } else {
    expect(formatISODate(date)).toEqual("2001-01-01");
  }

  date = parseString("12/30/2020", "d/m/y");
  if (isDate(date)) {
    fail(`expected error. got ${formatISODate(date)}`);
  }
  date = parseString("2020/12/30", "d/m/y");
  if (isDate(date)) {
    fail(`expected error. got ${formatISODate(date)}`);
  }
  date = parseString("2020/30/12", "d/m/y");
  if (isDate(date)) {
    fail(`expected error. got ${formatISODate(date)}`);
  }
  date = parseString("12/2020/30", "d/m/y");
  if (isDate(date)) {
    fail(`expected error. got ${formatISODate(date)}`);
  }
});

test("acceptable delimiters", () => {
  let date = parseString("2020/12/30", "y/m/d");

  if (isError(date)) {
    fail(date.message);
  } else {
    expect(formatISODate(date)).toEqual("2020-12-30");
  }

  date = parseString("2020-12-30", "y/m/d");

  if (isError(date)) {
    fail(date.message);
  } else {
    expect(formatISODate(date)).toEqual("2020-12-30");
  }

  date = parseString("2020.12.30", "y/m/d");

  if (isError(date)) {
    fail(date.message);
  } else {
    expect(formatISODate(date)).toEqual("2020-12-30");
  }

  expect(isError(parseString("2020,12,30", "y/m/d"))).toBeTruthy();
});
