import { filterDocumentsByView } from './views';
import {
  fieldsByIDFixtures,
  documentsByIDFixtures,
  viewsByIDFixtures,
  col1View1,
} from './fixtures';
import { Field } from './fields';

function getField(fieldID: string): Field {
  return fieldsByIDFixtures[fieldID];
}

describe('filtering', () => {
  test('happy path', () => {});
});
