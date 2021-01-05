import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { assertUnreached } from '../../../lib/lang_utils';
import { ContextMenuItem } from '../../components/context_menu_view';

import { GroupRowCellState } from '../../components/grid_renderer.common';
import { Icon } from '../../components/icon';
import { PressableHighlight } from '../../components/pressable_highlight';
import { PressableHighlightContextMenu } from '../../components/pressable_highlight_context_menu';
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
} from '../../../models/fields';
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
import { useListViewViewContext } from './list_view_view';

interface GroupRowCellProps {
  state: GroupRowCellState;
  primary: boolean;
  path: number[];
  column: number;
  last: boolean;
  collapsed: boolean;
  // Corresponding column
  columnFieldID: FieldID;
  // Field of the group
  field: Field;
  value: FieldValue;
  onToggleCollapseGroup: (
    field: Field,
    value: FieldValue,
    collapsed: boolean,
  ) => void;
}

export function GroupRowCell(props: GroupRowCellProps): JSX.Element {
  const { primary, collapsed, field, value, onToggleCollapseGroup } = props;

  if (primary) {
    return (
      <PrimaryGroupRowCellView
        collapsed={collapsed}
        field={field}
        value={value}
        onToggleCollapseGroup={onToggleCollapseGroup}
      />
    );
  }

  return <GroupRowCellView field={field} />;
}

interface PrimaryGroupRowCellViewProps {
  field: Field;
  value: FieldValue;
  collapsed: boolean;
  onToggleCollapseGroup: (
    field: Field,
    value: FieldValue,
    collapsed: boolean,
  ) => void;
}

function PrimaryGroupRowCellView(props: PrimaryGroupRowCellViewProps) {
  const { field, value, collapsed, onToggleCollapseGroup } = props;
  const { mode } = useListViewViewContext();
  const themeStyles = useThemeStyles();

  const handlePressCollapseGroup = useCallback(() => {
    onToggleCollapseGroup(field, value, !collapsed);
  }, [onToggleCollapseGroup, field, value, collapsed]);

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
    <View
      style={[
        styles.primaryCell,
        themeStyles.border.default,
        themeStyles.background.content,
      ]}
    >
      <CollapseToggle
        collapsed={collapsed}
        onToggle={handlePressCollapseGroup}
      />
      <View style={styles.primaryCellText}>
        <Text color="muted" size="xs">
          {field.name}
        </Text>
        {renderValue()}
      </View>
      <View
        pointerEvents="none"
        style={[styles.bottomBorder, themeStyles.border.default]}
      />
      {mode === 'edit' && <DotsMenu />}
    </View>
  );
}

interface CollapseToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}

const CollapseToggle = memo(function CollapseToggle(
  props: CollapseToggleProps,
): JSX.Element {
  const { collapsed, onToggle } = props;
  return (
    <View style={styles.collapseToggleWrapper}>
      <PressableHighlight onPress={onToggle} style={styles.dotsMenuButton}>
        <Icon name={collapsed ? 'CaretRight' : 'CaretDown'} />
      </PressableHighlight>
    </View>
  );
});

const DotsMenu = memo(function DotsMenu(): JSX.Element {
  const options = useGroupRowContextMenuOptions();

  return (
    <PressableHighlightContextMenu
      options={options}
      style={styles.dotsMenuButton}
    >
      <Icon name="Dots" />
    </PressableHighlightContextMenu>
  );
});

function useGroupRowContextMenuOptions(): ContextMenuItem[] {
  return useMemo(
    (): ContextMenuItem[] => [
      { label: 'Collapse' },
      { label: 'Expand subgroups' },
      { label: 'Collapse subgroups' },
    ],
    [],
  );
}

interface GroupRowCellViewProps {
  field: Field;
}

const GroupRowCellView = memo(function GroupRowCellView(
  _props: GroupRowCellViewProps,
) {
  const options = useGroupRowContextMenuOptions();
  const themeStyles = useThemeStyles();

  return (
    <PressableHighlightContextMenu options={options} style={styles.cellRoot}>
      <View
        pointerEvents="none"
        style={[styles.bottomBorder, themeStyles.border.default]}
      />
    </PressableHighlightContextMenu>
  );
});

const styles = StyleSheet.create({
  cellRoot: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryCell: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRightWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryCellText: {
    flex: 1,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  collapseToggleWrapper: {
    paddingRight: 8,
  },
  dotsMenuButton: {
    borderRadius: 999,
  },
});
