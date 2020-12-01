import { Number, Array } from '../js_utils';

const loremIpsum = [
  'Lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'Integer',
  'imperdiet',
  'eget',
  'tellus',
  'sed',
  'sollicitudin',
  'Aenean',
  'facilisis',
  'lacus',
  'et',
  'magna',
  'congue',
  'quis',
  'convallis',
  'tellus',
  'volutpat',
  'Sed',
  'suscipit',
  'odio',
  'a',
  'lectus',
  'eleifend',
  'quis',
  'placerat',
  'velit',
  'malesuada',
  'Aliquam',
  'suscipit',
  'magna',
  'ut',
  'ultrices',
  'pulvinar',
  'Integer',
  'non',
  'efficitur',
  'magna',
  'Aenean',
  'tempor',
  'augue',
  'neque',
  'Morbi',
  'fringilla',
  'libero',
  'elit',
  'ut',
  'efficitur',
  'velit',
  'ullamcorper',
  'quis',
];

export function fakeEmail(): string {
  return `${Array.sample(loremIpsum)}@${Array.sample(
    loremIpsum,
  )}.${Array.sample(loremIpsum)}`;
}

export function fakeWord(): string {
  return Array.sample(loremIpsum);
}

export function fakeNumber(): number {
  return Number.sample(0, 1000);
}

export function fakeURL(): string {
  return `https://${fakeWord()}.${fakeWord()}`;
}

export function fakeDate(): Date {
  return new Date(
    Number.sample(2020, 2030),
    Number.sample(0, 11),
    Number.sample(1, 28),
    Number.sample(1, 23),
  );
}

export function fakePhoneNumber(): string {
  return `${Number.sample(1000000000, 10000000000)}`;
}

export function fakeBoolean(): boolean {
  return Number.sample(0, 1) === 1 ? true : false;
}

export function fakeWords(size = 5): string {
  let result = '';

  for (let i = 0; i < size; i++) {
    result += Array.sample(loremIpsum);

    if (i !== size - 1) {
      result += ' ';
    }
  }

  return result;
}
