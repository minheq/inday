import React, { forwardRef, useImperativeHandle } from 'react';
import {
  Animated,
  View,
  LayoutChangeEvent,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
} from 'react-native';
import { useForceUpdate } from '../../hooks/use_force_update';
import { usePrevious } from '../../hooks/use_previous';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  HeaderHeight,
  FooterHeight,
  SectionHeight,
  RowHeight,
  SectionFooterHeight,
  FastListComputer,
  computeBlock,
  Block,
} from './fast_list_computer';
import { FastListItem, FastListItemTypes } from './fast_list_item';

interface FastListInstance {
  getItems(): FastListItem[];
  isEmpty(): boolean;
  isVisible: (layoutY: number) => boolean;
  scrollToLocation: (section: number, row: number, animated: boolean) => void;
}

export interface FastListProps {
  renderActionSheetScrollViewWrapper?: (
    wrapper: React.ReactNode,
  ) => React.ReactNode;
  actionSheetScrollRef?: { current?: React.ReactNode };
  renderHeader?: () => React.ReactElement | null;
  renderFooter?: () => React.ReactElement | null;
  renderSection?: (section: number) => React.ReactElement | null;
  renderRow: (section: number, row: number) => React.ReactElement | null;
  renderSectionFooter?: (section: number) => React.ReactElement | null;
  renderEmpty?: () => React.ReactElement;

  contentInset?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  onScrollEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
  renderAccessory?: () => React.ReactNode;

  footerHeight?: FooterHeight;
  headerHeight?: HeaderHeight;
  insetBottom?: number;
  insetTop?: number;
  rowHeight: RowHeight;
  scrollTopValue?: Animated.Value;
  sectionFooterHeight?: SectionFooterHeight;
  sectionHeight?: SectionHeight;
  sections: number[];
}

export const FastList = forwardRef<FastListInstance, FastListProps>(
  function FastList(props, ref) {
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
      handleLayout,
      handleScroll,
      handleScrollEnd,
      scrollTopValueRef,
      scrollViewRef,
      state,

      getItems,
      isVisible,
      scrollToLocation,
      isEmpty,
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

    useImperativeHandle(
      ref,
      () => ({
        getItems,
        isVisible,
        scrollToLocation,
        isEmpty,
      }),
      [getItems, isVisible, scrollToLocation, isEmpty],
    );

    if (renderEmpty !== undefined && isEmpty()) {
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
  const {
    contentInset,
    renderAccessory,
    onScrollEnd,
    scrollTopValue,
    sectionFooterHeight,
    sectionHeight,
    sections,
    headerHeight,
    rowHeight,
    footerHeight,
    insetTop,
    insetBottom,
  } = props;
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

  const length = sections.reduce(
    (prevLength, rowLength) => prevLength + rowLength,
    0,
  );
  const empty = length === 0;

  const getItems = useCallback(() => {
    return state.items;
  }, [state.items]);

  const isVisible = useCallback(
    (layoutY: number): boolean => {
      return (
        layoutY >= scrollTopRef.current &&
        layoutY <= scrollTopRef.current + containerHeightRef.current
      );
    },
    [scrollTopRef],
  );

  const scrollToLocation = useCallback(
    (section: number, row: number, animated: boolean = true) => {
      const scrollView = scrollViewRef.current;

      if (scrollView !== null) {
        const computer = new FastListComputer({
          footerHeight,
          headerHeight,
          insetBottom,
          insetTop,
          rowHeight,
          sectionFooterHeight,
          sectionHeight,
          sections,
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
    [
      footerHeight,
      headerHeight,
      insetBottom,
      insetTop,
      rowHeight,
      sectionFooterHeight,
      sectionHeight,
      sections,
    ],
  );

  const isEmpty = useCallback(() => empty, [empty]);

  return {
    handleLayout,
    handleScroll,
    handleScrollEnd,
    scrollTopValueRef,
    scrollViewRef,
    state,

    getItems,
    isVisible,
    scrollToLocation,
    isEmpty,
  };
}
