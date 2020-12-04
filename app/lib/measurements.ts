import React from 'react';
import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

export interface ScrollViewState {
  contentHeight: number;
  height: number;
  offsetY: number;
}

export function useScrollViewState() {
  const scrollViewState = React.useRef<ScrollViewState>({
    contentHeight: 0,
    height: 0,
    offsetY: 0,
  }).current;

  const handleScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollViewState.offsetY = event.nativeEvent.contentOffset.y;
    },
    [scrollViewState],
  );

  const handleScrollEndDrag = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollViewState.offsetY = event.nativeEvent.contentOffset.y;
    },
    [scrollViewState],
  );

  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      scrollViewState.height = event.nativeEvent.layout.height;
      // TODO: Handle device rotation
    },
    [scrollViewState],
  );

  const handleContentSizeChange = React.useCallback(
    (contentWidth: number, contentHeight: number) => {
      scrollViewState.contentHeight = contentHeight;
      // TODO: Handle device rotation
    },
    [scrollViewState],
  );

  return {
    scrollViewState,
    handlers: {
      onScroll: handleScroll,
      onScrollEndDrag: handleScrollEndDrag,
      onLayout: handleLayout,
      onContentSizeChange: handleContentSizeChange,
    },
  };
}

export interface Measurements {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
}

export const Measurements = {
  initial: (): Measurements => ({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    pageX: 0,
    pageY: 0,
  }),
  isEqual: (m1: Measurements, m2: Measurements): boolean => {
    return (
      m1.height === m2.height &&
      m1.pageX === m2.pageX &&
      m1.pageY === m2.pageY &&
      m1.width === m2.width &&
      m1.x === m2.x &&
      m1.y === m2.y
    );
  },
  fromArray: (
    arr: [
      x: number,
      y: number,
      width: number,
      height: number,
      pageX: number,
      pageY: number,
    ],
  ): Measurements => {
    const [x, y, width, height, pageX, pageY] = arr;

    return {
      x,
      y,
      width,
      height,
      pageX,
      pageY,
    };
  },
};
