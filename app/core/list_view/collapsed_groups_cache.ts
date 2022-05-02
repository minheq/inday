import { mergeObjects } from "../../../lib/object_utils";
import { Field, FieldValue, stringifyFieldValue } from "../../../models/fields";

export interface CollapsedGroupsCache {
  set: (node: CollapsedGroupNode[]) => CollapsedGroupsCache;
  get: (field: Field, value: FieldValue) => CollapsedGroupsNode;
}

type CollapsedGroupNode = [
  field: Field,
  value: FieldValue,
  collapsed: boolean,
  children?: CollapsedGroupNode[] | undefined
];

interface CollapsedGroupsNode {
  collapsed: boolean;
  children: CollapsedGroupsCache | undefined;
  /** Gets child collapse groups */
  get: (field: Field, value: FieldValue) => CollapsedGroupsNode;
}

/**
 * Reason: We use array to build a tree because we cannot use
 * Map/objects in creating tree because field values vary in types.
 */
export function CollapsedGroupsCache(
  nodes: CollapsedGroupNode[]
): CollapsedGroupsCache {
  const tree: CollapsedFieldValueTree = buildCollapsedFieldValuesTree(nodes);

  return buildCollapseGroupObject(tree);
}

function buildCollapseGroupObject(
  tree: CollapsedFieldValueTree
): CollapsedGroupsCache {
  return {
    set: (nodes: CollapsedGroupNode[]) => {
      const nextTree = updateCollapsedFieldValueTree(tree, nodes);

      return buildCollapseGroupObject(nextTree);
    },
    get: (field, value) => {
      const key = stringifyFieldValue(field, value);
      const node = tree[key];

      return buildCollapsedGroupsNode(node);
    },
  };
}

function buildCollapsedGroupsNode(
  node: CollapsedFieldValueNode
): CollapsedGroupsNode {
  const children = node.children;
  return {
    collapsed: node.collapsed,
    children: children ? buildCollapseGroupObject(children) : undefined,
    get: (field, value) => {
      if (!children) {
        throw new Error("Failed to build a group tree");
      }

      const key = stringifyFieldValue(field, value);
      const n = children[key];
      return buildCollapsedGroupsNode(n);
    },
  };
}

interface CollapsedFieldValueTree {
  [stringifyFieldValue: string]: CollapsedFieldValueNode;
}

interface CollapsedFieldValueNode {
  collapsed: boolean;
  children?: CollapsedFieldValueTree;
}

export function updateCollapsedFieldValueTree(
  prevTree: CollapsedFieldValueTree,
  nodes: CollapsedGroupNode[]
): CollapsedFieldValueTree {
  const nextTree = buildCollapsedFieldValuesTree(nodes);

  return mergeObjects(prevTree, nextTree);
}

export function buildCollapsedFieldValuesTree(nodes: undefined): undefined;
export function buildCollapsedFieldValuesTree(
  nodes: CollapsedGroupNode[]
): CollapsedFieldValueTree;
export function buildCollapsedFieldValuesTree(
  nodes: CollapsedGroupNode[] | undefined
): CollapsedFieldValueTree | undefined {
  const obj: CollapsedFieldValueTree = {};

  if (nodes === undefined) {
    return undefined;
  }

  for (const node of nodes) {
    const [field, value, collapsed, children] = node;
    const key = stringifyFieldValue(field, value);

    obj[key] = {
      collapsed,
      children: children ? buildCollapsedFieldValuesTree(children) : undefined,
    };
  }

  return obj;
}
