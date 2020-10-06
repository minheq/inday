import {
  FastListItem,
  FastListItemType,
  FastListItemTypes,
} from './fast_list_item';

/**
 * FastListItemRecycler is used to recycle FastListItem objects between recomputations
 * of the list. By doing this we ensure that components maintain their keys and avoid
 * mounting/unmounting of components -- which is expensive.
 */
export class FastListItemRecycler {
  static _LAST_KEY: number = 0;

  _items: { [type: number]: { [key: string]: FastListItem } } = {};
  _pendingItems: { [type: number]: FastListItem[] } = {};

  constructor(items: FastListItem[]) {
    items.forEach((item) => {
      const { type, section, row } = item;
      const [subItems] = this._itemsForType(type);
      subItems[`${type}:${section}:${row}`] = item;
    });
  }

  _itemsForType(
    type: FastListItemType,
  ): [{ [key: string]: FastListItem }, FastListItem[]] {
    return [
      this._items[type] || (this._items[type] = {}),
      this._pendingItems[type] || (this._pendingItems[type] = []),
    ];
  }

  get(
    type: FastListItemType,
    layoutY: number,
    layoutHeight: number,
    section: number = 0,
    row: number = 0,
  ): FastListItem {
    const [items, pendingItems] = this._itemsForType(type);
    return this._get(
      type,
      layoutY,
      layoutHeight,
      section,
      row,
      items,
      pendingItems,
    );
  }

  _get(
    type: FastListItemType,
    layoutY: number,
    layoutHeight: number,
    section: number,
    row: number,
    items: { [key: string]: FastListItem },
    pendingItems: FastListItem[],
  ) {
    const itemKey = `${type}:${section}:${row}`;
    let item = items[itemKey];
    if (item == null) {
      item = { type, key: -1, layoutY, layoutHeight, section, row };
      pendingItems.push(item);
    } else {
      item.layoutY = layoutY;
      item.layoutHeight = layoutHeight;
      delete items[itemKey];
    }
    return item;
  }

  fill() {
    Object.values(FastListItemTypes).forEach((type) => {
      const [items, pendingItems] = this._itemsForType(type);
      this._fill(items, pendingItems);
    });
  }

  _fill(items: { [key: string]: FastListItem }, pendingItems: FastListItem[]) {
    let index = 0;

    Object.values(items).forEach(({ key }) => {
      const item = pendingItems[index];
      if (item == null) {
        return false;
      }
      item.key = key;
      index++;
    });

    for (; index < pendingItems.length; index++) {
      pendingItems[index].key = ++FastListItemRecycler._LAST_KEY;
    }

    pendingItems.length = 0;
  }
}
