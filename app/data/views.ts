import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey } from './constants';
import { view1, view2 } from './fake_data';
import { FieldType } from './constants';
import { FieldID } from './fields';

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

type SingleSelectFilterCondition =
  | 'is'
  | 'is_not'
  | 'is_any_of'
  | 'is_none_of'
  | 'is_empty'
  | 'is_not_empty';

interface SingleSelectFilterValue {
  type: FieldType.SingleSelect;
  condition: SingleSelectFilterCondition;
  value: string;
}

type MultiSelectFilterCondition =
  | 'has_any_of'
  | 'has_all_of'
  | 'is_exactly'
  | 'has_none_of'
  | 'is_empty'
  | 'is_not_empty';

interface MultiSelectFilterValue {
  type: FieldType.MultiSelect;
  condition: MultiSelectFilterCondition;
  value: string[];
}

interface SingleCollaboratorFilterValue {
  type: FieldType.SingleCollaborator;
  condition: SingleSelectFilterCondition;
  value: string;
}

interface MultiCollaboratorFilterValue {
  type: FieldType.MultiCollaborator;
  condition: MultiSelectFilterCondition;
  value: string[];
}

type DocumentLinkFilterCondition =
  | 'contains'
  | 'does_not_contain'
  | 'is_empty'
  | 'is_not_empty';

interface SingleDocumentLinkFilterValue {
  type: FieldType.SingleDocumentLink;
  condition: DocumentLinkFilterCondition;
  value: string;
}

interface MultiDocumentLinkFilterValue {
  type: FieldType.MultiDocumentLink;
  condition: DocumentLinkFilterCondition;
  value: string;
}

type DateFilterCondition =
  | 'is'
  | 'is_within'
  | 'is_before'
  | 'is_after'
  | 'is_on_or_before'
  | 'is_on_or_after'
  | 'is_not'
  | 'is_empty'
  | 'is_not_empty';

interface DateFilterValue {
  type: FieldType.Date;
  condition: DateFilterCondition;
  value: Date;
}

interface PhoneNumberFilterValue {
  type: FieldType.PhoneNumber;
  condition: TextFilterCondition;
  value: string;
}

interface EmailFilterValue {
  type: FieldType.Email;
  condition: TextFilterCondition;
  value: string;
}

interface URLFilterValue {
  type: FieldType.URL;
  condition: TextFilterCondition;
  value: string;
}

type NumberFilterCondition =
  | 'equal'
  | 'not_equal'
  | 'less_than'
  | 'greater_than'
  | 'less_than_or_equal'
  | 'greater_than_or_equal'
  | 'is_empty'
  | 'is_not_empty';

interface NumberFilterValue {
  type: FieldType.Number;
  condition: NumberFilterCondition;
  value: number;
}

interface CurrencyFilterValue {
  type: FieldType.Currency;
  condition: NumberFilterCondition;
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

export type ViewID = string;

interface BaseView {
  id: ViewID;
  name: string;
  filters: Filter[];
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
}

export interface BoardView extends BaseView, BoardViewConfig {}

export type View = ListView | BoardView;
export type ViewType = View['type'];

export type ViewsState = { [viewID: string]: View | undefined };
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
