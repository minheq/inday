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
import { CollapsedGroups } from "./list_view_view";

/**
 * Transforms nodes to grid groups
 * @param nodes
 */
export function useListViewGridGroups(
  nodes: GroupedListViewDocumentNode[] | FlatListViewDocumentNode[],
  collapsedGroups?: CollapsedGroups
): GridGroup[] {
  return useMemo((): GridGroup[] => {
    if (isGroupedListViewDocumentNodes(nodes)) {
      return toGroupedGridGroups(nodes, [], collapsedGroups);
    }

    return toFlatGridGroups(nodes);
  }, [nodes, collapsedGroups]);
}

function toGroupedGridGroups(
  nodes: GroupedListViewDocumentNode[],
  prevPath: number[],
  collapsedGroups?: CollapsedGroups
): GridGroup[] {
  let groups: GridGroup[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const path = [...prevPath, i];
    const collapsed = !!(collapsedGroups ? collapsedGroups.get(path) : false);

    if (node.type === "leaf") {
      groups = groups.concat({
        type: "leaf",
        collapsed,
        rowCount: node.children.length + 1, // + 1 adds a row for `Add document`
      });
    } else {
      groups = groups.concat({
        type: "ancestor",
        collapsed,
        children: toGroupedGridGroups(node.children, path, collapsedGroups),
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
