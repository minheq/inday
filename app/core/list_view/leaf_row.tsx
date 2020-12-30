import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ContextMenu } from '../../components/context_menu';
import { ContextMenuItem } from '../../components/context_menu_view';
import { LeafRowState } from '../../components/grid_renderer.common';
import { PressableHighlight } from '../../components/pressable_highlight';
import { Text } from '../../components/text';
import { useThemeStyles } from '../../components/theme';
import { DocumentID } from '../../data/documents';
import { useListViewViewContext } from './list_view_view';

interface LeafRowProps {
  documentID: DocumentID;
  state: LeafRowState;
  children: React.ReactNode;
}

export function LeafRow(props: LeafRowProps): JSX.Element {
  const { children, state, documentID } = props;

  const selected = state === 'selected';

  const value = useMemo((): LeafRowContext => {
    return {
      documentID,
      selected,
    };
  }, [selected, documentID]);

  return (
    <LeafRowContext.Provider value={value}>
      <LeafRowView>{children}</LeafRowView>
    </LeafRowContext.Provider>
  );
}

interface LeafRowContext {
  selected: boolean;
  documentID: DocumentID;
}

const LeafRowContext = createContext<LeafRowContext>({
  selected: false,
  documentID: 'doc',
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
  const { onOpenDocument } = useListViewViewContext();
  const { documentID } = useLeafRowContext();

  const handleOpen = useCallback(() => {
    onOpenDocument(documentID);
  }, [onOpenDocument, documentID]);

  return useMemo(
    (): ContextMenuItem[] => [
      { label: 'Open', icon: 'Archive', onPress: handleOpen },
      { label: 'Insert document below' },
      { label: 'Insert document above' },
      { label: 'Duplicate' },
      { label: 'Share' },
      { label: 'Delete', icon: 'Archive' },
    ],
    [handleOpen],
  );
}

export function LastLeafRow(): JSX.Element {
  const { onAddDocument } = useListViewViewContext();

  return (
    <PressableHighlight onPress={onAddDocument}>
      <Text>Add document</Text>
    </PressableHighlight>
  );
}

const styles = StyleSheet.create({
  row: {},
});
