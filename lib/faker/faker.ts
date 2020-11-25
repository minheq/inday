import { getRandomInteger, sample } from 'lib/js_utils';

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
  return `${sample(loremIpsum)}@${sample(loremIpsum)}.${sample(loremIpsum)}`;
}

export function fakeWord(): string {
  return sample(loremIpsum);
}

export function fakeNumber(): number {
  return getRandomInteger(0, 1000);
}

export function fakeURL(): string {
  return `https://${fakeWord()}.${fakeWord()}}`;
}

export function fakeDate(): Date {
  return new Date(
    getRandomInteger(2020, 2030),
    getRandomInteger(0, 11),
    getRandomInteger(1, 28),
    getRandomInteger(1, 23),
  );
}

export function fakePhoneNumber(): string {
  return `${getRandomInteger(1000000000, 10000000000)}`;
}

export function fakeBoolean(): boolean {
  return getRandomInteger(0, 1) === 1 ? true : false;
}

export function fakeWords(size = 5): string {
  let result = '';

  for (let i = 0; i < size; i++) {
    result += sample(loremIpsum);

    if (i !== size - 1) {
      result += ' ';
    }
  }

  return result;
}
