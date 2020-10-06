import React, { forwardRef, useImperativeHandle } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

import { FastListItemTypes, useFastList } from '../lib/fast_list';

interface FastGridInstance {
  scrollToLocation: (section: number, row: number, animated: boolean) => void;
}

export interface FastGridProps {
  renderSection?: (section: number) => React.ReactElement | null;
  renderCell: (
    section: number,
    row: number,
    column: number,
  ) => React.ReactElement | null;
  renderEmpty?: () => React.ReactElement;
  rowHeight: number;
  scrollTopValue?: Animated.Value;
  sectionHeight?: number;
  sections: number[];
  /** Length of the array determines number of columns. Array values correspond to their width. */
  columns: number[];
  frozenColumns: number;
}

export const FastGrid = forwardRef<FastGridInstance, FastGridProps>(
  function FastGrid(props, ref) {
    const {
      rowHeight,
      scrollTopValue,
      sectionHeight = 0,
      sections,

      columns,
      frozenColumns,
      renderEmpty,
      renderSection = () => null,
      renderCell,
    } = props;

    const {
      handleLayout,
      handleScroll,
      handleScrollEnd,
      scrollTopValueRef,
      scrollViewRef,
      items,

      getItems,
      isVisible,
      scrollToLocation,
      isEmpty,
    } = useFastList({
      rowHeight,
      scrollTopValue,
      sectionHeight,
      sections,
      contentInset: {},
      footerHeight: 0,
      headerHeight: 0,
      insetBottom: 0,
      insetTop: 0,
      sectionFooterHeight: 0,
    });

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

    const frozenNodes: React.ReactNode[] = [];
    const scrollableNodes: React.ReactNode[] = [];

    items.forEach(({ type, key, layoutY, layoutHeight, section, row }) => {
      switch (type) {
        case FastListItemTypes.Spacer: {
          const s = <FastRowRenderer key={key} layoutHeight={layoutHeight} />;

          frozenNodes.push(s);
          scrollableNodes.push(s);
          break;
        }
        case FastListItemTypes.Section: {
          sectionLayoutYs.shift();
          const child = renderSection(section);
          if (child !== null) {
            const s = (
              <FastListSectionRenderer
                key={key}
                layoutY={layoutY}
                layoutHeight={layoutHeight}
                nextSectionLayoutY={sectionLayoutYs[0]}
                scrollTopValue={scrollTopValueRef.current}
              >
                {child}
              </FastListSectionRenderer>
            );

            frozenNodes.push(s);
            scrollableNodes.push(s);
          }
          break;
        }
        case FastListItemTypes.Row: {
          const frozenCells: React.ReactNode[] = [];
          const scrollableCells: React.ReactNode[] = [];

          for (let col = 0; col < columns.length; col++) {
            const layoutWidth = columns[col];

            if (col < frozenColumns) {
              const child = renderCell(section, row, col);
              if (child !== null) {
                frozenCells.push(
                  <FastCellRenderer
                    layoutWidth={layoutWidth}
                    key={`${key}-${col}`}
                  >
                    {child}
                  </FastCellRenderer>,
                );
              }
            } else {
              const child = renderCell(section, row, col);
              if (child !== null) {
                scrollableCells.push(
                  <FastCellRenderer
                    layoutWidth={layoutWidth}
                    key={`${key}-${col}`}
                  >
                    {child}
                  </FastCellRenderer>,
                );
              }
            }
          }

          frozenNodes.push(
            <FastRowRenderer key={key} layoutHeight={layoutHeight}>
              {frozenCells}
            </FastRowRenderer>,
          );

          scrollableNodes.push(
            <FastRowRenderer key={key} layoutHeight={layoutHeight}>
              {scrollableCells}
            </FastRowRenderer>,
          );
          break;
        }
      }
    });

    const frozenColumnsWidth = columns
      .slice(0, frozenColumns)
      .reduce((val, col) => val + col, 0);

    const scrollableColumnsWidth = columns
      .slice(frozenColumns)
      .reduce((val, col) => val + col, 0);

    return (
      <Animated.ScrollView
        // @ts-ignore no types
        ref={scrollViewRef}
        removeClippedSubviews={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { y: scrollTopValueRef.current },
              },
            },
          ],
          { listener: handleScroll, useNativeDriver: true },
        )}
        onLayout={handleLayout}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        // contentContainerStyle={{ height: '100%' }}
      >
        <View style={styles.wrapper}>
          <View
            style={[styles.frozenCellsWrapper, { width: frozenColumnsWidth }]}
          >
            {frozenNodes}
          </View>
          <View style={styles.scrollableCellsWrapper}>
            <Animated.ScrollView horizontal scrollEventThrottle={16}>
              <View
                style={[
                  styles.scrollableCellsContentWrapper,
                  { width: scrollableColumnsWidth },
                ]}
              >
                {scrollableNodes}
              </View>
            </Animated.ScrollView>
          </View>
        </View>
      </Animated.ScrollView>
    );
  },
);

function FastRowRenderer({
  layoutHeight: height,
  children,
}: {
  layoutHeight: number;
  children?: React.ReactNode;
}): React.ReactElement {
  return <View style={[{ height }, styles.row]}>{children}</View>;
}

function FastCellRenderer({
  layoutWidth: width,
  children,
}: {
  layoutWidth: number;
  children: React.ReactNode;
}): React.ReactElement {
  return <View style={[{ width }]}>{children}</View>;
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
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'pink',
  },
  frozenCellsWrapper: {},
  scrollableCellsWrapper: {
    flex: 1,
  },
  scrollableCellsContentWrapper: {},
  row: {
    flexDirection: 'row',
  },
});
