import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { assertUnreached } from "../../../lib/lang_utils";
import { ContextMenuItem, ContextMenu } from "../../components/context_menu";
import { Icon } from "../../components/icon";
import { PressableHighlight } from "../../components/pressable_highlight";
import { Text } from "../../components/text";
import { useThemeStyles } from "../../components/theme";
import {
  assertCheckboxFieldValue,
  assertCurrencyFieldValue,
  assertDateFieldValue,
  assertEmailFieldValue,
  assertMultiCollaboratorFieldValue,
  assertMultiDocumentLinkFieldValue,
  assertMultiLineTextFieldValue,
  assertMultiSelectFieldValue,
  assertNumberFieldValue,
  assertPhoneNumberFieldValue,
  assertSingleCollaboratorFieldValue,
  assertSingleDocumentLinkFieldValue,
  assertSingleLineTextFieldValue,
  assertSingleSelectFieldValue,
  assertURLFieldValue,
  Field,
  FieldID,
  FieldType,
  FieldValue,
  formatNumberFieldValue,
} from "../../../models/fields";
import { useListViewViewContext } from "./list_view_view";
import { Popover } from "../../components/popover";
import { CollaboratorBadgeList } from "../collaborators/collaborator_badge_list";
import { DocumentLinkBadgeList } from "../document_link/document_link_badge_list";
import { OptionBadgeList } from "../select/option_badge_list";
import { CollaboratorBadge } from "../collaborators/collaborator_badge";
import { DocumentLinkBadge } from "../document_link/document_link_badge";
import { OptionBadge } from "../select/option_badge";
import { formatDate, parseISODate } from "../../../lib/date_utils";
import { getSystemLocale } from "../../lib/locale";
import { formatCurrency } from "../../../lib/currency";
import { CheckboxAltView } from "../../components/checkbox_alt";

interface GroupRowCellProps {
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
    collapsed: boolean
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
    collapsed: boolean
  ) => void;
}

function PrimaryGroupRowCellView(props: PrimaryGroupRowCellViewProps) {
  const { field, value, collapsed, onToggleCollapseGroup } = props;
  const { mode } = useListViewViewContext();
  const themeStyles = useThemeStyles();

  const handlePressCollapseGroup = useCallback(() => {
    onToggleCollapseGroup(field, value, !collapsed);
  }, [onToggleCollapseGroup, field, value, collapsed]);

  const renderValue = useCallback((): JSX.Element | null => {
    switch (field.type) {
      case FieldType.Checkbox:
        assertCheckboxFieldValue(value);
        return <CheckboxAltView value={value} />;
      case FieldType.Currency:
        assertCurrencyFieldValue(value);
        return value ? (
          <Text numberOfLines={1}>
            {formatCurrency(value, getSystemLocale(), field.currency)}
          </Text>
        ) : null;
      case FieldType.Date:
        assertDateFieldValue(value);
        return value ? (
          <Text numberOfLines={1}>
            {formatDate(parseISODate(value), getSystemLocale())}
          </Text>
        ) : null;
      case FieldType.Email:
        assertEmailFieldValue(value);
        return (
          <Text decoration="underline" numberOfLines={1}>
            {value}
          </Text>
        );
      case FieldType.MultiCollaborator:
        assertMultiCollaboratorFieldValue(value);
        return <CollaboratorBadgeList collaboratorIDs={value} />;
      case FieldType.MultiDocumentLink:
        assertMultiDocumentLinkFieldValue(value);
        return <DocumentLinkBadgeList documentIDs={value} />;
      case FieldType.MultiLineText:
        assertMultiLineTextFieldValue(value);
        return <Text>{value}</Text>;
      case FieldType.MultiSelect:
        assertMultiSelectFieldValue(value);
        return <OptionBadgeList field={field} optionIDs={value} />;
      case FieldType.Number:
        assertNumberFieldValue(value);
        return (
          <Text numberOfLines={1}>{formatNumberFieldValue(value, field)}</Text>
        );
      case FieldType.PhoneNumber:
        assertPhoneNumberFieldValue(value);
        return <Text numberOfLines={1}>{value}</Text>;
      case FieldType.SingleCollaborator:
        assertSingleCollaboratorFieldValue(value);
        return value ? <CollaboratorBadge collaboratorID={value} /> : null;
      case FieldType.SingleDocumentLink:
        assertSingleDocumentLinkFieldValue(value);
        return value ? <DocumentLinkBadge documentID={value} /> : null;
      case FieldType.SingleLineText:
        assertSingleLineTextFieldValue(value);
        return <Text numberOfLines={1}>{value}</Text>;
      case FieldType.SingleSelect: {
        assertSingleSelectFieldValue(value);
        const selected = field.options.find((o) => o.id === value);
        return selected ? <OptionBadge option={selected} /> : null;
      }
      case FieldType.URL:
        assertURLFieldValue(value);
        return (
          <Text decoration="underline" numberOfLines={1}>
            {value}
          </Text>
        );
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
        <View style={styles.valueContainer}>{renderValue()}</View>
      </View>
      <View
        pointerEvents="none"
        style={[styles.bottomBorder, themeStyles.border.default]}
      />
      {mode === "edit" && <DotsMenu />}
    </View>
  );
}

interface CollapseToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}

const CollapseToggle = memo(function CollapseToggle(
  props: CollapseToggleProps
): JSX.Element {
  const { collapsed, onToggle } = props;
  return (
    <View style={styles.collapseToggleWrapper}>
      <PressableHighlight onPress={onToggle} style={styles.dotsMenuButton}>
        <Icon name={collapsed ? "CaretRight" : "CaretDown"} />
      </PressableHighlight>
    </View>
  );
});

const DotsMenu = memo(function DotsMenu(): JSX.Element {
  const menuItems = useGroupRowContextMenuItems();
  const targetRef = useRef<View>(null);
  const [visible, setVisible] = useState(false);

  const handlePress = useCallback(() => {
    setVisible(true);
  }, []);

  const handleRequestClose = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <View>
      <PressableHighlight
        onPress={handlePress}
        ref={targetRef}
        style={styles.dotsMenuButton}
      >
        <Icon name="Dots" />
      </PressableHighlight>
      <Popover
        visible={visible}
        targetRef={targetRef}
        content={<ContextMenu menuItems={menuItems} />}
        onRequestClose={handleRequestClose}
      />
    </View>
  );
});

function useGroupRowContextMenuItems(): ContextMenuItem[] {
  return useMemo(
    (): ContextMenuItem[] => [
      { label: "Collapse" },
      { label: "Expand subgroups" },
      { label: "Collapse subgroups" },
    ],
    []
  );
}

interface GroupRowCellViewProps {
  field: Field;
}

const GroupRowCellView = memo(function GroupRowCellView(
  _props: GroupRowCellViewProps
) {
  const themeStyles = useThemeStyles();

  return (
    <PressableHighlight style={styles.cellRoot}>
      <View
        pointerEvents="none"
        style={[styles.bottomBorder, themeStyles.border.default]}
      />
    </PressableHighlight>
  );
});

const styles = StyleSheet.create({
  cellRoot: {
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  primaryCell: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRightWidth: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  valueContainer: {
    flexDirection: "row",
  },
  primaryCellText: {
    flex: 1,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    position: "absolute",
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
