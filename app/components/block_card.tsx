import React from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  GestureResponderEvent,
  PanResponderGestureState,
  Platform,
} from 'react-native';
import { useGestureDetector, GestureDetectorConfig } from './gesture_detector';
import { useDraggable } from './drag_drop/use_draggable';
import { DragState } from './drag_drop/draggable';
import { measure } from './drag_drop/measurements';

export interface Block {
  id: string;
  title: string;
  note: string;
  contentHeight: number;
}

export interface PositionedBlock extends Block {
  index: number;
  position: Animated.ValueXY;
  y: number;
  x: number;
  height: number;
}

export interface BlockCardProps {
  block: PositionedBlock;
  onDragStart: (block: PositionedBlock) => void;
  onDragEnd: (block: PositionedBlock) => void;
}

function toDragState(
  event: GestureResponderEvent,
  state: PanResponderGestureState,
): DragState {
  return {
    dx: state.dx,
    dy: state.dy,
    pageX: event.nativeEvent.pageX,
    pageY: event.nativeEvent.pageY,
  };
}

export function BlockCard(props: BlockCardProps) {
  const { block, onDragStart, onDragEnd } = props;

  const { position } = block;
  const [isDragging, setIsDragging] = React.useState(false);

  const [draggable, ref] = useDraggable<PositionedBlock, View>({
    item: block,
  });

  const config: GestureDetectorConfig = React.useMemo(() => {
    let isLongPress = false;

    return {
      onPress: () => {
        console.log('onPress');
      },
      onLongPress: () => {
        console.log('onLongPress');
        isLongPress = true;
      },
      onDragStart: (
        event: GestureResponderEvent,
        state: PanResponderGestureState,
      ) => {
        onDragStart(block);
        setIsDragging(true);
        draggable.startDrag(toDragState(event, state));
      },
      onDragMove: (
        event: GestureResponderEvent,
        state: PanResponderGestureState,
      ) => {
        if (isLongPress) {
          draggable.drag(toDragState(event, state));

          position.setValue({
            x: state.dx,
            y: state.dy,
          });
        } else {
          position.setValue({
            x: state.dx,
            y: 0,
          });
        }
      },
      onDragEnd: (
        event: GestureResponderEvent,
        state: PanResponderGestureState,
      ) => {
        onDragEnd(block);
        setIsDragging(false);
        draggable.endDrag(toDragState(event, state));
        isLongPress = false;
      },
    };
  }, [block, draggable, position, setIsDragging, onDragStart, onDragEnd]);

  const eventHandlers = useGestureDetector(config);

  const handleLayout = React.useCallback(() => {
    measure(ref).then((measurements) => {
      draggable.measurements = measurements;
      block.y = measurements.y;
      block.x = measurements.x;
      block.height = measurements.height;
    });
  }, [draggable, ref, block]);

  return (
    <Animated.View
      // @ts-ignore
      ref={ref}
      accessible
      onLayout={handleLayout}
      style={[
        styles.root,
        {
          transform: [{ translateX: position.x }, { translateY: position.y }],
          zIndex: isDragging ? 1 : 0,
          position: isDragging ? 'absolute' : 'relative',
          top: isDragging ? block.y : undefined,
          left: isDragging ? block.x : undefined,
          width: '100%',
        },
      ]}
      {...eventHandlers}
    >
      <View style={[styles.block, { height: block.contentHeight }]}>
        <Text style={styles.blockTitle}>
          {block.id} {block.title}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root:
    Platform.OS === 'web'
      ? {
          // @ts-ignore
          userSelect: 'none',
        }
      : {},
  block: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderColor: '#f0f0f0',
    borderWidth: 1,
  },
  blockTitle: {
    fontWeight: 'bold',
  },
  active: {
    backgroundColor: 'green',
  },
  blockNote: {},
});
