import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import {
  GestureResponderEvent,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { ContextMenuView } from "../../components/context_menu_view";
import { ContextMenuItem, ContextMenu } from "../../components/context_menu";
import { Icon } from "../../components/icon";
import { Text } from "../../components/text";
import { FieldID } from "../../../models/fields";
import { useFieldQuery } from "../../store/queries";
import { getFieldIcon } from "../views/icon_helpers";
import { useListViewContext } from "./list_view";
import { useUpdateListViewFieldConfigMutation } from "../../store/mutations";
import { PressableHighlight } from "../../components/pressable_highlight";
import { Popover } from "../../components/popover";
import { theme } from "../../components/theme";
import { Spacer } from "../../components/spacer";
import { Pressable } from "../../components/pressable";

interface HeaderProps {
  children: React.ReactNode;
}

export function Header(props: HeaderProps): JSX.Element {
  const { children } = props;

  return <View style={styles.row}>{children}</View>;
}

interface HeaderCellProps {
  fieldID: FieldID;
  primary: boolean;
  width: number;
}

export const HeaderCell = memo(function HeaderCell(
  props: HeaderCellProps
): JSX.Element {
  const { fieldID, primary, width } = props;
  const { viewID } = useListViewContext();
  const field = useFieldQuery(fieldID);
  const widthRef = useRef(width);
  const anchorRef = useRef(0);
  const updateListViewFieldConfig = useUpdateListViewFieldConfigMutation();
  const menuItems = useHeaderCellContextMenuItems();
  const [visible, setVisible] = useState(false);
  const targetRef = useRef<View>(null);

  const handlePress = useCallback(() => {
    setVisible(true);
  }, []);

  const handleRequestClose = useCallback(() => {
    setVisible(false);
  }, []);

  const handlePressMove = useCallback(
    async (e: GestureResponderEvent) => {
      // Sometimes happens when pressing in and pressing out too fast
      if (anchorRef.current === 0) {
        return;
      }

      const nextWidth =
        widthRef.current + (e.nativeEvent.pageX - anchorRef.current);

      await updateListViewFieldConfig(viewID, fieldID, { width: nextWidth });
    },
    [updateListViewFieldConfig, viewID, fieldID, widthRef]
  );

  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      anchorRef.current = e.nativeEvent.pageX;
      widthRef.current = width;
    },
    [width]
  );

  const handlePressOut = useCallback(() => {
    anchorRef.current = 0;
  }, []);

  return (
    <View style={[styles.headerCell, primary && styles.primaryCell]}>
      <PressableHighlight
        ref={targetRef}
        onPress={handlePress}
        style={styles.headerButton}
      >
        <ContextMenuView style={styles.menuView} menuItems={menuItems}>
          <View style={styles.headerCellTitle}>
            <Icon name={getFieldIcon(field.type)} />
            <Spacer direction="row" size={4} />
            <Text color="muted" size="sm">
              {field.name}
            </Text>
          </View>
        </ContextMenuView>
      </PressableHighlight>
      <Pressable
        onPressIn={handlePressIn}
        onPressMove={handlePressMove}
        onPressOut={handlePressOut}
        style={({ hovered }) => {
          return [
            styles.resizeHandler,
            hovered ? styles.visibleResizeHandler : styles.hiddenResizeHandler,
          ];
        }}
      >
        <Icon color="primary" size="sm" name="ArrowHorizontal" />
      </Pressable>
      <Popover
        visible={visible}
        targetRef={targetRef}
        content={<ContextMenu menuItems={menuItems} />}
        onRequestClose={handleRequestClose}
      />
    </View>
  );
});

function useHeaderCellContextMenuItems() {
  return useMemo(
    (): ContextMenuItem[] => [
      { label: "Edit field type" },
      { label: "Rename" },
      { label: "Edit description" },
      { label: "Edit permissions" },
      { label: "Move left" },
      { label: "Move right" },
      { label: "Sort ascending" },
      { label: "Sort descending" },
      { label: "Add filter" },
      { label: "Group by this field" },
      { label: "Duplicate" },
      { label: "Hide" },
      { label: "Delete" },
    ],
    []
  );
}

export const LastHeaderCell = memo(function LastHeaderCell(): JSX.Element {
  return (
    <View style={styles.headerCell}>
      <Text>Add field</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    backgroundColor: theme.base.white,
  },
  headerCell: {
    flex: 1,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: theme.neutral[200],
    backgroundColor: theme.neutral[50],
  },
  menuView: {
    paddingHorizontal: 8,
  },
  headerButton: {
    flex: 1,
    justifyContent: "center",
  },
  primaryCell: {
    borderRightWidth: 2,
    borderColor: theme.neutral[200],
  },
  headerCellTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  hiddenResizeHandler: {
    opacity: 0,
  },
  visibleResizeHandler: {
    opacity: 1,
  },
  resizeHandler: {
    position: "absolute",
    right: 2,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: theme.base.white,
    borderColor: theme.neutral[200],
    ...Platform.select({
      web: {
        cursor: "grab",
      },
    }),
  },
});
