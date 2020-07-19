import { atom, selectorFamily, selector } from 'recoil';
import { RecoilKey } from './constants';

export interface Tag {
  id: string;
  name: string;
  workspaceID: string;
  parentTagID: string | null;
  typename: 'Tag';
}

export type TagsState = { [id: string]: Tag | undefined };
export const tagsState = atom<TagsState>({
  key: RecoilKey.Tags,
  default: {},
});

export const tagQuery = selectorFamily<Tag | null, string>({
  key: RecoilKey.Tag,
  get: (tagID: string) => ({ get }) => {
    const tags = get(tagsState);
    const tag = tags[tagID];

    if (tag === undefined) {
      return null;
    }

    return tag;
  },
});

export const tagListQuery = selector({
  key: RecoilKey.Tag,
  get: ({ get }) => {
    const tags = get(tagsState);

    return Object.values(tags) as Tag[];
  },
});
