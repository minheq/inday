import { Field, FieldValue, stringifyFieldValue } from "../../../models/fields";

type CollapseGroupNode = [
  field: Field,
  value: FieldValue,
  collapsed: boolean,
  children?: CollapseGroupNode[] | undefined
];

export interface CollapsedGroups {
  set: (node: CollapseGroupNode) => void;
  get: (field: Field, value: FieldValue) => ChildCollapseGroups;
}

interface ChildCollapseGroups {
  collapsed: boolean;
  children: CollapsedGroups | undefined;
  /** Gets child collapse groups */
  get: (field: Field, value: FieldValue) => ChildCollapseGroups;
  // set: (node: CollapseGroupNode) => ChildCollapseGroups;
}

/**
 * Reason: We use array to build a tree because we cannot use
 * Map/objects in creating tree because field values vary in types.
 */
export function CollapsedGroups(nodes: CollapseGroupNode[]): CollapsedGroups {
  const tree: CollapseObjectTree = buildCollapseObjectTree(nodes);

  return buildCollapseGroupObject(tree);
}

function buildCollapseGroupObject(tree: CollapseObjectTree): CollapsedGroups {
  return {
    set: () => {
      return;
    },
    get: (field, value) => {
      const key = stringifyFieldValue(field, value);
      const node = tree[key];

      return buildCollapseGroupObjectFromNode(node);
    },
  };
}

function buildCollapseGroupObjectFromNode(
  node: CollapseObjectNode
): ChildCollapseGroups {
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
      return buildCollapseGroupObjectFromNode(n);
    },
  };
}

type CollapseObjectTree = {
  [stringifyFieldValue: string]: CollapseObjectNode;
};

type CollapseObjectNode = {
  collapsed: boolean;
  children?: CollapseObjectTree;
};

export function buildCollapseObjectTree(nodes: undefined): undefined;
export function buildCollapseObjectTree(
  nodes: CollapseGroupNode[]
): CollapseObjectTree;
export function buildCollapseObjectTree(
  nodes: CollapseGroupNode[] | undefined
): CollapseObjectTree | undefined {
  const obj: CollapseObjectTree = {};

  if (nodes === undefined) {
    return undefined;
  }

  for (const node of nodes) {
    const [field, value, collapsed, children] = node;
    const key = stringifyFieldValue(field, value);

    obj[key] = {
      collapsed,
      children: children ? buildCollapseObjectTree(children) : undefined,
    };
  }

  return obj;
}
