import React from 'react';
import {
  ScrollView,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
} from 'react-native';
import { useDropTarget } from '../components/drag_drop/use_drop_target';
import { measure } from '../components/drag_drop/measurements';
import { Block, BlockCard, BlockWithData } from './block_card';
import { Draggable } from './drag_drop/draggable';

interface BlockListProps {
  id: string;
  blocks: Block[];
}

function initBlocksData(blocks: Block[]): BlockWithData[] {
  return blocks.map((block, index) => ({
    ...block,
    index,
    measurements: null,
    position: new Animated.ValueXY(),
  }));
}

export interface ScrollViewState {
  contentHeight: number;
  height: number;
  offsetY: number;
}

export function BlockList(props: BlockListProps) {
  const { blocks } = props;
  const [scrollEnabled, setScrollEnabled] = React.useState(true);
  const scrollViewState = React.useRef<ScrollViewState>({
    contentHeight: 0,
    height: 0,
    offsetY: 0,
  }).current;

  const blocksWithData = React.useRef(initBlocksData(blocks)).current;

  const [dropTarget, ref] = useDropTarget<ScrollView>({
    onAccept: () => {
      setScrollEnabled(true);
    },
    onEnter: () => {
      console.log('onEnter');

      setScrollEnabled(false);
    },
    onHover: (draggable: Draggable<BlockWithData>, dragState) => {
      if (!draggable.measurements || !dropTarget.measurements) {
        return;
      }

      // Get drag position within scroll view
      const y =
        dragState.pageY -
        dropTarget.measurements.pageY +
        scrollViewState.offsetY;

      const draggedBlockIndex = draggable.item.index;

      // Find the block that this drag is hovering over
      let hoverIndex = 0;
      for (let i = blocksWithData.length - 1; i >= 0; i--) {
        const block = blocksWithData[i];

        if (!block.measurements) {
          return;
        }

        hoverIndex = i;

        if (block.measurements.y + 0.5 * block.measurements.height < y) {
          break;
        }
      }

      if (hoverIndex === draggedBlockIndex) {
        return;
      }

      // Shift items according to their indexes
      for (let i = 0; i < blocksWithData.length; i++) {
        const block = blocksWithData[i];

        if (i > draggedBlockIndex && i <= hoverIndex) {
          Animated.spring(block.position, {
            toValue: {
              x: 0,
              y: -draggable.measurements.height,
            },
            bounciness: 0,
            speed: 24,
            useNativeDriver: false,
          }).start();
          continue;
        }

        Animated.spring(block.position, {
          toValue: {
            x: 0,
            y: 0,
          },
          bounciness: 0,
          speed: 24,
          useNativeDriver: false,
        }).start();
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
      });
      // TODO: Handle device rotation
    },
    [scrollViewState, dropTarget, ref],
  );

  const handleContentSizeChange = React.useCallback(
    (contentWidth: number, contentHeight: number) => {
      scrollViewState.contentHeight = contentHeight;
      // TODO: Handle device rotation
    },
    [scrollViewState],
  );

  return (
    <Animated.ScrollView
      // @ts-ignore
      ref={ref}
      scrollEventThrottle={16}
      scrollEnabled={scrollEnabled}
      onScroll={handleScroll}
      onScrollEndDrag={handleScrollEndDrag}
      onLayout={handleLayout}
      onContentSizeChange={handleContentSizeChange}
    >
      {blocksWithData.map((block) => (
        <BlockCard key={block.id} block={block} />
      ))}
    </Animated.ScrollView>
  );
}
