import { atom, selector } from 'recoil';
import { RecoilKey } from './constants';
import { Tag, tagListQuery } from './tag';

export type MenuState = {
  tagIDs: { [tagID: string]: { expanded: boolean } | undefined };
};

export const menuState = atom<MenuState>({
  key: RecoilKey.Menu,
  default: {
    tagIDs: {},
  },
});

export interface MenuTag {
  tag: Tag;
  children: MenuTag[];
  expanded: boolean;
}

export const menuTagsQuery = selector<MenuTag[]>({
  key: RecoilKey.MenuTags,
  get: ({ get }) => {
    const menu = get(menuState);
    const tagList = get(tagListQuery);

    return buildMenuTags(tagList, menu);
  },
});

export function buildMenuTags(tagList: Tag[], menu: MenuState): MenuTag[] {
  function buildChildren(parentTagID: string | null): MenuTag[] {
    const childTags = tagList.filter((tag) => tag.parentTagID === parentTagID);

    return childTags
      .map((tag) => ({
        tag,
        children: buildChildren(tag.id),
        expanded: menu.tagIDs[tag.id]?.expanded || false,
      }))
      .sort((tagA, tagB) => {
        if (tagA.tag.name < tagB.tag.name) {
          return -1;
        }

        if (tagA.tag.name > tagB.tag.name) {
          return 1;
        }

        return 0;
      });
  }

  return buildChildren(null);
}
