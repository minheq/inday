import short from 'short-uuid';
import { v4 } from 'uuid';

const translator = short();

export function generateID() {
  const uuid = v4();
  return translator.fromUUID(uuid);
}

/** Transform ID generated from `generateID` to UUIDV4 */
export function toUUID(id: string) {
  return translator.toUUID(id);
}
