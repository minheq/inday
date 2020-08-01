import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey } from './constants';
import { view1, view2 } from './fake_data';
import { FieldType } from './fields';

type TextFilterCondition =
  | 'contains'
  | 'does_not_contain'
  | 'is'
  | 'is_not'
  | 'is_empty'
  | 'is_not_empty';

interface SingleLineTextFilterValue {
  type: FieldType.SingleLineText;
  condition: TextFilterCondition;
  value: string;
}

interface MultiLineTextFilterValue {
  type: FieldType.MultiLineText;
  condition: TextFilterCondition;
  value: string;
}

interface SingleSelectFilterValue {
  type: FieldType.SingleSelect;
  value: string;
}

interface MultiSelectFilterValue {
  type: FieldType.MultiSelect;
  value: string[];
}

interface CollaboratorValue {
  id: string;
  email: string;
  name: string;
}

interface SingleCollaboratorFilterValue {
  type: FieldType.SingleCollaborator;
  value: CollaboratorValue;
}

interface MultiCollaboratorFilterValue {
  type: FieldType.MultiCollaborator;
  value: CollaboratorValue[];
}

interface DocumentLinkValue {
  id: string;
  email: string;
  name: string;
}

interface SingleDocumentLinkFilterValue {
  type: FieldType.SingleDocumentLink;
  value: DocumentLinkValue;
}

interface MultiDocumentLinkFilterValue {
  type: FieldType.MultiDocumentLink;
  value: DocumentLinkValue[];
}

interface DateFilterValue {
  type: FieldType.Date;
  value: Date;
}

interface PhoneNumberFilterValue {
  type: FieldType.PhoneNumber;
  value: string;
}

interface EmailFilterValue {
  type: FieldType.Email;
  value: string;
}

interface URLFilterValue {
  type: FieldType.URL;
  value: string;
}

interface NumberFilterValue {
  type: FieldType.Number;
  value: number;
}

interface CurrencyFilterValue {
  type: FieldType.Currency;
  value: {
    amount: number;
    currency: string;
  };
}

interface CheckboxFilterValue {
  type: FieldType.Checkbox;
  value: boolean;
}

type FilterValue =
  | SingleLineTextFilterValue
  | MultiLineTextFilterValue
  | SingleSelectFilterValue
  | MultiSelectFilterValue
  | SingleCollaboratorFilterValue
  | MultiCollaboratorFilterValue
  | SingleDocumentLinkFilterValue
  | MultiDocumentLinkFilterValue
  | DateFilterValue
  | PhoneNumberFilterValue
  | EmailFilterValue
  | URLFilterValue
  | NumberFilterValue
  | CurrencyFilterValue
  | CheckboxFilterValue;

interface Filter {
  fieldID: string;
  value: FilterValue;
}

interface BaseView {
  id: string;
  name: string;
  filterList: Filter[];
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
  fieldsOrder: string[];
  fieldsConfig: {
    [fieldID: string]: ListViewFieldConfig;
  };
}

export interface ListView extends BaseView, ListViewConfig {}

interface BoardViewConfig {
  type: 'board';
}

export interface BoardView extends BaseView, BoardViewConfig {}

export type View = ListView | BoardView;
export type ViewType = View['type'];

export type ViewsState = { [id: string]: View | undefined };
export const viewsState = atom<ViewsState>({
  key: RecoilKey.Views,
  default: {
    [view1.id]: view1,
    [view2.id]: view2,
  },
});

export const viewListQuery = selector({
  key: RecoilKey.ViewList,
  get: ({ get }) => {
    const views = get(viewsState);

    return Object.values(views) as View[];
  },
});

export const viewQuery = selectorFamily<View | null, string>({
  key: RecoilKey.View,
  get: (viewID: string) => ({ get }) => {
    const views = get(viewsState);
    const view = views[viewID];

    if (view === undefined) {
      return null;
    }

    return view;
  },
});
