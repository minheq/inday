import { generateID, validateID } from '../../lib/id';
import { CollectionID } from './collections';
import { FieldID, Field } from './fields';

export const viewIDPrefix = 'viw' as const;
export type ViewID = `${typeof viewIDPrefix}${string}`;

export const View = {
  generateID: (): ViewID => {
    return generateID(viewIDPrefix);
  },
  validateID: (id: string): void => {
    return validateID(viewIDPrefix, id);
  },
};

export interface BaseView {
  id: ViewID;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  collectionID: CollectionID;
}

export interface ListViewFieldConfig {
  visible: boolean;
  width: number;
  order: number;
}

interface ListViewConfig {
  type: 'list';
  fixedFieldCount: number;
  fieldsConfig: {
    [fieldID: string]: ListViewFieldConfig;
  };
}

export type FieldWithListViewConfig = Field & {
  config: ListViewFieldConfig;
};

export interface ListView extends BaseView, ListViewConfig {}

interface BoardViewConfig {
  type: 'board';
  stackedByFieldID: FieldID;
}

export interface BoardView extends BaseView, BoardViewConfig {}

export type View = ListView | BoardView;
export type ViewType = View['type'];

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
