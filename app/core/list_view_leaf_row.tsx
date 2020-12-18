import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ContextMenu } from '../components/context_menu';
import { ContextMenuItem } from '../components/context_menu_content';
import { LeafRowState } from '../components/grid_renderer.common';
import { useTheme } from '../components/theme';
import { tokens } from '../components/tokens';
import { RecordID } from '../data/records';
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
      <LeafRowRenderer>{children}</LeafRowRenderer>
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

interface LeafRowRendererProps {
  children: React.ReactNode;
}

function LeafRowRenderer(props: LeafRowRendererProps) {
  const { children } = props;
  const { selected } = useLeafRowContext();
  const options = useLeafRowContextMenuOptions();
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        theme === 'dark' ? styles.rowBackgroundDark : styles.rowBackgroundLight,
        selected === true &&
          (theme === 'dark' ? styles.selectedRowDark : styles.selectedRowLight),
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

const styles = StyleSheet.create({
  rowBackgroundDark: {
    backgroundColor: tokens.colors.gray[900],
  },
  rowBackgroundLight: {
    backgroundColor: tokens.colors.base.white,
  },
  row: {},
  selectedRowLight: {
    backgroundColor: tokens.colors.blue[50],
  },
  selectedRowDark: {
    backgroundColor: tokens.colors.lightBlue[900],
  },
});
