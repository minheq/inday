import React from 'react';
import { StyleSheet, View } from 'react-native';
import { assertUnreached } from '../../lib/lang_utils';

import { Text } from '../components/text';
import {
  assertBooleanFieldKindValue,
  assertDateFieldKindValue,
  assertMultiCollaboratorFieldValue,
  assertMultiOptionFieldValue,
  assertMultiRecordLinkFieldValue,
  assertNumberFieldKindValue,
  assertSingleCollaboratorFieldValue,
  assertSingleOptionFieldValue,
  assertSingleRecordLinkFieldValue,
  assertTextFieldKindValue,
  Field,
  FieldType,
  FieldValue,
} from '../data/fields';
import { Record } from '../data/records';
import { FieldTextKindInput } from './field_text_kind_input';
import { FieldNumberKindInput } from './field_number_kind_input';
import { FieldBooleanKindInput } from './field_boolean_kind_input';
import { FieldMultiCollaboratorInput } from './field_multi_collaborator_input';
import { FieldMultiOptionInput } from './field_multi_option_input';
import { FieldMultiRecordLinkInput } from './field_multi_record_link_input';
import { FieldSingleCollaboratorInput } from './field_single_collaborator_input';
import { FieldSingleOptionInput } from './field_single_option_input';
import { FieldSingleRecordLinkInput } from './field_single_record_link_input';
import { FieldDateInput } from './field_date_input';
import { PopoverButton } from '../components/popover_button';
import { PopoverCallback } from '../components/popover';
import { CollaboratorBadge } from './collaborator_badge';
import { OptionBadge } from './option_badge';
import { RecordLinkBadge } from './record_link_badge';
import { formatDate, parseISODate } from '../../lib/date_utils';
import { getSystemLocale } from '../lib/locale';
import { tokens } from '../components/tokens';
import { useTheme } from '../components/theme';

interface RecordFieldValueInputProps {
  record: Record;
  field: Field;
  value: FieldValue;
}

export function RecordFieldValueInput(
  props: RecordFieldValueInputProps,
): JSX.Element {
  const { record, field, value } = props;

  switch (field.type) {
    case FieldType.SingleLineText:
    case FieldType.URL:
    case FieldType.Email:
    case FieldType.MultiLineText:
    case FieldType.PhoneNumber:
      assertTextFieldKindValue(value);
      return (
        <FieldWrapper field={field}>
          <FieldTextKindInput
            recordID={record.id}
            fieldID={field.id}
            value={value}
          />
        </FieldWrapper>
      );
    case FieldType.Number:
    case FieldType.Currency:
      assertNumberFieldKindValue(value);
      return (
        <FieldWrapper field={field}>
          <FieldNumberKindInput
            recordID={record.id}
            fieldID={field.id}
            value={value}
          />
        </FieldWrapper>
      );
    case FieldType.MultiCollaborator:
      assertMultiCollaboratorFieldValue(value);
      return (
        <FieldWrapper field={field}>
          <PopoverWrapper
            contentHeight={400}
            content={({ onRequestClose }) => (
              <FieldMultiCollaboratorInput
                record={record}
                field={field}
                value={value}
                onDone={onRequestClose}
              />
            )}
          >
            {value.map((collaboratorID) => (
              <CollaboratorBadge
                collaboratorID={collaboratorID}
                key={collaboratorID}
              />
            ))}
          </PopoverWrapper>
        </FieldWrapper>
      );
    case FieldType.MultiOption:
      assertMultiOptionFieldValue(value);
      return (
        <FieldWrapper field={field}>
          <PopoverWrapper
            contentHeight={400}
            content={({ onRequestClose }) => (
              <FieldMultiOptionInput
                record={record}
                field={field}
                value={value}
                onDone={onRequestClose}
              />
            )}
          >
            {value.map((_value) => {
              const selected = field.options.find((o) => o.id === _value);

              if (selected === undefined) {
                throw new Error(
                  `Expected ${_value} to be within field options ${JSON.stringify(
                    field,
                  )}`,
                );
              }

              return <OptionBadge key={selected.id} option={selected} />;
            })}
          </PopoverWrapper>
        </FieldWrapper>
      );
    case FieldType.MultiRecordLink:
      assertMultiRecordLinkFieldValue(value);
      return (
        <FieldWrapper field={field}>
          <PopoverWrapper
            contentHeight={400}
            content={({ onRequestClose }) => (
              <FieldMultiRecordLinkInput
                record={record}
                field={field}
                value={value}
                onDone={onRequestClose}
              />
            )}
          >
            {value.map((recordID) => (
              <RecordLinkBadge key={recordID} recordID={recordID} />
            ))}
          </PopoverWrapper>
        </FieldWrapper>
      );
    case FieldType.SingleCollaborator:
      assertSingleCollaboratorFieldValue(value);
      return (
        <FieldWrapper field={field}>
          <PopoverWrapper
            contentHeight={400}
            content={({ onRequestClose }) => (
              <FieldSingleCollaboratorInput
                record={record}
                field={field}
                value={value}
                onDone={onRequestClose}
              />
            )}
          >
            {value ? (
              <CollaboratorBadge collaboratorID={value} key={value} />
            ) : (
              <View />
            )}
          </PopoverWrapper>
        </FieldWrapper>
      );
    case FieldType.SingleOption: {
      assertSingleOptionFieldValue(value);
      const selected = field.options.find((o) => o.id === value);

      return (
        <FieldWrapper field={field}>
          <PopoverWrapper
            contentHeight={400}
            content={({ onRequestClose }) => (
              <FieldSingleOptionInput
                record={record}
                field={field}
                value={value}
                onDone={onRequestClose}
              />
            )}
          >
            {selected ? <OptionBadge option={selected} /> : <View />}
          </PopoverWrapper>
        </FieldWrapper>
      );
    }
    case FieldType.SingleRecordLink:
      assertSingleRecordLinkFieldValue(value);
      return (
        <FieldWrapper field={field}>
          <PopoverWrapper
            contentHeight={400}
            content={({ onRequestClose }) => (
              <FieldSingleRecordLinkInput
                record={record}
                field={field}
                value={value}
                onDone={onRequestClose}
              />
            )}
          >
            {value ? <RecordLinkBadge recordID={value} /> : <View />}
          </PopoverWrapper>
        </FieldWrapper>
      );
    case FieldType.Checkbox:
      assertBooleanFieldKindValue(value);
      return (
        <FieldWrapper field={field}>
          <FieldBooleanKindInput
            recordID={record.id}
            fieldID={field.id}
            value={value}
          />
        </FieldWrapper>
      );
    case FieldType.Date:
      assertDateFieldKindValue(value);
      return (
        <FieldWrapper field={field}>
          <PopoverWrapper
            contentHeight={400}
            content={({ onRequestClose }) => (
              <FieldDateInput
                recordID={record.id}
                fieldID={field.id}
                value={value}
                onDone={onRequestClose}
              />
            )}
          >
            {value ? (
              <Text>{formatDate(parseISODate(value), getSystemLocale())}</Text>
            ) : (
              <View />
            )}
          </PopoverWrapper>
        </FieldWrapper>
      );
    default:
      assertUnreached(field);
  }
}

interface PopoverWrapperProps {
  children: React.ReactNode;
  content: (callbacks: PopoverCallback) => React.ReactNode;
  contentHeight: number;
}

function PopoverWrapper(props: PopoverWrapperProps) {
  const { children, content, contentHeight } = props;
  const theme = useTheme();

  return (
    <PopoverButton
      contentHeight={contentHeight}
      content={({ onRequestClose }) => (
        <View
          style={[
            styles.popoverContainer,
            theme === 'dark'
              ? styles.popoverContainerDark
              : styles.popoverContainerLight,
          ]}
        >
          {content({ onRequestClose })}
        </View>
      )}
    >
      {children}
    </PopoverButton>
  );
}

interface FieldWrapperProps {
  field: Field;
  children: React.ReactNode;
}

function FieldWrapper(props: FieldWrapperProps) {
  const { field, children } = props;

  return (
    <View style={styles.fieldWrapper}>
      <Text size="xs">{field.name.toUpperCase()}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldWrapper: {},
  popoverContainer: {
    padding: 8,
    borderRadius: tokens.border.radius,
  },
  popoverContainerLight: {
    backgroundColor: tokens.colors.base.white,
  },
  popoverContainerDark: {
    backgroundColor: tokens.colors.gray[800],
  },
});
