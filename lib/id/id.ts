import { v4 } from 'uuid';

export function generateID() {
  return v4();
}

export function validateID(_id: string) {
  // TODO: https://github.com/jquense/yup/issues/986
}
