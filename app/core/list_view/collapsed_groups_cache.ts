import { mergeObjects } from "../../../lib/object_utils";
import { Field, FieldValue, stringifyFieldValue } from "../../../models/fields";

type CollapseGroupNode = [
  field: Field,
  value: FieldValue,
  collapsed: boolean,
  children?: CollapseGroupNode[] | undefined
];

export interface CollapsedGroupsCache {
  set: (node: CollapseGroupNode[]) => CollapsedGroupsCache;
  get: (field: Field, value: FieldValue) => CollapsedGroupNode;
}

interface CollapsedGroupNode {
  collapsed: boolean;
  children: CollapsedGroupsCache | undefined;
  /** Gets child collapse groups */
  get: (field: Field, value: FieldValue) => CollapsedGroupNode;
}

/**
 * Reason: We use array to build a tree because we cannot use
 * Map/objects in creating tree because field values vary in types.
 */
export function CollapsedGroupsCache(
  nodes: CollapseGroupNode[]
): CollapsedGroupsCache {
  const tree: CollapsedFieldValueTree = buildCollapsedFieldValuesTree(nodes);

  return buildCollapseGroupObject(tree);
}

function buildCollapseGroupObject(
  tree: CollapsedFieldValueTree
): CollapsedGroupsCache {
  return {
    set: (nodes: CollapseGroupNode[]) => {
      const nextTree = updateCollapsedFieldValueTree(tree, nodes);

      return buildCollapseGroupObject(nextTree);
    },
    get: (field, value) => {
      const key = stringifyFieldValue(field, value);
      const node = tree[key];

      return buildCollapseGroupNodeFromNode(node);
    },
  };
}

function buildCollapseGroupNodeFromNode(
  node: CollapsedFieldValueNode
): CollapsedGroupNode {
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
      return buildCollapseGroupNodeFromNode(n);
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
  nodes: CollapseGroupNode[]
): CollapsedFieldValueTree {
  const nextTree = buildCollapsedFieldValuesTree(nodes);

  return mergeObjects(prevTree, nextTree);
}

export function buildCollapsedFieldValuesTree(nodes: undefined): undefined;
export function buildCollapsedFieldValuesTree(
  nodes: CollapseGroupNode[]
): CollapsedFieldValueTree;
export function buildCollapsedFieldValuesTree(
  nodes: CollapseGroupNode[] | undefined
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
