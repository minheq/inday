import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Animated,
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  StyleSheet,
} from 'react-native';
import { useForceUpdate } from '../../hooks/use_force_update';
import { usePrevious } from '../../hooks/use_previous';

type HeaderHeight = number | (() => number);
type FooterHeight = number | (() => number);
type SectionHeight = number | ((section: number) => number);
type RowHeight = number | ((section: number, row?: number) => number);
type SectionFooterHeight = number | ((section: number) => number);

export const FastListItemTypes = {
  // Spacers create empty space to create illusion that the visible items are scrolled by that amount.
  Spacer: 0 as const,
  Header: 1 as const,
  Footer: 2 as const,
  Section: 3 as const,
  Row: 4 as const,
  SectionFooter: 5 as const,
};

type FastListItemType = number;

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

class FastListComputer {
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

function computeBlock(
  containerHeight: number,
  scrollTop: number,
): {
  batchSize: number;
  blockStart: number;
  blockEnd: number;
} {
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

function getFastListState(
  {
    headerHeight,
    footerHeight,
    sectionHeight,
    rowHeight,
    sectionFooterHeight,
    sections,
    insetTop,
    insetBottom,
  }: UseFastListProps,
  {
    batchSize,
    blockStart,
    blockEnd,
    items: prevItems = [],
  }: {
    batchSize: number;
    blockStart: number;
    blockEnd: number;
    items?: FastListItem[];
  },
): FastListState {
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
  footerHeight: FooterHeight;
  headerHeight: HeaderHeight;
  insetBottom: number;
  insetTop: number;
  rowHeight: RowHeight;
  scrollTopValue?: Animated.Value;
  sectionFooterHeight: SectionFooterHeight;
  sectionHeight: SectionHeight;
  sections: number[];

  onScrollEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
  renderAccessory?: () => React.ReactNode;
}

type FastListState = {
  batchSize: number;
  blockStart: number;
  blockEnd: number;
  height: number;
  items: FastListItem[];
};

function useFastList(props: UseFastListProps) {
  const { contentInset, renderAccessory, onScrollEnd, scrollTopValue } = props;
  const forceUpdate = useForceUpdate();
  const containerHeightRef = useRef(0);
  const scrollTopRef = useRef(0);
  const scrollTopValueRef = useRef(scrollTopValue || new Animated.Value(0));
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [state, setState] = useState<FastListState>(
    getFastListState(
      props,
      computeBlock(containerHeightRef.current, scrollTopRef.current),
    ),
  );
  const prevProps = usePrevious(props);

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
    if (prevProps.scrollTopValue !== props.scrollTopValue) {
      throw new Error('scrollTopValue cannot changed after mounting');
    }
  }, [prevProps, props]);

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

interface FastListInstance {
  getItems(): FastListItem[];
  isEmpty(): boolean;
  isVisible: (layoutY: number) => boolean;
  scrollToLocation: (section: number, row: number, animated: boolean) => void;
}

export interface FastListProps extends UseFastListProps {
  renderActionSheetScrollViewWrapper?: (
    wrapper: React.ReactNode,
  ) => React.ReactNode;
  actionSheetScrollRef?: { current?: React.ReactNode };
  onLayout?: (event: LayoutChangeEvent) => void;
  renderHeader: () => React.ReactElement | null;
  renderFooter: () => React.ReactElement | null;
  renderSection: (section: number) => React.ReactElement | null;
  renderRow: (section: number, row: number) => React.ReactElement | null;
  renderSectionFooter: (section: number) => React.ReactElement | null;
  renderEmpty?: () => React.ReactElement;
}

export const FastList = forwardRef<FastListInstance, FastListProps>(
  (props, ref) => {
    const {
      contentInset = { top: 0, right: 0, left: 0, bottom: 0 },
      footerHeight = 0,
      headerHeight = 0,
      insetBottom = 0,
      insetTop = 0,
      rowHeight,
      scrollTopValue,
      sectionFooterHeight = 0,
      sectionHeight = 0,
      sections,

      actionSheetScrollRef,
      renderAccessory,
      renderActionSheetScrollViewWrapper,
      renderEmpty,
      renderFooter = () => null,
      renderHeader = () => null,
      renderRow,
      renderSection = () => null,
      renderSectionFooter = () => null,
    } = props;

    const {
      containerHeightRef,
      handleLayout,
      handleScroll,
      handleScrollEnd,
      scrollTopValueRef,
      scrollTopRef,
      scrollViewRef,
      state,
    } = useFastList({
      contentInset,
      footerHeight,
      headerHeight,
      insetBottom,
      insetTop,
      rowHeight,
      scrollTopValue,
      sectionFooterHeight,
      sectionHeight,
      sections,
    });

    const { items } = state;
    const length = sections.reduce(
      (prevLength, rowLength) => prevLength + rowLength,
      0,
    );
    const empty = length === 0;

    useImperativeHandle(ref, () => ({
      getItems: () => {
        return state.items;
      },

      isVisible: (layoutY: number): boolean => {
        return (
          layoutY >= scrollTopRef.current &&
          layoutY <= scrollTopRef.current + containerHeightRef.current
        );
      },

      scrollToLocation: (
        section: number,
        row: number,
        animated: boolean = true,
      ) => {
        const scrollView = scrollViewRef.current;

        if (scrollView !== null) {
          const computer = new FastListComputer({
            headerHeight,
            footerHeight,
            sectionHeight,
            sectionFooterHeight,
            rowHeight,
            sections,
            insetTop,
            insetBottom,
          });
          const {
            scrollTop: layoutY,
            sectionHeight: layoutHeight,
          } = computer.computeScrollPosition(section, row);
          scrollView.scrollTo({
            x: 0,
            y: Math.max(0, layoutY - layoutHeight),
            animated,
          });
        }
      },

      isEmpty: () => empty,
    }));

    if (renderEmpty !== undefined && empty) {
      return renderEmpty();
    }

    const sectionLayoutYs: number[] = [];
    items.forEach(({ type, layoutY }) => {
      if (type === FastListItemTypes.Section) {
        sectionLayoutYs.push(layoutY);
      }
    });
    const children: React.ReactNode[] = [];
    items.forEach(({ type, key, layoutY, layoutHeight, section, row }) => {
      switch (type) {
        case FastListItemTypes.Spacer: {
          children.push(
            <FastListItemRenderer key={key} layoutHeight={layoutHeight} />,
          );
          break;
        }
        case FastListItemTypes.Header: {
          const child = renderHeader();
          if (child !== null) {
            children.push(
              <FastListItemRenderer key={key} layoutHeight={layoutHeight}>
                {child}
              </FastListItemRenderer>,
            );
          }
          break;
        }
        case FastListItemTypes.Footer: {
          const child = renderFooter();
          if (child !== null) {
            children.push(
              <FastListItemRenderer key={key} layoutHeight={layoutHeight}>
                {child}
              </FastListItemRenderer>,
            );
          }
          break;
        }
        case FastListItemTypes.Section: {
          sectionLayoutYs.shift();
          const child = renderSection(section);
          if (child !== null) {
            children.push(
              <FastListSectionRenderer
                key={key}
                layoutY={layoutY}
                layoutHeight={layoutHeight}
                nextSectionLayoutY={sectionLayoutYs[0]}
                scrollTopValue={scrollTopValueRef.current}
              >
                {child}
              </FastListSectionRenderer>,
            );
          }
          break;
        }
        case FastListItemTypes.Row: {
          const child = renderRow(section, row);
          if (child !== null) {
            children.push(
              <FastListItemRenderer key={key} layoutHeight={layoutHeight}>
                {child}
              </FastListItemRenderer>,
            );
          }
          break;
        }
        case FastListItemTypes.SectionFooter: {
          const child = renderSectionFooter(section);
          if (child !== null) {
            children.push(
              <FastListItemRenderer key={key} layoutHeight={layoutHeight}>
                {child}
              </FastListItemRenderer>,
            );
          }
          break;
        }
      }
    });

    // in order to support continuous scrolling of a scrollview/list/whatever in an action sheet, we need
    // to wrap the scrollview in a NativeViewGestureHandler. This wrapper does that thing that need do
    const wrapper = renderActionSheetScrollViewWrapper || ((val) => val);
    const scrollView = wrapper(
      <Animated.ScrollView
        contentInset={contentInset}
        // @ts-ignore no types
        ref={(ref) => {
          scrollViewRef.current = ref;
          if (actionSheetScrollRef) {
            actionSheetScrollRef.current = ref;
          }
        }}
        removeClippedSubviews={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y: scrollTopValueRef.current } },
            },
          ],
          { listener: handleScroll, useNativeDriver: true },
        )}
        onLayout={handleLayout}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
      >
        {children}
      </Animated.ScrollView>,
    );

    return (
      <React.Fragment>
        {scrollView}
        {renderAccessory !== undefined ? renderAccessory() : null}
      </React.Fragment>
    );
  },
);

function FastListItemRenderer({
  layoutHeight: height,
  children,
}: {
  layoutHeight: number;
  children?: React.ReactNode;
}): React.ReactElement {
  return <View style={{ height }}>{children}</View>;
}

function FastListSectionRenderer({
  layoutY,
  layoutHeight,
  nextSectionLayoutY,
  scrollTopValue,
  children,
}: {
  layoutY: number;
  layoutHeight: number;
  nextSectionLayoutY?: number;
  scrollTopValue: Animated.Value;
  children: React.ReactNode;
}): React.ReactElement {
  const inputRange: number[] = [-1, 0];
  const outputRange: number[] = [0, 0];

  inputRange.push(layoutY);
  outputRange.push(0);
  const collisionPoint = (nextSectionLayoutY || 0) - layoutHeight;
  if (collisionPoint >= layoutY) {
    inputRange.push(collisionPoint, collisionPoint + 1);
    outputRange.push(collisionPoint - layoutY, collisionPoint - layoutY);
  } else {
    inputRange.push(layoutY + 1);
    outputRange.push(1);
  }

  const translateY = scrollTopValue.interpolate({
    inputRange,
    outputRange,
  });

  const child = React.Children.only(children);

  return (
    <Animated.View
      style={[
        React.isValidElement(child) && child.props.style
          ? child.props.style
          : undefined,
        styles.section,
        {
          height: layoutHeight,
          transform: [{ translateY }],
        },
      ]}
    >
      {React.isValidElement(child) &&
        React.cloneElement(child, {
          style: { flex: 1 },
        })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: {
    zIndex: 10,
  },
});
