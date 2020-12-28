import React, { memo, useCallback, useRef } from 'react';
import {
  GestureResponderEvent,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { atom, useRecoilState } from 'recoil';
import { Hoverable } from '../../components/hoverable';
import { Icon } from '../../components/icon';

import { Row } from '../../components/row';
import { Text } from '../../components/text';

import { useThemeStyles } from '../../components/theme';
import { FieldID } from '../../data/fields';
import { useGetField, useUpdateListViewFieldConfig } from '../../data/store';
import { getFieldIcon } from '../views/icon_helpers';
import { useListViewViewContext } from './list_view_view';

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
  const field = useGetField(fieldID);
  const widthRef = useRef(width);
  const anchorRef = useRef(0);
  const themeStyles = useThemeStyles();
  const updateListViewFieldConfig = useUpdateListViewFieldConfig();

  const handlePressMove = useCallback(
    (e: GestureResponderEvent) => {
      const nextWidth =
        widthRef.current + (e.nativeEvent.pageX - anchorRef.current);

      updateListViewFieldConfig(viewID, fieldID, { width: nextWidth });
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
    <Hoverable>
      {(hovered) => (
        <View
          style={[
            styles.headerCell,
            themeStyles.border.default,
            primary && styles.primaryCell,
          ]}
        >
          <Row spacing={4}>
            <Icon name={getFieldIcon(field.type)} />
            <Text weight="bold">{field.name}</Text>
          </Row>
          {(resizeFieldID === fieldID ||
            (resizeFieldID === null && hovered)) && (
            <Pressable
              onPressIn={handlePressIn}
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
        </View>
      )}
    </Hoverable>
  );
});

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
    height: '100%',
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
  primaryCell: {
    borderRightWidth: 2,
  },
  resizeHandler: {
    position: 'absolute',
    right: 4,
    borderRadius: 999,
    borderWidth: 1,
    ...Platform.select({
      web: {
        cursor: 'grab',
      },
    }),
  },
});
