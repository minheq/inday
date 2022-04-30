import { useCallback, useMemo } from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { removeBy } from "../../../lib/array_utils";
import { Document } from "../../../models/documents";
import { areFieldValuesEqual, Field, FieldValue } from "../../../models/fields";
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
import {
  CollapsedGroupsByFieldID,
  getListViewNodes,
  ListViewNodes,
} from "./list_view_nodes";

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
export function useListViewNodes(viewID: ViewID): ListViewNodes {
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
      getListViewNodes(
        documents,
        groups,
        sortGetters,
        collapsedGroupsByFieldID
      ),
    documentsOrderChanged
  );
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
