import React from 'react';
import {
  ScrollView,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  GestureResponderEvent,
  PanResponderGestureState,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { useDropTarget } from '../drag_drop/use_drop_target';
import { measure } from '../utils/measurements';
import { Draggable, DragState } from '../drag_drop/draggable';
import { useGestureDetector, GestureDetectorConfig } from './gesture_detector';
import { useDraggable } from '../drag_drop/use_draggable';
import { Text } from './text';

interface ReorderableListProps<T = any> {
  items: T[];
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

const CARD_HEIGHT = 56;

export function ReorderableList(props: ReorderableListProps) {
  const { items } = props;
  const [scrollEnabled, setScrollEnabled] = React.useState(true);
  const scrollViewState = React.useRef<ScrollViewState>({
    contentHeight: 0,
    height: 0,
    offsetY: 0,
  }).current;
  const listItems: ReorderableListItem[] = items.map((c, index) => {
    return {
      ...c,
      index,
      height: CARD_HEIGHT,
      y: CARD_HEIGHT * index,
      position: new Animated.ValueXY(),
    };
  });

  const [dropTarget, ref] = useDropTarget<ScrollView>({
    onAccept: () => {
      setScrollEnabled(true);
    },
    onEnter: () => {
      setScrollEnabled(false);
    },
    onHover: (draggable: Draggable<ReorderableListItem>, dragState) => {
      if (!draggable.measurements || !dropTarget.measurements) {
        return;
      }

      const draggingCard = draggable.item;

      // Get Y-coordinate within scroll view
      const y =
        dragState.pageY -
        dropTarget.measurements.pageY +
        scrollViewState.offsetY;

      // Find the card that this drag is hovering over
      let hoverIndex = 0;
      for (let i = 0; i < listItems.length; i++) {
        const card = listItems[i];

        hoverIndex = i;

        if (card.y <= y && y <= card.y + card.height) {
          break;
        }
      }

      // Short circuit if there was no change
      if (draggingCard.index === hoverIndex) {
        return;
      }

      // During fast movements, hoverIndex may "jump" over next card, to 2nd next card.
      // To keep sequential movement of the items we limit each swap to 2 consecutive items
      if (Math.abs(draggingCard.index - hoverIndex) > 1) {
        return;
      }

      const dragDirection =
        draggingCard.index < hoverIndex
          ? DragDirection.Downwards
          : DragDirection.Upwards;

      // Determine whether to perform a swap or not
      // And if there is a swap, amend their post-swap Y-coordinates
      const hoveredCard = listItems[hoverIndex];
      if (
        dragDirection === DragDirection.Downwards &&
        y > draggingCard.y + hoveredCard.height
      ) {
        // Perform change in the y of the items
        listItems[hoverIndex].y = draggingCard.y;
        draggingCard.y = draggingCard.y + hoveredCard.height;
      } else if (
        dragDirection === DragDirection.Upwards &&
        y < hoveredCard.y + draggingCard.height
      ) {
        // Perform change in the y of the items
        draggingCard.y = hoveredCard.y;
        hoveredCard.y = draggingCard.y + draggingCard.height;
      } else {
        return;
      }

      // Perform change in the indexes of the items
      const tempIndex = listItems[hoverIndex].index;
      listItems[hoverIndex].index = draggable.item.index;
      draggable.item.index = tempIndex;

      // Sort items according to their latest indexes
      listItems.sort((a, b) => a.index - b.index);

      // Shift items according to their indexes
      for (let i = 0; i < listItems.length; i++) {
        const card = listItems[i];

        if (card.index > hoverIndex) {
          Animated.spring(card.position, {
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

        Animated.spring(card.position, {
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
    (dragCard: ReorderableListItem) => {
      for (let i = 0; i < listItems.length; i++) {
        const card = listItems[i];

        if (i <= dragCard.index) {
          continue;
        }

        card.position.setValue({
          x: 0,
          y: dragCard.height,
        });
      }
    },
    [listItems],
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
      {listItems.map((c) => (
        <ReorderableListItem
          card={c}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        />
      ))}
    </Animated.ScrollView>
  );
}

export interface ReorderableListItem<T = any> {
  index: number;
  position: Animated.ValueXY;
  y: number;
  height: number;
  data: T;
}

interface ReorderableListItemProps {
  card: ReorderableListItem;
  onDragStart: (card: ReorderableListItem) => void;
  onDragEnd: (card: ReorderableListItem) => void;
  onPress?: (card: ReorderableListItem) => void;
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

function ReorderableListItem(props: ReorderableListItemProps) {
  const { card, onDragStart, onDragEnd, onPress = () => {} } = props;
  const { position } = card;
  const [dragging, setDragging] = React.useState(false);
  const [draggable, ref] = useDraggable<ReorderableListItem, View>({
    item: card,
  });

  const config: GestureDetectorConfig = React.useMemo(() => {
    let isLongPress = false;

    return {
      onPress: () => {
        onPress(card);
      },
      onLongPress: () => {
        isLongPress = true;
      },
      onDragStart: (
        event: GestureResponderEvent,
        state: PanResponderGestureState,
      ) => {
        onDragStart(card);
        setDragging(true);
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
        setDragging(false);
        draggable.endDrag(toDragState(event, state));
        isLongPress = false;
      },
    };
  }, [card, draggable, position, setDragging, onDragStart, onDragEnd, onPress]);

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
        styles.base,
        {
          transform: [{ translateX: position.x }, { translateY: position.y }],
          top: dragging ? card.y : undefined,
        },
        dragging && styles.dragging,
      ]}
      {...eventHandlers}
    >
      <Text color="muted">New card</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // @ts-ignore
  base: {
    ...(Platform.OS === 'web'
      ? {
          userSelect: 'none',
        }
      : {}),
    width: '100%',
    zIndex: 0,
    overflow: 'hidden',
  },
  dragging: {
    zIndex: 1,
    position: 'absolute',
  },
});
