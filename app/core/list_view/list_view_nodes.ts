import { isNotEmpty } from "../../../lib/array_utils";
import { Document } from "../../../models/documents";
import { Field, FieldValue } from "../../../models/fields";
import { Group } from "../../../models/groups";
import {
  DocumentNode,
  makeDocumentNodes,
  SortGetters,
} from "../../../models/sorts";

export type ListViewDocumentNodes =
  | GroupedListViewDocumentNode[]
  | FlatListViewDocumentNode[];

export function getListViewDocumentNodes(
  documents: Document[],
  groups: Group[],
  sortGetters: SortGetters
): ListViewDocumentNodes {
  return isNotEmpty(groups)
    ? getGroupedDocumentNodes(documents, groups, sortGetters)
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
  sortGetters: SortGetters
): GroupedListViewDocumentNode[] {
  const nodes = makeDocumentNodes(groups, documents, sortGetters);

  return toGroupedDocumentNode(nodes, []);
}

function toGroupedDocumentNode(
  nodes: DocumentNode[],
  prevPath: number[]
): GroupedListViewDocumentNode[] {
  let groups: GroupedListViewDocumentNode[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const path = [...prevPath, i];

    if (node.type === "leaf") {
      groups = groups.concat({
        type: "leaf",
        path,
        collapsed: false,
        field: node.field,
        value: node.value,
        children: node.children,
      });
    } else {
      groups = groups.concat({
        type: "ancestor",
        path,
        collapsed: false,
        field: node.field,
        value: node.value,
        children: toGroupedDocumentNode(node.children, path),
      });
    }
  }

  return groups;
}
