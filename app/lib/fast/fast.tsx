import { useForceUpdate } from '../../hooks/use_force_update';
import { usePrevious } from '../../hooks/use_previous';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  Animated,
  ScrollView,
} from 'react-native';

export type HeaderHeight = number | (() => number);
export type FooterHeight = number | (() => number);
export type SectionHeight = number | ((section: number) => number);
export type RowHeight = number | ((section: number, row?: number) => number);
export type SectionFooterHeight = number | ((section: number) => number);

export const FastListItemTypes = {
  // Spacers create empty space to create illusion that the visible items are scrolled by that amount.
  Spacer: 0,
  Header: 1,
  Footer: 2,
  Section: 3,
  Row: 4,
  SectionFooter: 5,
};

export type FastListItemType = number;

export type FastListItem = {
  type: FastListItemType;
  key: number;
  layoutY: number;
  layoutHeight: number;
  section: number;
  row: number;
};

/**
 * FastListItemRecycler is used to recycle FastListItem objects between recomputations
 * of the list. By doing this we ensure that components maintain their keys and avoid
 * mounting/unmounting of components -- which is expensive.
 */
class FastListItemRecycler {
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

type FastListComputerProps = {
  headerHeight: HeaderHeight;
  footerHeight: FooterHeight;
  sectionHeight: SectionHeight;
  rowHeight: RowHeight;
  sectionFooterHeight: SectionFooterHeight;
  sections: number[];
  insetTop: number;
  insetBottom: number;
};

export class FastListComputer {
  headerHeight: HeaderHeight;
  footerHeight: FooterHeight;
  sectionHeight: SectionHeight;
  rowHeight: RowHeight;
  sectionFooterHeight: SectionFooterHeight;
  sections: number[];
  insetTop: number;
  insetBottom: number;
  // When true, all rows are equal height
  uniform: boolean;

  constructor({
    headerHeight,
    footerHeight,
    sectionHeight,
    rowHeight,
    sectionFooterHeight,
    sections,
    insetTop,
    insetBottom,
  }: FastListComputerProps) {
    this.headerHeight = headerHeight;
    this.footerHeight = footerHeight;
    this.sectionHeight = sectionHeight;
    this.rowHeight = rowHeight;
    this.sectionFooterHeight = sectionFooterHeight;
    this.sections = sections;
    this.insetTop = insetTop;
    this.insetBottom = insetBottom;
    this.uniform = typeof rowHeight === 'number';
  }

  getHeightForHeader(): number {
    const { headerHeight } = this;
    return typeof headerHeight === 'number' ? headerHeight : headerHeight();
  }

  getHeightForFooter(): number {
    const { footerHeight } = this;
    return typeof footerHeight === 'number' ? footerHeight : footerHeight();
  }

  getHeightForSection(section: number): number {
    const { sectionHeight } = this;
    return typeof sectionHeight === 'number'
      ? sectionHeight
      : sectionHeight(section);
  }

  getHeightForRow(section: number, row?: number): number {
    const { rowHeight } = this;
    return typeof rowHeight === 'number' ? rowHeight : rowHeight(section, row);
  }

  getHeightForSectionFooter(section: number): number {
    const { sectionFooterHeight } = this;
    return typeof sectionFooterHeight === 'number'
      ? sectionFooterHeight
      : sectionFooterHeight(section);
  }

  compute(
    top: number,
    bottom: number,
    prevItems: FastListItem[],
  ): {
    height: number;
    items: FastListItem[];
  } {
    const { sections } = this;

    let height = this.insetTop;
    let spacerHeight = height;
    let items: FastListItem[] = [];

    const recycler = new FastListItemRecycler(prevItems);

    function isVisible(itemHeight: number): boolean {
      const prevHeight = height;
      height += itemHeight;
      if (height < top || prevHeight > bottom) {
        spacerHeight += itemHeight;
        return false;
      } else {
        return true;
      }
    }

    function isBelowVisibility(itemHeight: number): boolean {
      if (height > bottom) {
        spacerHeight += itemHeight;
        return false;
      } else {
        return true;
      }
    }

    function push(item: FastListItem) {
      if (spacerHeight > 0) {
        items.push(
          recycler.get(
            FastListItemTypes.Spacer,
            item.layoutY - spacerHeight,
            spacerHeight,
            item.section,
            item.row,
          ),
        );
        spacerHeight = 0;
      }

      items.push(item);
    }

    let layoutY;

    const headerHeight = this.getHeightForHeader();
    if (headerHeight > 0) {
      layoutY = height;
      if (isVisible(headerHeight)) {
        push(recycler.get(FastListItemTypes.Header, layoutY, headerHeight));
      }
    }

    for (let section = 0; section < sections.length; section++) {
      const rows = sections[section];

      if (rows === 0) {
        continue;
      }

      const sectionHeight = this.getHeightForSection(section);
      layoutY = height;
      height += sectionHeight;

      // Replace previous spacers and sections, so we only render section headers
      // whose children are visible + previous section (required for sticky header animation).
      if (
        section > 1 &&
        items.length > 0 &&
        items[items.length - 1].type === FastListItemTypes.Section
      ) {
        const spacerLayoutHeight = items.reduce((totalHeight, item, i) => {
          if (i !== items.length - 1) {
            return totalHeight + item.layoutHeight;
          }
          return totalHeight;
        }, 0);
        const prevSection = items[items.length - 1];
        const spacer = recycler.get(
          FastListItemTypes.Spacer,
          0,
          spacerLayoutHeight,
          prevSection.section,
          0,
        );

        items = [spacer, prevSection];
      }

      if (isBelowVisibility(sectionHeight)) {
        push(
          recycler.get(
            FastListItemTypes.Section,
            layoutY,
            sectionHeight,
            section,
          ),
        );
      }

      if (this.uniform) {
        const rowHeight = this.getHeightForRow(section);
        for (let row = 0; row < rows; row++) {
          layoutY = height;
          if (isVisible(rowHeight)) {
            push(
              recycler.get(
                FastListItemTypes.Row,
                layoutY,
                rowHeight,
                section,
                row,
              ),
            );
          }
        }
      } else {
        for (let row = 0; row < rows; row++) {
          const rowHeight = this.getHeightForRow(section, row);
          layoutY = height;
          if (isVisible(rowHeight)) {
            push(
              recycler.get(
                FastListItemTypes.Row,
                layoutY,
                rowHeight,
                section,
                row,
              ),
            );
          }
        }
      }

      const sectionFooterHeight = this.getHeightForSectionFooter(section);
      if (sectionFooterHeight > 0) {
        layoutY = height;
        if (isVisible(sectionFooterHeight)) {
          push(
            recycler.get(
              FastListItemTypes.SectionFooter,
              layoutY,
              sectionFooterHeight,
              section,
            ),
          );
        }
      }
    }

    const footerHeight = this.getHeightForFooter();
    if (footerHeight > 0) {
      layoutY = height;
      if (isVisible(footerHeight)) {
        push(recycler.get(FastListItemTypes.Footer, layoutY, footerHeight));
      }
    }

    height += this.insetBottom;
    spacerHeight += this.insetBottom;

    if (spacerHeight > 0) {
      items.push(
        recycler.get(
          FastListItemTypes.Spacer,
          height - spacerHeight,
          spacerHeight,
          sections.length,
        ),
      );
    }

    recycler.fill();

    return {
      height,
      items,
    };
  }

  computeScrollPosition(
    targetSection: number,
    targetRow: number,
  ): {
    scrollTop: number;
    sectionHeight: number;
  } {
    const { sections, insetTop } = this;
    let scrollTop = insetTop + this.getHeightForHeader();
    let section = 0;
    let foundRow = false;

    while (section <= targetSection) {
      const rows = sections[section];
      if (rows === 0) {
        section += 1;
        continue;
      }
      scrollTop += this.getHeightForSection(section);
      if (this.uniform) {
        const uniformHeight = this.getHeightForRow(section);
        if (section === targetSection) {
          scrollTop += uniformHeight * targetRow;
          foundRow = true;
        } else {
          scrollTop += uniformHeight * rows;
        }
      } else {
        for (let row = 0; row < rows; row++) {
          if (
            section < targetSection ||
            (section === targetSection && row < targetRow)
          ) {
            scrollTop += this.getHeightForRow(section, row);
          } else if (section === targetSection && row === targetRow) {
            foundRow = true;
            break;
          }
        }
      }
      if (!foundRow) {
        scrollTop += this.getHeightForSectionFooter(section);
      }
      section += 1;
    }

    return {
      scrollTop,
      sectionHeight: this.getHeightForSection(targetSection),
    };
  }
}

interface Block {
  batchSize: number;
  blockStart: number;
  blockEnd: number;
}

function computeBlock(containerHeight: number, scrollTop: number): Block {
  if (containerHeight === 0) {
    return {
      batchSize: 0,
      blockStart: 0,
      blockEnd: 0,
    };
  }
  const batchSize = Math.ceil(containerHeight / 2);
  const blockNumber = Math.ceil(scrollTop / batchSize);
  const blockStart = batchSize * blockNumber;
  const blockEnd = blockStart + batchSize;

  return { batchSize, blockStart, blockEnd };
}

interface GetFastListStateParams {
  footerHeight: FooterHeight;
  headerHeight: HeaderHeight;
  insetBottom: number;
  insetTop: number;
  rowHeight: RowHeight;
  scrollTopValue?: Animated.Value;
  sectionFooterHeight: SectionFooterHeight;
  sectionHeight: SectionHeight;
  sections: number[];
}

interface BlockWithItems extends Block {
  items?: FastListItem[];
}

function getFastListState(
  params: GetFastListStateParams,
  blockWithItems: BlockWithItems,
): FastListState {
  const {
    headerHeight,
    footerHeight,
    sectionHeight,
    rowHeight,
    sectionFooterHeight,
    sections,
    insetTop,
    insetBottom,
  } = params;
  const {
    batchSize,
    blockStart,
    blockEnd,
    items: prevItems = [],
  } = blockWithItems;

  if (batchSize === 0) {
    return {
      batchSize,
      blockStart,
      blockEnd,
      height: insetTop + insetBottom,
      items: [],
    };
  }

  const computer = new FastListComputer({
    headerHeight,
    footerHeight,
    sectionHeight,
    rowHeight,
    sectionFooterHeight,
    sections,
    insetTop,
    insetBottom,
  });

  return {
    batchSize,
    blockStart,
    blockEnd,
    ...computer.compute(
      blockStart - batchSize,
      blockEnd + batchSize,
      prevItems,
    ),
  };
}

interface UseFastListProps {
  contentInset: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  onScrollEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
  renderAccessory?: () => React.ReactNode;

  footerHeight: FooterHeight;
  headerHeight: HeaderHeight;
  insetBottom: number;
  insetTop: number;
  rowHeight: RowHeight;
  scrollTopValue?: Animated.Value;
  sectionFooterHeight: SectionFooterHeight;
  sectionHeight: SectionHeight;
  sections: number[];
}

interface FastListState extends Block {
  height: number;
  items: FastListItem[];
}

export function useFastList(props: UseFastListProps) {
  const { contentInset, renderAccessory, onScrollEnd, scrollTopValue } = props;
  const forceUpdate = useForceUpdate();
  const containerHeightRef = useRef<number>(0);
  const scrollTopRef = useRef<number>(0);
  const scrollTopValueRef = useRef<Animated.Value>(
    scrollTopValue || new Animated.Value(0),
  );
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [state, setState] = useState<FastListState>(
    getFastListState(
      props,
      computeBlock(containerHeightRef.current, scrollTopRef.current),
    ),
  );
  const prevScrollTopValue = usePrevious(props.scrollTopValue);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { nativeEvent } = event;

      containerHeightRef.current =
        nativeEvent.layoutMeasurement.height -
        (contentInset.top || 0) -
        (contentInset.bottom || 0);

      scrollTopRef.current = Math.min(
        Math.max(0, nativeEvent.contentOffset.y),
        nativeEvent.contentSize.height - containerHeightRef.current,
      );

      const nextBlock = computeBlock(
        containerHeightRef.current,
        scrollTopRef.current,
      );

      if (
        nextBlock.batchSize !== state.batchSize ||
        nextBlock.blockStart !== state.blockStart ||
        nextBlock.blockEnd !== state.blockEnd
      ) {
        const nextState = getFastListState(props, {
          ...state,
          batchSize: nextBlock.batchSize,
          blockStart: nextBlock.blockStart,
          blockEnd: nextBlock.blockEnd,
        });

        setState(nextState);
      }
    },
    [state, props, contentInset],
  );

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { nativeEvent } = event;

      containerHeightRef.current =
        nativeEvent.layout.height -
        (contentInset.top || 0) -
        (contentInset.bottom || 0);

      const nextBlock = computeBlock(
        containerHeightRef.current,
        scrollTopRef.current,
      );

      if (
        nextBlock.batchSize !== state.batchSize ||
        nextBlock.blockStart !== state.blockStart ||
        nextBlock.blockEnd !== state.blockEnd
      ) {
        const nextState = getFastListState(props, {
          ...state,
          batchSize: nextBlock.batchSize,
          blockStart: nextBlock.blockStart,
          blockEnd: nextBlock.blockEnd,
        });

        setState(nextState);
      }
    },
    [state, props, contentInset],
  );

  /**
   * FastList only re-renders when items change which which does not happen with
   * every scroll event. Since an accessory might depend on scroll position this
   * ensures the accessory at least re-renders when scrolling ends
   */
  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (renderAccessory !== null) {
        forceUpdate();
      }

      if (onScrollEnd) {
        onScrollEnd(event);
      }
    },
    [renderAccessory, forceUpdate, onScrollEnd],
  );

  useEffect(() => {
    if (prevScrollTopValue !== scrollTopValue) {
      throw new Error('scrollTopValue cannot changed after mounting');
    }
  }, [prevScrollTopValue, scrollTopValue]);

  return {
    containerHeightRef,
    handleLayout,
    handleScroll,
    handleScrollEnd,
    scrollTopValueRef,
    scrollViewRef,
    scrollTopRef,
    state,
  };
}
