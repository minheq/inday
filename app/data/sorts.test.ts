import {
  addFieldsToCollection,
  makeCollection,
  makeField,
  makeRecord,
  makeSort,
  makeCollaborator,
} from './factory';
import {
  FieldType,
  FieldValue,
  assertMultiOptionField,
  assertSingleOptionField,
} from './fields';
import { sortRecords, SortGetters } from './sorts';
import { Record, RecordID } from './records';
import { CollaboratorID } from './collaborators';

describe('no sort', () => {
  test('all records', () => {
    const values = ['BWord', 'Aword'];
    const { getters, records, getValue } = prepare(
      FieldType.SingleLineText,
      values,
    );

    const result = sortRecords([], records, getters);

    expect(getValue(result[0])).toBe(values[0]);
    expect(getValue(result[1])).toBe(values[1]);
  });
});

describe('text sort', () => {
  test('ascending', () => {
    const values = ['BWord', 'Aword'];
    const { getters, records, field, getValue } = prepare(
      FieldType.SingleLineText,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'ascending' });

    const result = sortRecords([sort], records, getters);

    expect(getValue(result[0])).toBe(values[1]);
    expect(getValue(result[1])).toBe(values[0]);
  });

  test('descending', () => {
    const values = ['AWord', 'Bword'];
    const { getters, records, field, getValue } = prepare(
      FieldType.SingleLineText,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'descending' });

    const result = sortRecords([sort], records, getters);

    expect(getValue(result[0])).toBe(values[1]);
    expect(getValue(result[1])).toBe(values[0]);
  });
});

describe('number sort', () => {
  test('ascending', () => {
    const values = [2, 1, null];
    const { getters, records, field, getValue } = prepare(
      FieldType.Number,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'ascending' });

    const result = sortRecords([sort], records, getters);

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });

  test('descending', () => {
    const values = [1, 2, null];
    const { getters, records, field, getValue } = prepare(
      FieldType.Number,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'descending' });

    const result = sortRecords([sort], records, getters);

    expect(getValue(result[0])).toBe(values[1]);
    expect(getValue(result[1])).toBe(values[0]);
    expect(getValue(result[2])).toBe(values[2]);
  });
});

describe('checkbox', () => {
  test('ascending', () => {
    const values = [true, false];
    const { getters, records, field, getValue } = prepare(
      FieldType.Checkbox,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'ascending' });

    const result = sortRecords([sort], records, getters);

    expect(getValue(result[0])).toBe(values[1]);
    expect(getValue(result[1])).toBe(values[0]);
  });

  test('descending', () => {
    const values = [false, true];
    const { getters, records, field, getValue } = prepare(
      FieldType.Checkbox,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'descending' });

    const result = sortRecords([sort], records, getters);

    expect(getValue(result[0])).toBe(values[1]);
    expect(getValue(result[1])).toBe(values[0]);
  });
});

describe('date', () => {
  test('ascending', () => {
    const values = [new Date(2020, 1, 2), new Date(2020, 1, 1), null];
    const { getters, records, field, getValue } = prepare(
      FieldType.Date,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'ascending' });

    const result = sortRecords([sort], records, getters);

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });

  test('descending', () => {
    const values = [null, new Date(2020, 1, 1), new Date(2020, 1, 2)];
    const { getters, records, field, getValue } = prepare(
      FieldType.Date,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'descending' });

    const result = sortRecords([sort], records, getters);

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });
});

describe('multi options', () => {
  const { getters, field } = prepare(FieldType.MultiOption, []);
  assertMultiOptionField(field);
  const opt1 = field.options[0];
  const opt2 = field.options[1];

  const record1 = makeRecord({ fields: { [field.id]: [opt1.value] } });
  const record2 = makeRecord({ fields: { [field.id]: [opt2.value] } });
  const record3 = makeRecord({ fields: { [field.id]: [] } });
  const records = [record1, record2, record3];

  test('ascending', () => {
    const sort = makeSort({}, { fieldID: field.id, order: 'ascending' });
    const result = sortRecords([sort], records, getters);

    expect(result[0].id).toBe(record3.id);
    expect(result[1].id).toBe(record2.id);
    expect(result[2].id).toBe(record1.id);
  });

  test('descending', () => {
    const sort = makeSort({}, { fieldID: field.id, order: 'descending' });
    const result = sortRecords([sort], records, getters);

    expect(result[0].id).toBe(record1.id);
    expect(result[1].id).toBe(record2.id);
    expect(result[2].id).toBe(record3.id);
  });
});

describe('single options', () => {
  const { getters, field } = prepare(FieldType.SingleOption, []);
  assertSingleOptionField(field);
  const opt1 = field.options[0];
  const opt2 = field.options[1];

  const record1 = makeRecord({ fields: { [field.id]: opt1.value } });
  const record2 = makeRecord({ fields: { [field.id]: opt2.value } });
  const record3 = makeRecord({ fields: { [field.id]: null } });
  const records = [record1, record2, record3];

  test('ascending', () => {
    const sort = makeSort({}, { fieldID: field.id, order: 'ascending' });
    const result = sortRecords([sort], records, getters);

    expect(result[0].id).toBe(record3.id);
    expect(result[1].id).toBe(record2.id);
    expect(result[2].id).toBe(record1.id);
  });

  test('descending', () => {
    const sort = makeSort({}, { fieldID: field.id, order: 'descending' });
    const result = sortRecords([sort], records, getters);

    expect(result[0].id).toBe(record1.id);
    expect(result[1].id).toBe(record2.id);
    expect(result[2].id).toBe(record3.id);
  });
});

describe('collaborator', () => {
  const collaborator1 = makeCollaborator({ name: 'BName' });
  const collaborator2 = makeCollaborator({ name: 'AName' });

  const getCollaborator = (collaboratorID: CollaboratorID) => {
    if (collaboratorID === collaborator1.id) {
      return collaborator1;
    }

    return collaborator2;
  };

  test('multi ascending', () => {
    const values = [[collaborator1.id], [collaborator2.id], []];
    const { getters, records, field, getValue } = prepare(
      FieldType.MultiCollaborator,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'ascending' });

    const result = sortRecords([sort], records, {
      ...getters,
      getCollaborator,
    });

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });

  test('multi descending', () => {
    const values = [[], [collaborator2.id], [collaborator1.id]];
    const { getters, records, field, getValue } = prepare(
      FieldType.MultiCollaborator,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'descending' });

    const result = sortRecords([sort], records, {
      ...getters,
      getCollaborator,
    });

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });

  test('single ascending', () => {
    const values = [collaborator1.id, collaborator2.id, null];
    const { getters, records, field, getValue } = prepare(
      FieldType.SingleCollaborator,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'ascending' });

    const result = sortRecords([sort], records, {
      ...getters,
      getCollaborator,
    });

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });

  test('single descending', () => {
    const values = [null, collaborator2.id, collaborator1.id];
    const { getters, records, field, getValue } = prepare(
      FieldType.SingleCollaborator,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'descending' });

    const result = sortRecords([sort], records, {
      ...getters,
      getCollaborator,
    });

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });
});

describe('records', () => {
  const otherCollection = makeCollection({
    name: 'other collection',
  });
  const otherField = makeField({
    type: FieldType.SingleLineText,
    collectionID: otherCollection.id,
  });
  otherCollection.primaryFieldID = otherField.id;
  const collectionWithFields = addFieldsToCollection(otherCollection, [
    otherField,
  ]);
  const record1 = makeRecord(
    { fields: { [otherField.id]: 'BName' } },
    collectionWithFields,
  );
  const record2 = makeRecord(
    { fields: { [otherField.id]: 'AName' } },
    collectionWithFields,
  );

  const getRecord = (recordID: RecordID) => {
    if (recordID === record1.id) {
      return record1;
    }

    return record2;
  };

  const getCollection = () => {
    return otherCollection;
  };

  test('multi ascending', () => {
    const values = [[record1.id], [record2.id], []];
    const { getters, records, field, getValue } = prepare(
      FieldType.MultiRecordLink,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'ascending' });

    const result = sortRecords([sort], records, {
      ...getters,
      getRecord,
      getCollection,
      getField: (fieldID) => {
        if (fieldID === field.id) {
          return field;
        }

        return otherField;
      },
    });

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });

  test('multi descending', () => {
    const values = [[], [record2.id], [record1.id]];
    const { getters, records, field, getValue } = prepare(
      FieldType.MultiRecordLink,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'descending' });

    const result = sortRecords([sort], records, {
      ...getters,
      getRecord,
      getCollection,
      getField: (fieldID) => {
        if (fieldID === field.id) {
          return field;
        }

        return otherField;
      },
    });

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });

  test('single ascending', () => {
    const values = [record1.id, record2.id, null];
    const { getters, records, field, getValue } = prepare(
      FieldType.SingleRecordLink,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'ascending' });

    const result = sortRecords([sort], records, {
      ...getters,
      getRecord,
      getCollection,
      getField: (fieldID) => {
        if (fieldID === field.id) {
          return field;
        }

        return otherField;
      },
    });

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });

  test('single descending', () => {
    const values = [null, record2.id, record1.id];
    const { getters, records, field, getValue } = prepare(
      FieldType.SingleRecordLink,
      values,
    );
    const sort = makeSort({}, { fieldID: field.id, order: 'descending' });

    const result = sortRecords([sort], records, {
      ...getters,
      getRecord,
      getCollection,
      getField: (fieldID) => {
        if (fieldID === field.id) {
          return field;
        }

        return otherField;
      },
    });

    expect(getValue(result[0])).toBe(values[2]);
    expect(getValue(result[1])).toBe(values[1]);
    expect(getValue(result[2])).toBe(values[0]);
  });
});

describe('multiple sorts', () => {
  const collection = makeCollection({});
  const numberField = makeField({
    type: FieldType.Number,
    collectionID: collection.id,
  });
  const textField = makeField({
    type: FieldType.SingleLineText,
    collectionID: collection.id,
  });
  const collectionWithFields = addFieldsToCollection(collection, [
    numberField,
    textField,
  ]);

  const record1 = makeRecord(
    { fields: { [numberField.id]: 2, [textField.id]: 'AWord' } },
    collectionWithFields,
  );
  const record2 = makeRecord(
    { fields: { [numberField.id]: 2, [textField.id]: 'BWord' } },
    collectionWithFields,
  );
  const record3 = makeRecord(
    { fields: { [numberField.id]: 1, [textField.id]: 'BWord' } },
    collectionWithFields,
  );
  const record4 = makeRecord(
    { fields: { [numberField.id]: 1, [textField.id]: 'AWord' } },
    collectionWithFields,
  );
  const fields = [numberField, textField];
  const records = [record1, record2, record3, record4];

  const collaborator = makeCollaborator({});

  const getters: SortGetters = {
    getField: (fieldID) => {
      const field = fields.find((d) => d.id === fieldID);

      if (field === undefined) {
        throw new Error('Record not found');
      }

      return field;
    },
    getRecord: (recordID) => {
      const record = records.find((d) => d.id === recordID);

      if (record === undefined) {
        throw new Error('Record not found');
      }

      return record;
    },
    getCollection: () => collection,
    getCollaborator: () => collaborator,
  };

  test('ascending number then descending text sort', () => {
    const numberSort = makeSort(
      {},
      { fieldID: numberField.id, order: 'ascending' },
    );
    const textSort = makeSort(
      {},
      { fieldID: textField.id, order: 'descending' },
    );

    const result = sortRecords([numberSort, textSort], records, getters);

    expect(result[0].id).toBe(record3.id);
    expect(result[1].id).toBe(record4.id);
    expect(result[2].id).toBe(record2.id);
    expect(result[3].id).toBe(record1.id);
  });
});

function prepare(fieldType: FieldType, values: FieldValue[]) {
  const collection = makeCollection({});
  const field = makeField({ type: fieldType });
  const collectionWithFields = addFieldsToCollection(collection, [field]);

  const records = values.map((value) => {
    return makeRecord({ fields: { [field.id]: value } }, collectionWithFields);
  });

  const collaborator = makeCollaborator({});

  const getters: SortGetters = {
    getField: () => field,
    getRecord: (recordID) => {
      const record = records.find((d) => d.id === recordID);

      if (record === undefined) {
        throw new Error('Record not found');
      }

      return record;
    },
    getCollection: () => collection,
    getCollaborator: () => collaborator,
  };

  const getValue = (record: Record) => {
    return record.fields[field.id];
  };

  return { records, getters, field, getValue };
}
