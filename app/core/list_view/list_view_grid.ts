import { useMemo } from "react";

import { GridGroup, LeafRow } from "../../components/grid_renderer.common";
import { DocumentID } from "../../../models/documents";
import { FieldWithListViewConfig } from "../../../models/views";
import { ADD_FIELD_COLUMN_WIDTH } from "./list_view_constants";
import { getLeafRows, ListViewMap } from "./list_view_map";
import {
  isGroupedListViewDocumentNodes,
  FlatListViewDocumentNode,
  GroupedListViewDocumentNode,
} from "./list_view_nodes";

/**
 * Transforms nodes to grid groups
 */
export function useListViewGridGroups(
  nodes: GroupedListViewDocumentNode[] | FlatListViewDocumentNode[]
): GridGroup[] {
  return useMemo((): GridGroup[] => {
    if (isGroupedListViewDocumentNodes(nodes)) {
      return toGroupedGridGroups(nodes);
    }

    return toFlatGridGroups(nodes);
  }, [nodes]);
}

function toGroupedGridGroups(
  nodes: GroupedListViewDocumentNode[]
): GridGroup[] {
  let groups: GridGroup[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.type === "leaf") {
      groups = groups.concat({
        type: "leaf",
        collapsed: node.collapsed,
        rowCount: node.children.length + 1, // + 1 adds a row for `Add document`
      });
    } else {
      groups = groups.concat({
        type: "ancestor",
        collapsed: node.collapsed,
        children: toGroupedGridGroups(node.children),
      });
    }
  }

  return groups;
}

function toFlatGridGroups(nodes: FlatListViewDocumentNode[]): GridGroup[] {
  let groups: GridGroup[] = [];

  for (const node of nodes) {
    groups = groups.concat({
      type: "leaf",
      collapsed: false,
      rowCount: node.children.length + 1, // + 1 adds a row for `Add document`
    });
  }

  return groups;
}

export function useListViewGridColumns(
  fields: FieldWithListViewConfig[]
): number[] {
  return useMemo(
    (): number[] =>
      fields.map((field) => field.config.width).concat(ADD_FIELD_COLUMN_WIDTH),
    [fields]
  );
}

export function useListViewGridSelectedRows(
  listViewMap: ListViewMap,
  selectedDocumentIDs: DocumentID[]
): LeafRow[] {
  return useMemo(
    (): LeafRow[] => getLeafRows(listViewMap, selectedDocumentIDs),
    [selectedDocumentIDs, listViewMap]
  );
}
