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
import { Card } from '../data/types';
import { useGestureDetector, GestureDetectorConfig } from './gesture_detector';
import { useDraggable } from '../drag_drop/use_draggable';
import { useTheme, tokens } from '../theme';
import { useCardList } from '../core/card_list';
import { Text } from './text';

interface CardListProps {
  cards: Card[];
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

export function CardList(props: CardListProps) {
  const { cards } = props;
  const [scrollEnabled, setScrollEnabled] = React.useState(true);
  const scrollViewState = React.useRef<ScrollViewState>({
    contentHeight: 0,
    height: 0,
    offsetY: 0,
  }).current;
  const cardListItems: CardListItem[] = cards.map((c, index) => {
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
    onHover: (draggable: Draggable<CardListItem>, dragState) => {
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
      for (let i = 0; i < cardListItems.length; i++) {
        const card = cardListItems[i];

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
      // To keep sequential movement of the cards we limit each swap to 2 consecutive cards
      if (Math.abs(draggingCard.index - hoverIndex) > 1) {
        return;
      }

      const dragDirection =
        draggingCard.index < hoverIndex
          ? DragDirection.Downwards
          : DragDirection.Upwards;

      // Determine whether to perform a swap or not
      // And if there is a swap, amend their post-swap Y-coordinates
      const hoveredCard = cardListItems[hoverIndex];
      if (
        dragDirection === DragDirection.Downwards &&
        y > draggingCard.y + hoveredCard.height
      ) {
        // Perform change in the y of the cards
        cardListItems[hoverIndex].y = draggingCard.y;
        draggingCard.y = draggingCard.y + hoveredCard.height;
      } else if (
        dragDirection === DragDirection.Upwards &&
        y < hoveredCard.y + draggingCard.height
      ) {
        // Perform change in the y of the cards
        draggingCard.y = hoveredCard.y;
        hoveredCard.y = draggingCard.y + draggingCard.height;
      } else {
        return;
      }

      // Perform change in the indexes of the cards
      const tempIndex = cardListItems[hoverIndex].index;
      cardListItems[hoverIndex].index = draggable.item.index;
      draggable.item.index = tempIndex;

      // Sort cards according to their latest indexes
      cardListItems.sort((a, b) => a.index - b.index);

      // Shift items according to their indexes
      for (let i = 0; i < cardListItems.length; i++) {
        const card = cardListItems[i];

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
    (dragCard: CardListItem) => {
      for (let i = 0; i < cardListItems.length; i++) {
        const card = cardListItems[i];

        if (i <= dragCard.index) {
          continue;
        }

        card.position.setValue({
          x: 0,
          y: dragCard.height,
        });
      }
    },
    [cardListItems],
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
      {cardListItems.map((c) => (
        <CardListItem
          card={c}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        />
      ))}
    </Animated.ScrollView>
  );
}

export interface CardListItem extends Card {
  index: number;
  position: Animated.ValueXY;
  y: number;
  height: number;
}

interface CardListItemProps {
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

function CardListItem(props: CardListItemProps) {
  const { card, onDragStart, onDragEnd } = props;
  const { preview, position } = card;
  const { onOpen, cardID } = useCardList();
  const open = cardID === card.id;
  const theme = useTheme();
  const height = React.useRef(new Animated.Value(CARD_HEIGHT)).current;
  const shadow = React.useRef(new Animated.Value(0)).current;
  const [dragging, setDragging] = React.useState(false);
  const [draggable, ref] = useDraggable<CardListItem, View>({
    item: card,
  });

  const config: GestureDetectorConfig = React.useMemo(() => {
    let isLongPress = false;

    return {
      onPress: () => {
        onOpen(card.id);
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
  }, [card, draggable, position, setDragging, onDragStart, onDragEnd, onOpen]);

  const eventHandlers = useGestureDetector(config);

  const handleLayout = React.useCallback(() => {
    measure(ref).then((measurements) => {
      draggable.measurements = measurements;
    });
  }, [draggable, ref]);

  const handleContentLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      Animated.spring(height, {
        toValue: event.nativeEvent.layout.height,
        bounciness: 0,
        useNativeDriver: false,
      }).start();
    },
    [height],
  );

  React.useEffect(() => {
    Animated.spring(shadow, {
      toValue: open ? 1 : 0,
      bounciness: 0,
      useNativeDriver: true,
    });
  }, [shadow, open]);

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
          height,
        },
        open && theme.container.shadow,
        open && styles.open,
        dragging && styles.dragging,
      ]}
      {...eventHandlers}
    >
      <View onLayout={handleContentLayout} style={[styles.card]}>
        {preview.title ? (
          <Text>{preview.title}</Text>
        ) : (
          <Text color="muted">New card</Text>
        )}
      </View>
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
    borderRadius: tokens.radius,
  },
  open: {
    marginVertical: 24,
  },
  dragging: {
    zIndex: 1,
    position: 'absolute',
  },
  card: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
  },
  active: {
    backgroundColor: 'green',
  },
  cardNote: {},
});
