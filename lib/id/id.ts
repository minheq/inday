import short from 'short-uuid';
import { v4 } from 'uuid';
import * as yup from 'yup';

const translator = short();

export function generateID() {
  const uuid = v4();
  return translator.fromUUID(uuid);
}

/** Transform ID generated from `generateID` to UUIDV4 */
export function toUUID(id: string) {
  return translator.toUUID(id);
}

function isUUID(uuid: string): boolean {
  // TODO: add uuid() https://github.com/jquense/yup/issues/954
  return yup.string().isValidSync(uuid);
}

export const shortIDSchema = yup
  .string()
  .required()
  .test('shortid', 'id is not uuid', (value: string) => {
    const uuid = toUUID(value);

    return isUUID(uuid);
  });
