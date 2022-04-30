import { useCallback, useMemo } from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { isNotEmpty, removeBy } from "../../../lib/array_utils";
import { Document } from "../../../models/documents";
import { areFieldValuesEqual, Field, FieldValue } from "../../../models/fields";
import { Group } from "../../../models/groups";
import {
  DocumentNode,
  makeDocumentNodes,
  SortGetters,
} from "../../../models/sorts";
import { ViewID } from "../../../models/views";
import { useMemoCompare } from "../../hooks/use_memo_compare";
import { usePrevious } from "../../hooks/use_previous";
import {
  useSortGettersQuery,
  useViewDocumentsQuery,
  useViewFiltersQuery,
  useViewGroupsQuery,
  useViewSortsQuery,
} from "../../store/queries";

type CollapsedGroupsByFieldID = {
  [fieldID: string]: FieldValue[] | undefined;
};

type CollapsedGroupsByViewID = {
  [viewID: string]: CollapsedGroupsByFieldID | undefined;
};

const collapsedGroupsState = atom<CollapsedGroupsByViewID>({
  key: "ListViewData_CollapsedGroups",
  default: {},
});

/**
 * Returns tree of document nodes.
 * If view is sorted by groups and sorts, return tree of `GroupedListViewDocumentNode`.
 * If view is a flat list, return list of `FlatListViewDocumentNode`
 */
export function useListViewNodes(
  viewID: ViewID
): GroupedListViewDocumentNode[] | FlatListViewDocumentNode[] {
  const collapsedGroupsByViewID = useRecoilValue(collapsedGroupsState);
  const collapsedGroupsByFieldID = useMemo(
    () => collapsedGroupsByViewID[viewID],
    [collapsedGroupsByViewID, viewID]
  );
  const documents = useViewDocumentsQuery(viewID);
  const groups = useViewGroupsQuery(viewID);
  const sortGetters = useSortGettersQuery();
  const documentsOrderChanged = useDocumentsOrderChanged(viewID, documents);

  return useMemoCompare(
    () =>
      isNotEmpty(groups)
        ? getGroupedDocumentNodes(
            documents,
            groups,
            sortGetters,
            collapsedGroupsByFieldID
          )
        : getFlatDocumentNodes(documents),
    documentsOrderChanged
  );
}

export function isGroupedListViewDocumentNodes(
  nodes: GroupedListViewDocumentNode[] | FlatListViewDocumentNode[]
): nodes is GroupedListViewDocumentNode[] {
  if (nodes.length === 1 && nodes[0].type === "flat") {
    return false;
  }

  return true;
}

export function useToggleCollapseGroup(
  viewID: ViewID
): (field: Field, value: FieldValue, collapsed: boolean) => void {
  const [collapsedGroupsByViewID, setCollapsedGroupsByViewID] =
    useRecoilState(collapsedGroupsState);

  return useCallback(
    (field: Field, value: FieldValue, collapsed: boolean) => {
      const nextCollapsedGroupsByViewID: CollapsedGroupsByViewID = {
        ...collapsedGroupsByViewID,
      };
      const collapsedGroupsByFieldID = {
        ...nextCollapsedGroupsByViewID[viewID],
      };
      let collapsedValues = collapsedGroupsByFieldID[field.id];

      if (collapsed) {
        if (collapsedValues) {
          collapsedValues = collapsedValues.concat(value);
        } else {
          collapsedValues = [value];
        }
      } else {
        if (collapsedValues) {
          collapsedValues = removeBy(collapsedValues, (v) =>
            areFieldValuesEqual(field, v, value)
          );
        }
      }

      collapsedGroupsByFieldID[field.id] = collapsedValues;
      nextCollapsedGroupsByViewID[viewID] = collapsedGroupsByFieldID;

      setCollapsedGroupsByViewID(nextCollapsedGroupsByViewID);
    },
    [setCollapsedGroupsByViewID, collapsedGroupsByViewID, viewID]
  );
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

function useDocumentsOrderChanged(
  viewID: ViewID,
  documents: Document[]
): boolean {
  const collapsedGroupsByViewID = useRecoilValue(collapsedGroupsState);
  const collapsedGroups = useMemo(
    () => collapsedGroupsByViewID[viewID],
    [collapsedGroupsByViewID, viewID]
  );
  const documentsLength = documents.length;
  const filters = useViewFiltersQuery(viewID);
  const sorts = useViewSortsQuery(viewID);
  const groups = useViewGroupsQuery(viewID);

  const prevCollapsedGroups = usePrevious(collapsedGroups);
  const prevDocumentsLength = usePrevious(documents.length);
  const prevFilters = usePrevious(filters);
  const prevSorts = usePrevious(sorts);
  const prevGroups = usePrevious(groups);

  return useMemo(() => {
    return (
      documentsLength !== prevDocumentsLength ||
      filters !== prevFilters ||
      sorts !== prevSorts ||
      groups !== prevGroups ||
      collapsedGroups !== prevCollapsedGroups
    );
  }, [
    documentsLength,
    prevDocumentsLength,
    filters,
    prevFilters,
    sorts,
    prevSorts,
    groups,
    prevGroups,
    collapsedGroups,
    prevCollapsedGroups,
  ]);
}

function useFieldsOrderChanged(_viewID: ViewID, fields: Field[]): boolean {
  const prevFields = usePrevious(fields);

  return useMemo(() => {
    return fields.length !== prevFields.length;
  }, [fields, prevFields]);
}
