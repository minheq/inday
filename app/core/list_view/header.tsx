import React, {
  Fragment,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  GestureResponderEvent,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { atom, useRecoilState } from 'recoil';

import { ContextMenuView } from '../../components/context_menu_view';
import { ContextMenuItem, ContextMenu } from '../../components/context_menu';
import { Hoverable } from '../../components/hoverable';
import { Icon } from '../../components/icon';
import { Row } from '../../components/row';
import { Text } from '../../components/text';
import { useThemeStyles } from '../../components/theme';
import { FieldID } from '../../../models/fields';
import { useFieldQuery } from '../../store/queries';
import { getFieldIcon } from '../views/icon_helpers';
import { useListViewViewContext } from './list_view_view';
import { useUpdateListViewFieldConfigMutation } from '../../store/mutations';
import { PressableHighlight } from '../../components/pressable_highlight';
import { Popover } from '../../components/popover';

interface HeaderProps {
  children: React.ReactNode;
}

export function Header(props: HeaderProps): JSX.Element {
  const { children } = props;
  const themeStyles = useThemeStyles();

  return (
    <View style={[styles.row, themeStyles.background.content]}>{children}</View>
  );
}

const resizeFieldIDState = atom<FieldID | null>({
  key: 'ResizeFieldID',
  default: null,
});

interface HeaderCellProps {
  fieldID: FieldID;
  primary: boolean;
  width: number;
}

export const HeaderCell = memo(function HeaderCell(
  props: HeaderCellProps,
): JSX.Element {
  const { fieldID, primary, width } = props;
  const { viewID } = useListViewViewContext();
  const [resizeFieldID, setResizeFieldID] = useRecoilState(resizeFieldIDState);
  const field = useFieldQuery(fieldID);
  const widthRef = useRef(width);
  const anchorRef = useRef(0);
  const themeStyles = useThemeStyles();
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
    [updateListViewFieldConfig, viewID, fieldID, widthRef],
  );

  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      anchorRef.current = e.nativeEvent.pageX;
      widthRef.current = width;
      setResizeFieldID(fieldID);
    },
    [width, setResizeFieldID, fieldID],
  );

  const handlePressOut = useCallback(() => {
    anchorRef.current = 0;
    setResizeFieldID(null);
  }, [setResizeFieldID]);

  return (
    <Fragment>
      <Hoverable>
        {(hovered) => (
          <PressableHighlight
            ref={targetRef}
            onPress={handlePress}
            style={[
              styles.headerCell,
              themeStyles.border.default,
              primary && styles.primaryCell,
            ]}
          >
            <ContextMenuView style={styles.menuView} menuItems={menuItems}>
              <Row spacing={4}>
                <Icon name={getFieldIcon(field.type)} />
                <Text weight="bold">{field.name}</Text>
              </Row>
              {(resizeFieldID === fieldID ||
                (resizeFieldID === null && hovered)) && (
                <Pressable
                  onPressIn={handlePressIn}
                  // @ts-ignore: Available in react-native-web
                  onPressMove={handlePressMove}
                  onPressOut={handlePressOut}
                  style={[
                    styles.resizeHandler,
                    themeStyles.border.default,
                    themeStyles.elevation.level1,
                  ]}
                >
                  <Icon color="primary" size="sm" name="ArrowHorizontal" />
                </Pressable>
              )}
            </ContextMenuView>
          </PressableHighlight>
        )}
      </Hoverable>
      <Popover
        visible={visible}
        targetRef={targetRef}
        content={<ContextMenu menuItems={menuItems} />}
        onRequestClose={handleRequestClose}
      />
    </Fragment>
  );
});

function useHeaderCellContextMenuItems() {
  return useMemo(
    (): ContextMenuItem[] => [
      { label: 'Edit field type' },
      { label: 'Rename' },
      { label: 'Edit description' },
      { label: 'Edit permissions' },
      { label: 'Move left' },
      { label: 'Move right' },
      { label: 'Sort ascending' },
      { label: 'Sort descending' },
      { label: 'Add filter' },
      { label: 'Group by this field' },
      { label: 'Duplicate' },
      { label: 'Hide' },
      { label: 'Delete' },
    ],
    [],
  );
}

export const LastHeaderCell = memo(function LastHeaderCell(): JSX.Element {
  const themeStyles = useThemeStyles();

  return (
    <View style={[styles.headerCell, themeStyles.border.default]}>
      <Text>Add field</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {},

  headerCell: {
    flex: 1,
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
  menuView: {
    paddingHorizontal: 8,
  },
  primaryCell: {
    borderRightWidth: 2,
  },
  resizeHandler: {
    position: 'absolute',
    right: 2,
    borderRadius: 999,
    borderWidth: 1,
    ...Platform.select({
      web: {
        cursor: 'grab',
      },
    }),
  },
});
