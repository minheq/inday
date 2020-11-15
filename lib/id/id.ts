import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  15,
);

export function generateID(prefix?: string): string {
  return `${prefix ?? ''}${nanoid()}`;
}

export function validateID(_id: string): void {
  // TODO: https://github.com/jquense/yup/issues/986
}
