import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ContextMenu } from '../../components/context_menu';
import { ContextMenuItem } from '../../components/context_menu_view';
import { LeafRowState } from '../../components/grid_renderer.common';
import { PressableHighlight } from '../../components/pressable_highlight';
import { Text } from '../../components/text';
import { useThemeStyles } from '../../components/theme';
import { RecordID } from '../../data/records';
import { useListViewViewContext } from './list_view_view';

interface LeafRowProps {
  recordID: RecordID;
  state: LeafRowState;
  children: React.ReactNode;
}

export function LeafRow(props: LeafRowProps): JSX.Element {
  const { children, state, recordID } = props;

  const selected = state === 'selected';

  const value = useMemo((): LeafRowContext => {
    return {
      recordID,
      selected,
    };
  }, [selected, recordID]);

  return (
    <LeafRowContext.Provider value={value}>
      <LeafRowView>{children}</LeafRowView>
    </LeafRowContext.Provider>
  );
}

interface LeafRowContext {
  selected: boolean;
  recordID: RecordID;
}

const LeafRowContext = createContext<LeafRowContext>({
  selected: false,
  recordID: 'rec',
});

export function useLeafRowContext(): LeafRowContext {
  return useContext(LeafRowContext);
}

interface LeafRowViewProps {
  children: React.ReactNode;
}

function LeafRowView(props: LeafRowViewProps) {
  const { children } = props;
  const { selected } = useLeafRowContext();
  const options = useLeafRowContextMenuOptions();
  const themeStyles = useThemeStyles();

  return (
    <View
      style={[
        styles.row,
        themeStyles.background.content,
        selected && themeStyles.background.lightPrimary,
      ]}
    >
      <ContextMenu options={options}>{children}</ContextMenu>
    </View>
  );
}

export function useLeafRowContextMenuOptions(): ContextMenuItem[] {
  const { onOpenRecord } = useListViewViewContext();
  const { recordID } = useLeafRowContext();

  const handleOpen = useCallback(() => {
    onOpenRecord(recordID);
  }, [onOpenRecord, recordID]);

  return useMemo(
    (): ContextMenuItem[] => [
      { label: 'Open', icon: 'Archive', onPress: handleOpen },
      { label: 'Insert record below' },
      { label: 'Insert record above' },
      { label: 'Duplicate' },
      { label: 'Share' },
      { label: 'Delete', icon: 'Archive' },
    ],
    [handleOpen],
  );
}

export function LastLeafRow(): JSX.Element {
  const { onAddRecord } = useListViewViewContext();

  return (
    <PressableHighlight onPress={onAddRecord}>
      <Text>Add record</Text>
    </PressableHighlight>
  );
}

const styles = StyleSheet.create({
  row: {},
});
