import { FieldID, Field } from './fields';
import { Document } from './documents';
import { filtersByFieldType, FilterGroup } from './filters';
import { isEmpty } from '../../lib/data_structures/arrays';

export type ViewID = string;

interface BaseView {
  id: ViewID;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  collectionID: string;
}

export interface ListViewFieldConfig {
  visible: boolean;
  width: number;
}

interface ListViewConfig {
  type: 'list';
  fieldsOrder: FieldID[];
  fieldsConfig: {
    [fieldID: string]: ListViewFieldConfig;
  };
}

export interface ListView extends BaseView, ListViewConfig {}

interface BoardViewConfig {
  type: 'board';
  stackFieldID: FieldID;
}

export interface BoardView extends BaseView, BoardViewConfig {}

export type View = ListView | BoardView;
export type ViewType = View['type'];

export function filterDocumentsByView(
  filterGroups: FilterGroup[],
  documents: Document[],
  getField: (fieldID: string) => Field,
) {
  let filteredDocuments = documents;

  filteredDocuments = filteredDocuments.filter((doc) => {
    if (isEmpty(filterGroups)) {
      return true;
    }

    return filterGroups.some((filterGroup) => {
      return filterGroup.every((filter) => {
        const field = getField(filter.fieldID);

        const applyFilter = filtersByFieldType[field.type];

        return applyFilter(doc.fields[filter.fieldID], filter);
      });
    });
  });

  return filteredDocuments;
}

export function assertListView(view: View): asserts view is ListView {
  if (view.type !== 'list') {
    throw new Error(`Expected view to be list. Received ${view.type}`);
  }
}

export function assertBoardView(view: View): asserts view is ListView {
  if (view.type !== 'board') {
    throw new Error(`Expected view to be board. Received ${view.type}`);
  }
}
