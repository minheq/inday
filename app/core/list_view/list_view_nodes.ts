import { isNotEmpty } from "../../../lib/array_utils";
import { Document } from "../../../models/documents";
import { areFieldValuesEqual, Field, FieldValue } from "../../../models/fields";
import { Group } from "../../../models/groups";
import {
  DocumentNode,
  makeDocumentNodes,
  SortGetters,
} from "../../../models/sorts";

export type ListViewNodes =
  | GroupedListViewDocumentNode[]
  | FlatListViewDocumentNode[];

export function getListViewNodes(
  documents: Document[],
  groups: Group[],
  sortGetters: SortGetters,
  collapsedGroupsByFieldID?: CollapsedGroupsByFieldID
): ListViewNodes {
  return isNotEmpty(groups)
    ? getGroupedDocumentNodes(
        documents,
        groups,
        sortGetters,
        collapsedGroupsByFieldID
      )
    : getFlatDocumentNodes(documents);
}

export type CollapsedGroupsByFieldID = {
  [fieldID: string]: FieldValue[] | undefined;
};

export function isGroupedListViewDocumentNodes(
  nodes: GroupedListViewDocumentNode[] | FlatListViewDocumentNode[]
): nodes is GroupedListViewDocumentNode[] {
  if (nodes.length === 1 && nodes[0].type === "flat") {
    return false;
  }

  return true;
}

/**
 * Single group with flat list of documents
 */
export interface FlatListViewDocumentNode {
  type: "flat";
  children: Document[];
}

function getFlatDocumentNodes(
  documents: Document[]
): FlatListViewDocumentNode[] {
  return [{ type: "flat", children: documents }];
}

/**
 * In a nested documents, leaf are the lowest groups
 */
interface LeafGroupedListViewDocumentNode {
  type: "leaf";
  collapsed: boolean;
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
  collapsedGroups?: CollapsedGroupsByFieldID
): GroupedListViewDocumentNode[] {
  const nodes = makeDocumentNodes(groups, documents, sortGetters);

  return toGroupedDocumentNode(nodes, collapsedGroups);
}

function toGroupedDocumentNode(
  nodes: DocumentNode[],
  collapsedGroups?: CollapsedGroupsByFieldID
): GroupedListViewDocumentNode[] {
  let groups: GroupedListViewDocumentNode[] = [];

  for (const node of nodes) {
    const collapsedValues = collapsedGroups && collapsedGroups[node.field.id];
    const collapsed = !!(
      collapsedValues &&
      collapsedValues.some((v) =>
        areFieldValuesEqual(node.field, v, node.value)
      )
    );

    if (node.type === "leaf") {
      groups = groups.concat({
        type: "leaf",
        collapsed,
        field: node.field,
        value: node.value,
        children: node.children,
      });
    } else {
      groups = groups.concat({
        type: "ancestor",
        collapsed,
        field: node.field,
        value: node.value,
        children: toGroupedDocumentNode(node.children, collapsedGroups),
      });
    }
  }

  return groups;
}
