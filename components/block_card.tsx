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
  height: number;
}

interface BlockCardProps {
  block: Block;
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
  const zIndex = React.useRef(new Animated.Value(0)).current;
  const pan = React.useRef(new Animated.ValueXY()).current;
  const [draggable, ref] = useDraggable<Block, View>({
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
        zIndex.setValue(99);
      },
      onDragMove: (
        event: GestureResponderEvent,
        state: PanResponderGestureState,
      ) => {
        // console.log('BlockCard:onDragMove');
        if (isLongPress) {
          draggable.drag(toDragState(event, state));
          pan.setValue({
            x: 0,
            y: state.dy,
          });
        } else {
          pan.setValue({
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
        zIndex.setValue(0);
      },
    };
  }, [draggable, pan, zIndex]);

  const eventHandlers = useGestureDetector(config);

  const handleLayout = React.useCallback(() => {
    measure(ref).then((measurements) => {
      draggable.measurements = measurements;
    });
  }, [draggable, ref]);

  return (
    <Animated.View
      // @ts-ignore
      ref={ref}
      accessible
      onLayout={handleLayout}
      style={[
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          zIndex,
        },
        styles.root,
      ]}
      {...eventHandlers}
    >
      <View style={[styles.block]}>
        <Text style={styles.blockTitle}>{block.title}</Text>
        <Text style={styles.blockNote}>{block.note}</Text>
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
    borderBottomWidth: 1,
  },
  blockTitle: {
    fontWeight: 'bold',
  },
  active: {
    backgroundColor: 'green',
  },
  blockNote: {},
});
