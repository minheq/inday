import { v4 } from 'uuid';
import * as yup from 'yup';

export function generateID() {
  return v4();
}

function isUUID(uuid: string): boolean {
  // TODO: add uuid() https://github.com/jquense/yup/issues/954
  return yup.string().isValidSync(uuid);
}

export const idSchema = yup
  .string()
  .required()
  .test('id', 'id is not uuid', (value: string) => {
    return isUUID(value);
  });
