import React, { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { assertUnreached } from '../../../lib/lang_utils';

import { GroupRowCellState } from '../../components/grid_renderer.common';
import { Text } from '../../components/text';
import { useThemeStyles } from '../../components/theme';
import {
  assertCheckboxFieldValue,
  assertCurrencyFieldValue,
  assertDateFieldValue,
  assertEmailFieldValue,
  assertMultiCollaboratorFieldValue,
  assertMultiDocumentLinkFieldValue,
  assertMultiLineTextFieldValue,
  assertMultiOptionFieldValue,
  assertNumberFieldValue,
  assertPhoneNumberFieldValue,
  assertSingleCollaboratorFieldValue,
  assertSingleDocumentLinkFieldValue,
  assertSingleLineTextFieldValue,
  assertSingleOptionFieldValue,
  assertURLFieldValue,
  Field,
  FieldID,
  FieldType,
  FieldValue,
} from '../../data/fields';
import { useGetField } from '../../data/store';
import { CheckboxValueView } from '../fields/checkbox_value_view';
import { CurrencyValueView } from '../fields/currency_value_view';
import { DateValueView } from '../fields/date_value_view';
import { EmailValueView } from '../fields/email_value_view';
import { MultiCollaboratorValueView } from '../fields/multi_collaborator_value_view';
import { MultiDocumentLinkValueView } from '../fields/multi_document_link_value_view';
import { MultiLineTextValueView } from '../fields/multi_line_text_value_view';
import { MultiOptionValueView } from '../fields/multi_option_value_view';
import { NumberValueView } from '../fields/number_value_view';
import { PhoneNumberValueView } from '../fields/phone_number_value_view';
import { SingleCollaboratorValueView } from '../fields/single_collaborator_value_view';
import { SingleDocumentLinkValueView } from '../fields/single_document_link_value_view';
import { SingleLineTextValueView } from '../fields/single_line_text_value_view';
import { SingleOptionValueView } from '../fields/single_option_value_view';
import { URLValueView } from '../fields/url_value_view';

interface GroupRowCellProps {
  state: GroupRowCellState;
  primary: boolean;
  path: number[];
  column: number;
  last: boolean;
  // Corresponding column
  columnFieldID: FieldID;
  // Field of the group
  field: Field;
  value: FieldValue;
}

export const GROUP_ROW_HEIGHT = 56;

export function GroupRowCell(props: GroupRowCellProps): JSX.Element {
  const {
    state,
    primary,
    path,
    column,
    last,
    columnFieldID,
    field,
    value,
  } = props;

  console.log(columnFieldID, 'columnFieldID');

  if (primary) {
    return <PrimaryGroupRowCellView field={field} value={value} />;
  }

  return <GroupRowCellView field={field} />;
}

interface PrimaryGroupRowCellViewProps {
  field: Field;
  value: FieldValue;
}

function PrimaryGroupRowCellView(props: PrimaryGroupRowCellViewProps) {
  const { field, value } = props;
  const themeStyles = useThemeStyles();

  const renderValue = useCallback((): JSX.Element => {
    switch (field.type) {
      case FieldType.Checkbox:
        assertCheckboxFieldValue(value);
        return <CheckboxValueView field={field} value={value} />;
      case FieldType.Currency:
        assertCurrencyFieldValue(value);
        return <CurrencyValueView field={field} value={value} />;
      case FieldType.Date:
        assertDateFieldValue(value);
        return <DateValueView field={field} value={value} />;
      case FieldType.Email:
        assertEmailFieldValue(value);
        return <EmailValueView field={field} value={value} />;
      case FieldType.MultiCollaborator:
        assertMultiCollaboratorFieldValue(value);
        return <MultiCollaboratorValueView field={field} value={value} />;
      case FieldType.MultiDocumentLink:
        assertMultiDocumentLinkFieldValue(value);
        return <MultiDocumentLinkValueView field={field} value={value} />;
      case FieldType.MultiLineText:
        assertMultiLineTextFieldValue(value);
        return <MultiLineTextValueView field={field} value={value} />;
      case FieldType.MultiOption:
        assertMultiOptionFieldValue(value);
        return <MultiOptionValueView field={field} value={value} />;
      case FieldType.Number:
        assertNumberFieldValue(value);
        return <NumberValueView field={field} value={value} />;
      case FieldType.PhoneNumber:
        assertPhoneNumberFieldValue(value);
        return <PhoneNumberValueView field={field} value={value} />;
      case FieldType.SingleCollaborator:
        assertSingleCollaboratorFieldValue(value);
        return <SingleCollaboratorValueView field={field} value={value} />;
      case FieldType.SingleDocumentLink:
        assertSingleDocumentLinkFieldValue(value);
        return <SingleDocumentLinkValueView field={field} value={value} />;
      case FieldType.SingleLineText:
        assertSingleLineTextFieldValue(value);
        return <SingleLineTextValueView field={field} value={value} />;
      case FieldType.SingleOption:
        assertSingleOptionFieldValue(value);
        return <SingleOptionValueView field={field} value={value} />;
      case FieldType.URL:
        assertURLFieldValue(value);
        return <URLValueView field={field} value={value} />;
      default:
        assertUnreached(field);
    }
  }, [field, value]);

  return (
    <View style={[styles.primaryCell, themeStyles.border.default]}>
      <Text color="muted" size="xs">
        {field.name}
      </Text>
      {renderValue()}
      <View
        pointerEvents="none"
        style={[styles.bottomBorder, themeStyles.border.default]}
      />
    </View>
  );
}

interface GroupRowCellViewProps {
  field: Field;
}

const GroupRowCellView = memo(function GroupRowCellView(
  props: GroupRowCellViewProps,
) {
  const themeStyles = useThemeStyles();

  return (
    <View style={styles.cellRoot}>
      <View
        pointerEvents="none"
        style={[styles.bottomBorder, themeStyles.border.default]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  cellRoot: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryCell: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRightWidth: 2,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});
