import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Text } from '../components';
import {
  useGetViewRecords,
  useGetSortedFieldsWithListViewConfig,
} from '../data/store';
import {
  FieldType,
  CheckboxField,
  CurrencyField,
  DateField,
  EmailField,
  MultiCollaboratorField,
  MultiRecordLinkField,
  MultiLineTextField,
  MultiOptionField,
  NumberField,
  PhoneNumberField,
  SingleCollaboratorField,
  SingleRecordLinkField,
  SingleLineTextField,
  SingleOptionField,
  URLField,
  Field,
  assertCheckboxField,
  assertCurrencyField,
  assertDateField,
  assertEmailField,
  assertMultiCollaboratorField,
  assertMultiRecordLinkField,
  assertMultiLineTextField,
  assertMultiOptionField,
  assertNumberField,
  assertPhoneNumberField,
  assertSingleCollaboratorField,
  assertSingleRecordLinkField,
  assertSingleLineTextField,
  assertSingleOptionField,
  assertURLField,
  CheckboxFieldValue,
  CurrencyFieldValue,
  DateFieldValue,
  EmailFieldValue,
  MultiCollaboratorFieldValue,
  MultiRecordLinkFieldValue,
  MultiLineTextFieldValue,
  MultiOptionFieldValue,
  NumberFieldValue,
  PhoneNumberFieldValue,
  SingleCollaboratorFieldValue,
  SingleRecordLinkFieldValue,
  SingleLineTextFieldValue,
  SingleOptionFieldValue,
  URLFieldValue,
  FieldValue,
  assertDateFieldValue,
  assertCheckboxFieldValue,
  assertCurrencyFieldValue,
  assertEmailFieldValue,
  assertMultiCollaboratorFieldValue,
  assertMultiRecordLinkFieldValue,
  assertMultiLineTextFieldValue,
  assertMultiOptionFieldValue,
  assertNumberFieldValue,
  assertPhoneNumberFieldValue,
  assertSingleCollaboratorFieldValue,
  assertSingleRecordLinkFieldValue,
  assertSingleLineTextFieldValue,
  assertSingleOptionFieldValue,
  assertURLFieldValue,
} from '../data/fields';
import { AutoSizer } from '../lib/autosizer/autosizer';
import { ListView } from '../data/views';
import { Grid, RenderCellProps } from './grid';
import { format } from 'date-fns';

interface ListViewDisplayProps {
  view: ListView;
}

const RECORD_ROW_HEIGHT = 40;

export function ListViewDisplay(props: ListViewDisplayProps) {
  const { view } = props;
  const fields = useGetSortedFieldsWithListViewConfig(view.id);
  const records = useGetViewRecords(view.id);

  const { fixedFieldCount } = view;

  const renderCell = useCallback(
    ({ row, column }: RenderCellProps) => {
      const field = fields[column - 1];
      const record = records[row - 1];
      const value = record.fields[field.id];

      const renderer = rendererByFieldType[field.type];

      return <View style={styles.cell}>{renderer({ field, value })}</View>;
    },
    [fields, records],
  );

  const columns = fields.map((field) => field.config.width);
  const rowCount = records.length;

  return (
    <Container flex={1}>
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            scrollViewWidth={width}
            scrollViewHeight={height}
            contentOffset={{ x: 0, y: 0 }}
            rowCount={rowCount}
            renderCell={renderCell}
            rowHeight={RECORD_ROW_HEIGHT}
            columns={columns}
            fixedColumnCount={fixedFieldCount}
          />
        )}
      </AutoSizer>
    </Container>
  );
}

const rendererByFieldType: {
  [fieldType in FieldType]: (props: {
    field: Field;
    value: FieldValue;
  }) => React.ReactNode;
} = {
  [FieldType.Checkbox]: ({ field, value }) => {
    assertCheckboxFieldValue(value);
    assertCheckboxField(field);

    return <CheckboxCell field={field} value={value} />;
  },
  [FieldType.Currency]: ({ field, value }) => {
    assertCurrencyFieldValue(value);
    assertCurrencyField(field);

    return <CurrencyCell field={field} value={value} />;
  },
  [FieldType.Date]: ({ field, value }) => {
    assertDateFieldValue(value);
    assertDateField(field);

    return <DateCell field={field} value={value} />;
  },
  [FieldType.Email]: ({ field, value }) => {
    assertEmailFieldValue(value);
    assertEmailField(field);

    return <EmailCell field={field} value={value} />;
  },
  [FieldType.MultiCollaborator]: ({ field, value }) => {
    assertMultiCollaboratorFieldValue(value);
    assertMultiCollaboratorField(field);

    return <MultiCollaboratorCell field={field} value={value} />;
  },
  [FieldType.MultiRecordLink]: ({ field, value }) => {
    assertMultiRecordLinkFieldValue(value);
    assertMultiRecordLinkField(field);

    return <MultiRecordLinkCell field={field} value={value} />;
  },
  [FieldType.MultiLineText]: ({ field, value }) => {
    assertMultiLineTextFieldValue(value);
    assertMultiLineTextField(field);

    return <MultiLineTextCell field={field} value={value} />;
  },
  [FieldType.MultiOption]: ({ field, value }) => {
    assertMultiOptionFieldValue(value);
    assertMultiOptionField(field);

    return <MultiOptionCell field={field} value={value} />;
  },
  [FieldType.Number]: ({ field, value }) => {
    assertNumberFieldValue(value);
    assertNumberField(field);

    return <NumberCell field={field} value={value} />;
  },
  [FieldType.PhoneNumber]: ({ field, value }) => {
    assertPhoneNumberFieldValue(value);
    assertPhoneNumberField(field);

    return <PhoneNumberCell field={field} value={value} />;
  },
  [FieldType.SingleCollaborator]: ({ field, value }) => {
    assertSingleCollaboratorFieldValue(value);
    assertSingleCollaboratorField(field);

    return <SingleCollaboratorCell field={field} value={value} />;
  },
  [FieldType.SingleRecordLink]: ({ field, value }) => {
    assertSingleRecordLinkFieldValue(value);
    assertSingleRecordLinkField(field);

    return <SingleRecordLinkCell field={field} value={value} />;
  },
  [FieldType.SingleLineText]: ({ field, value }) => {
    assertSingleLineTextFieldValue(value);
    assertSingleLineTextField(field);

    return <SingleLineTextCell field={field} value={value} />;
  },
  [FieldType.SingleOption]: ({ field, value }) => {
    assertSingleOptionFieldValue(value);
    assertSingleOptionField(field);

    return <SingleOptionCell field={field} value={value} />;
  },
  [FieldType.URL]: ({ field, value }) => {
    assertURLFieldValue(value);
    assertURLField(field);

    return <URLCell field={field} value={value} />;
  },
};

interface CheckboxCellProps {
  value: CheckboxFieldValue;
  field: CheckboxField;
}

function CheckboxCell(props: CheckboxCellProps) {
  const { value } = props;

  return <Text>{value ? 'checked' : 'unchecked'}</Text>;
}

interface CurrencyCellProps {
  value: CurrencyFieldValue;
  field: CurrencyField;
}

function CurrencyCell(props: CurrencyCellProps) {
  const { value } = props;

  return <Text>{value}</Text>;
}

interface DateCellProps {
  value: DateFieldValue;
  field: DateField;
}

function DateCell(props: DateCellProps) {
  const { value } = props;

  if (value === null) {
    return <Text>No date</Text>;
  }

  return <Text>{format(value, 'dd-MM-yyyy')}</Text>;
}
interface EmailCellProps {
  value: EmailFieldValue;
  field: EmailField;
}

function EmailCell(props: EmailCellProps) {
  const { value } = props;

  return <Text>{value}</Text>;
}
interface MultiCollaboratorCellProps {
  value: MultiCollaboratorFieldValue;
  field: MultiCollaboratorField;
}

function MultiCollaboratorCell(props: MultiCollaboratorCellProps) {
  const { value } = props;

  return <Text>{value[0]}</Text>;
}
interface MultiRecordLinkCellProps {
  value: MultiRecordLinkFieldValue;
  field: MultiRecordLinkField;
}

function MultiRecordLinkCell(props: MultiRecordLinkCellProps) {
  const { value } = props;

  return <Text>{value[0]}</Text>;
}
interface MultiLineTextCellProps {
  value: MultiLineTextFieldValue;
  field: MultiLineTextField;
}

function MultiLineTextCell(props: MultiLineTextCellProps) {
  const { value } = props;

  return <Text>{value}</Text>;
}
interface MultiOptionCellProps {
  value: MultiOptionFieldValue;
  field: MultiOptionField;
}

function MultiOptionCell(props: MultiOptionCellProps) {
  const { value } = props;

  return <Text>{value[0]}</Text>;
}
interface NumberCellProps {
  value: NumberFieldValue;
  field: NumberField;
}

function NumberCell(props: NumberCellProps) {
  const { value } = props;

  return <Text>{value}</Text>;
}
interface PhoneNumberCellProps {
  value: PhoneNumberFieldValue;
  field: PhoneNumberField;
}

function PhoneNumberCell(props: PhoneNumberCellProps) {
  const { value } = props;

  return <Text>{value}</Text>;
}
interface SingleCollaboratorCellProps {
  value: SingleCollaboratorFieldValue;
  field: SingleCollaboratorField;
}

function SingleCollaboratorCell(props: SingleCollaboratorCellProps) {
  const { value } = props;

  return <Text>{value}</Text>;
}
interface SingleRecordLinkCellProps {
  value: SingleRecordLinkFieldValue;
  field: SingleRecordLinkField;
}

function SingleRecordLinkCell(props: SingleRecordLinkCellProps) {
  const { value } = props;

  return <Text>{value}</Text>;
}
interface SingleLineTextCellProps {
  value: SingleLineTextFieldValue;
  field: SingleLineTextField;
}

function SingleLineTextCell(props: SingleLineTextCellProps) {
  const { value } = props;

  return <Text>{value}</Text>;
}

interface SingleOptionCellProps {
  value: SingleOptionFieldValue;
  field: SingleOptionField;
}

function SingleOptionCell(props: SingleOptionCellProps) {
  const { value } = props;

  return <Text>{value}</Text>;
}

interface URLCellProps {
  value: URLFieldValue;
  field: URLField;
}

function URLCell(props: URLCellProps) {
  const { value } = props;

  return <Text>{value}</Text>;
}

const styles = StyleSheet.create({
  cell: {
    width: '100%',
  },
});
