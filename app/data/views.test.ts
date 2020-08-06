import { filterDocumentsByView, View } from './views';
import {
  fieldsByIDFixtures,
  col1View1,
  col1Doc1,
  col1Doc2,
  col1Field1,
  col1Doc3,
} from './fixtures';
import { Field } from './fields';

function getField(fieldID: string): Field {
  return fieldsByIDFixtures[fieldID];
}

describe('filtering', () => {
  const docs = [col1Doc1, col1Doc2, col1Doc3];

  test('happy path', () => {
    const view: View = {
      ...col1View1,
      filters: [[col1Field1.id, { rule: 'contains', value: 'col1' }]],
    };

    const result = filterDocumentsByView(view, docs, getField);

    expect(result).toHaveLength(docs.length);
  });

  test('specific', () => {
    const view: View = {
      ...col1View1,
      filters: [[col1Field1.id, { rule: 'contains', value: 'col1Doc1' }]],
    };

    const result = filterDocumentsByView(view, docs, getField);

    expect(result).toHaveLength(1);
  });
});
