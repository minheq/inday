import { filterDocumentsByView, FilterGroup } from './views';
import {
  makeCollection,
  makeField,
  addFieldsToCollection,
  makeDocument,
  makeFilter,
} from './factory';
import { FieldType } from './constants';
import { TextFilterConfig } from './filters';

describe('no filter', () => {
  const collection = makeCollection({});
  const textField = makeField({ type: FieldType.SingleLineText });
  const collectionWithFields = addFieldsToCollection(collection, [textField]);
  const doc = makeDocument({}, collectionWithFields);
  const getField = () => textField;

  test('all docs', () => {
    const result = filterDocumentsByView([], [doc], getField);

    expect(result).toHaveLength(1);
  });
});

describe('filtering text', () => {
  const collection = makeCollection({});
  const textField = makeField({ type: FieldType.SingleLineText });
  const collectionWithFields = addFieldsToCollection(collection, [textField]);
  const getField = () => textField;

  test('text contains true', () => {
    const doc = makeDocument({}, collectionWithFields);
    const textFilterConfig: TextFilterConfig = {
      fieldID: textField.id,
      rule: 'contains',
      value: doc.fields[textField.id] as string,
    };
    const textFilter = makeFilter({}, textFilterConfig);
    const filterGroups: FilterGroup[] = [[textFilter]];
    const result = filterDocumentsByView(filterGroups, [doc], getField);

    expect(result).toHaveLength(1);
  });

  test('text contains false', () => {
    const doc = makeDocument({}, collectionWithFields);
    const textFilterConfig: TextFilterConfig = {
      fieldID: textField.id,
      rule: 'contains',
      value: 'nothing999',
    };
    const textFilter = makeFilter({}, textFilterConfig);
    const filterGroups: FilterGroup[] = [[textFilter]];
    const result = filterDocumentsByView(filterGroups, [doc], getField);

    expect(result).toHaveLength(0);
  });
});
