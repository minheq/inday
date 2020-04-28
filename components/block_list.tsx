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
import { Block, BlockCard, PositionedBlock } from './block_card';
import { Draggable } from './drag_drop/draggable';

interface BlockListProps {
  id: string;
  blocks: Block[];
}

function initBlocks(blocks: Block[]): PositionedBlock[] {
  return blocks.map((block, index) => ({
    ...block,
    index,
    height: 0,
    y: 0,
    x: 0,
    position: new Animated.ValueXY(),
  }));
}

enum DragDirection {
  Upwards = 'Upwards',
  Downwards = 'Downwards',
  None = 'None',
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

  const positionedBlocks = React.useRef(initBlocks(blocks)).current;

  const [dropTarget, ref] = useDropTarget<ScrollView>({
    onAccept: () => {
      setScrollEnabled(true);
    },
    onEnter: () => {
      setScrollEnabled(false);
    },
    onHover: (draggable: Draggable<PositionedBlock>, dragState) => {
      if (!draggable.measurements || !dropTarget.measurements) {
        return;
      }

      const draggingBlock = draggable.item;

      // Get Y-coordinate within scroll view
      const y =
        dragState.pageY -
        dropTarget.measurements.pageY +
        scrollViewState.offsetY;

      // Find the block that this drag is hovering over
      let hoverIndex = 0;
      for (let i = 0; i < positionedBlocks.length; i++) {
        const block = positionedBlocks[i];

        hoverIndex = i;

        if (block.y <= y && y <= block.y + block.height) {
          break;
        }
      }

      // Short circuit the hoverIndex if there was no change
      if (draggingBlock.index === hoverIndex) {
        return;
      }

      let dragDirection = DragDirection.None;

      if (draggingBlock.index < hoverIndex) {
        dragDirection = DragDirection.Downwards;
      } else {
        dragDirection = DragDirection.Upwards;
      }

      // Determine whether to perform a swap or not
      // And if there is a swap, amend their post-swap Y-coordinates
      const hoveredBlock = positionedBlocks[hoverIndex];
      if (
        dragDirection === DragDirection.Downwards &&
        y > draggingBlock.y + hoveredBlock.height
      ) {
        console.log('DOWNWARD SWAP');
        // Perform change in the y of the blocks
        positionedBlocks[hoverIndex].y = draggingBlock.y;
        draggingBlock.y = draggingBlock.y + hoveredBlock.height;
      } else if (
        dragDirection === DragDirection.Upwards &&
        y < hoveredBlock.y + draggingBlock.height
      ) {
        console.log('UPWARD SWAP');
        // Perform change in the y of the blocks
        draggingBlock.y = hoveredBlock.y;
        hoveredBlock.y = draggingBlock.y + draggingBlock.height;
      } else {
        return;
      }

      // Perform change in the indexes of the blocks
      const tempIndex = positionedBlocks[hoverIndex].index;
      positionedBlocks[hoverIndex].index = draggable.item.index;
      draggable.item.index = tempIndex;

      // Shift items according to their indexes
      for (let i = 0; i < positionedBlocks.length; i++) {
        const block = positionedBlocks[i];

        if (block.index > hoverIndex) {
          Animated.spring(block.position, {
            toValue: {
              x: 0,
              y: draggable.item.height,
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

      // Sort blocks according to their latest indexes
      positionedBlocks.sort((a, b) => a.index - b.index);
    },
    onLeave: () => {
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

  const handleDragStart = React.useCallback(
    (dragBlock: PositionedBlock) => {
      for (let i = 0; i < positionedBlocks.length; i++) {
        const block = positionedBlocks[i];

        if (i <= dragBlock.index) {
          continue;
        }

        block.position.setValue({
          x: 0,
          y: dragBlock.height,
        });
      }
    },
    [positionedBlocks],
  );

  const handleDragEnd = React.useCallback(() => {}, []);

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
      {positionedBlocks.map((block) => (
        <BlockCard
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          key={block.id}
          block={block}
        />
      ))}
    </Animated.ScrollView>
  );
}
