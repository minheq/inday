import { atom, selectorFamily, selector } from 'recoil';

import { RecoilKey } from './constants';

interface BaseView {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  collectionID: string;
}

interface ListView extends BaseView {
  type: 'list';
}

interface BoardView extends BaseView {
  type: 'board';
}

export type View = ListView | BoardView;
export type ViewType = View['type'];

export type ViewsState = { [id: string]: View | undefined };
export const viewsState = atom<ViewsState>({
  key: RecoilKey.Views,
  default: {},
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
