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
import {
  useGestureDetector,
  GestureDetectorConfig,
} from '../components/gesture_detector';
import { useDraggable } from '../drag_drop/use_draggable';
import { DragState } from '../drag_drop/draggable';
import { measure } from '../drag_drop/measurements';
import { Card } from './types';

export interface CardListItem extends Card {
  index: number;
  position: Animated.ValueXY;
  y: number;
  x: number;
  height: number;
}

export interface CardListItemProps {
  card: CardListItem;
  onDragStart: (card: CardListItem) => void;
  onDragEnd: (card: CardListItem) => void;
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

export function CardListItem(props: CardListItemProps) {
  const { card, onDragStart, onDragEnd } = props;

  const { position } = card;
  const [isDragging, setIsDragging] = React.useState(false);

  const [draggable, ref] = useDraggable<CardListItem, View>({
    item: card,
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
        onDragStart(card);
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
        onDragEnd(card);
        setIsDragging(false);
        draggable.endDrag(toDragState(event, state));
        isLongPress = false;
      },
    };
  }, [card, draggable, position, setIsDragging, onDragStart, onDragEnd]);

  const eventHandlers = useGestureDetector(config);

  const handleLayout = React.useCallback(() => {
    measure(ref).then((measurements) => {
      draggable.measurements = measurements;
      card.y = measurements.y;
      card.x = measurements.x;
      card.height = measurements.height;
    });
  }, [draggable, ref, card]);

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
          top: isDragging ? card.y : undefined,
          left: isDragging ? card.x : undefined,
          width: '100%',
        },
      ]}
      {...eventHandlers}
    >
      <View style={[styles.card, { height: card.contentHeight }]}>
        <Text style={styles.cardTitle}>
          {card.id} {card.title}
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
  card: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderColor: '#f0f0f0',
    borderWidth: 1,
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  active: {
    backgroundColor: 'green',
  },
  cardNote: {},
});
