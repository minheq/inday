import React from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';
import { useGestureDetector, GestureDetectorConfig } from './gesture_detector';
import { useDraggable } from './drag_drop/use_draggable';

interface Block {
  id: string;
  title: string;
  note: string;
}

interface BlockCardProps {
  block: Block;
}

export function BlockCard(props: BlockCardProps) {
  const { block } = props;

  const pan = React.useRef(new Animated.ValueXY()).current;

  const { startDrag, endDrag, draggableRef } = useDraggable({
    onDraggableCanceled: () => {},
    onDragCompleted: () => {},
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
      onDragStart: () => {
        startDrag();
        // pan.setOffset({
        //   x: pan.x._value,
        //   y: pan.y._value,
        // });
      },
      onDragMove: (event, state) => {
        if (isLongPress) {
          pan.setValue({
            x: state.dx,
            y: state.dy,
          });
        } else {
          pan.setValue({
            x: state.dx,
            y: 0,
          });
        }
      },
      onDragEnd: () => {
        endDrag();
        isLongPress = false;
        console.log('onDragEnd');
      },
    };
  }, [pan, startDrag, endDrag]);

  const eventHandlers = useGestureDetector(config);

  return (
    <Animated.View
      // @ts-ignore
      ref={draggableRef}
      accessible
      style={[
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
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
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
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
