import { isNotEmpty } from "../../../lib/array_utils";
import { Document } from "../../../models/documents";
import { Field, FieldValue } from "../../../models/fields";
import { Group } from "../../../models/groups";
import {
  DocumentNode,
  makeDocumentNodes,
  SortGetters,
} from "../../../models/sorts";
import { CollapsedGroups } from "./list_view_collapsed_groups";

export type ListViewDocumentNodes =
  | GroupedListViewDocumentNode[]
  | FlatListViewDocumentNode[];

export function getListViewDocumentNodes(
  documents: Document[],
  groups: Group[],
  sortGetters: SortGetters,
  collapsedGroups?: CollapsedGroups
): ListViewDocumentNodes {
  return isNotEmpty(groups)
    ? getGroupedDocumentNodes(documents, groups, sortGetters, collapsedGroups)
    : getFlatDocumentNodes(documents);
}

export type CollapsedGroupsByFieldID = {
  [fieldID: string]: FieldValue[] | undefined;
};

export function isGroupedListViewDocumentNodes(
  nodes: GroupedListViewDocumentNode[] | FlatListViewDocumentNode[]
): nodes is GroupedListViewDocumentNode[] {
  return nodes.length === 1 && nodes[0].type === "flat" ? false : true;
}

/**
 * Single group with flat list of documents
 */
export interface FlatListViewDocumentNode {
  type: "flat";
  path: number[];
  children: Document[];
}

function getFlatDocumentNodes(
  documents: Document[]
): FlatListViewDocumentNode[] {
  return [{ type: "flat", path: [0], children: documents }];
}

/**
 * In a nested documents, leaf are the lowest groups
 */
interface LeafGroupedListViewDocumentNode {
  type: "leaf";
  collapsed: boolean;
  path: number[];
  field: Field;
  value: FieldValue;
  children: Document[];
}

/**
 * In a nested documents, ancestor contains children leaf groups
 */
interface AncestorGroupedListViewDocumentNode {
  type: "ancestor";
  collapsed: boolean;
  path: number[];
  field: Field;
  value: FieldValue;
  children: GroupedListViewDocumentNode[];
}

/**
 * Nested documents grouped by sort
 */
export type GroupedListViewDocumentNode =
  | LeafGroupedListViewDocumentNode
  | AncestorGroupedListViewDocumentNode;

function getGroupedDocumentNodes(
  documents: Document[],
  groups: Group[],
  sortGetters: SortGetters,
  collapsedGroups: CollapsedGroups | undefined
): GroupedListViewDocumentNode[] {
  const nodes = makeDocumentNodes(groups, documents, sortGetters);

  return toGroupedDocumentNode(nodes, [], collapsedGroups);
}

function toGroupedDocumentNode(
  nodes: DocumentNode[],
  prevPath: number[],
  collapsedGroups: CollapsedGroups | undefined
): GroupedListViewDocumentNode[] {
  let groups: GroupedListViewDocumentNode[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const path = [...prevPath, i];
    const collapsibleGroup =
      collapsedGroups && collapsedGroups.get(node.field, node.value);

    if (node.type === "leaf") {
      groups = groups.concat({
        type: "leaf",
        path,
        collapsed: !!collapsibleGroup?.collapsed,
        field: node.field,
        value: node.value,
        children: node.children,
      });
    } else {
      groups = groups.concat({
        type: "ancestor",
        path,
        collapsed: !!collapsibleGroup?.collapsed,
        field: node.field,
        value: node.value,
        children: toGroupedDocumentNode(
          node.children,
          path,
          collapsibleGroup?.children
        ),
      });
    }
  }

  return groups;
}
