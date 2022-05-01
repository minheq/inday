import React, { createContext, useCallback, useContext, useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { ContextMenuView } from "../../components/context_menu_view";
import { ContextMenuItem } from "../../components/context_menu";
import { LeafRowState } from "../../components/grid_renderer.common";
import { PressableHighlight } from "../../components/pressable_highlight";
import { Text } from "../../components/text";
import { DocumentID } from "../../../models/documents";
import { useListViewContext } from "./list_view";
import { theme } from "../../components/theme";

interface LeafRowProps {
  documentID: DocumentID;
  state: LeafRowState;
  children: React.ReactNode;
}

export function LeafRow(props: LeafRowProps): JSX.Element {
  const { children, state, documentID } = props;

  const selected = state === "selected";

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
  documentID: "doc",
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
  const menuItems = useLeafRowContextMenuItems();

  return (
    <View style={[styles.row, selected && styles.selected]}>
      <ContextMenuView menuItems={menuItems}>{children}</ContextMenuView>
    </View>
  );
}

export function useLeafRowContextMenuItems(): ContextMenuItem[] {
  const { onOpenDocument } = useListViewContext();
  const { documentID } = useLeafRowContext();

  const handleOpen = useCallback(() => {
    onOpenDocument(documentID);
  }, [onOpenDocument, documentID]);

  return useMemo(
    (): ContextMenuItem[] => [
      { label: "Open", icon: "Archive", onPress: handleOpen },
      { label: "Insert document below" },
      { label: "Insert document above" },
      { label: "Duplicate" },
      { label: "Share" },
      { label: "Delete", icon: "Archive" },
    ],
    [handleOpen]
  );
}

export function LastLeafRow(): JSX.Element {
  const { onAddDocument } = useListViewContext();

  return (
    <PressableHighlight style={styles.addDocument} onPress={onAddDocument}>
      <Text color="muted">Add document</Text>
    </PressableHighlight>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: theme.base.white,
  },
  selected: {
    backgroundColor: theme.primary[100],
  },
  addDocument: {
    height: 40,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    borderColor: theme.neutral[200],
  },
});
