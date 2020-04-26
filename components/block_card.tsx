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
import { measure, Measurements } from './drag_drop/measurements';

export interface Block {
  id: string;
  title: string;
  note: string;
  height: number;
}

export interface BlockWithData extends Block {
  index: number;
  position: Animated.ValueXY;
  measurements: Measurements | null;
}

export interface BlockCardProps {
  block: BlockWithData;
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
  const { block } = props;

  const { position } = block;
  const isDragging = React.useRef(new Animated.Value(0)).current;

  const [draggable, ref] = useDraggable<BlockWithData, View>({
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
        draggable.startDrag(toDragState(event, state));
        isDragging.setValue(1);
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
        // console.log('BlockCard:onDragEnd');
        draggable.endDrag(toDragState(event, state));
        isLongPress = false;
        isDragging.setValue(0);
      },
    };
  }, [draggable, position, isDragging]);

  const eventHandlers = useGestureDetector(config);

  const handleLayout = React.useCallback(() => {
    measure(ref).then((measurements) => {
      draggable.measurements = measurements;
      block.measurements = measurements;
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
          zIndex: isDragging,
        },
      ]}
      {...eventHandlers}
    >
      <View style={[styles.block, { height: block.height }]}>
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
