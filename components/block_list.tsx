import React from 'react';
import {
  ScrollView,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useDropTarget } from '../components/drag_drop/use_drop_target';
import { measure } from '../components/drag_drop/measurements';
import { Block, BlockCard } from './block_card';

interface BlockListProps {
  blocks: Block[];
}

const AUTOSCROLL_OFFSET = 50;

export function BlockList(props: BlockListProps) {
  const { blocks } = props;
  const [scrollEnabled, setScrollEnabled] = React.useState(false);
  const scrollViewState = React.useRef({
    contentHeight: 0,
    height: 0,
    offsetY: 0,
    top: 0,
    bottom: 0,
  }).current;

  const [dropTarget, ref] = useDropTarget<ScrollView>({
    onAccept: () => {
      setScrollEnabled(true);
    },
    onEnter: () => {
      console.log('onEnter');

      setScrollEnabled(false);
    },
    onHover: (draggable, dragState) => {
      if (dragState.pageY > scrollViewState.bottom - AUTOSCROLL_OFFSET) {
        handleAutoScroll('down');
      } else if (dragState.pageY < scrollViewState.top + AUTOSCROLL_OFFSET) {
        handleAutoScroll('up');
      }
    },
    onLeave: () => {
      console.log('onLeave');

      setScrollEnabled(true);
    },
    onWillAccept: () => {
      return true;
    },
  });

  const handleAutoScroll = React.useCallback(
    (direction: 'up' | 'down') => {
      if (direction === 'up') {
        if (scrollViewState.offsetY === 0) {
          return;
        }
        ref.current?.scrollTo({
          x: 0,
          y: scrollViewState.offsetY - 20,
        });
      } else {
        if (scrollViewState.contentHeight === scrollViewState.offsetY) {
          return;
        }

        ref.current?.scrollTo({
          x: 0,
          y: scrollViewState.offsetY + 20,
        });
      }
    },
    [scrollViewState, ref],
  );

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

      measure(ref).then((measurements) => {
        dropTarget.measurements = measurements;
        scrollViewState.top = dropTarget.measurements.pageY;
        scrollViewState.bottom =
          dropTarget.measurements.pageY + scrollViewState.height;
      });

      const maxOffset = scrollViewState.contentHeight - scrollViewState.height;

      if (maxOffset < scrollViewState.offsetY) {
        scrollViewState.offsetY = maxOffset;
      }
    },
    [scrollViewState, dropTarget, ref],
  );

  const handleContentSizeChange = React.useCallback(
    (contentWidth: number, contentHeight: number) => {
      scrollViewState.contentHeight = contentHeight;

      const maxOffset = scrollViewState.contentHeight - scrollViewState.height;

      if (maxOffset < scrollViewState.offsetY) {
        scrollViewState.offsetY = maxOffset;
      }
    },
    [scrollViewState],
  );

  return (
    <ScrollView
      scrollEventThrottle={16}
      scrollEnabled={scrollEnabled}
      ref={ref}
      onScroll={handleScroll}
      onScrollEndDrag={handleScrollEndDrag}
      onLayout={handleLayout}
      onContentSizeChange={handleContentSizeChange}
    >
      {blocks.map((block) => (
        <BlockCard key={block.id} block={block} />
      ))}
    </ScrollView>
  );
}
