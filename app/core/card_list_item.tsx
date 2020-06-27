import React from 'react';
import {
  Animated,
  StyleSheet,
  View,
  GestureResponderEvent,
  PanResponderGestureState,
  Platform,
  LayoutChangeEvent,
} from 'react-native';
import {
  useGestureDetector,
  GestureDetectorConfig,
} from '../components/gesture_detector';
import { useDraggable } from '../drag_drop/use_draggable';
import { DragState } from '../drag_drop/draggable';
import { measure } from '../utils/measurements';
import { Card, Content } from '../data/types';
import { useCardList } from './card_list';
import { Text } from '../components';
import { Editor, EditorInstance } from '../editor';
import { useTheme, tokens } from '../theme';
import { useDebouncedCallback } from '../hooks/use_debounced_callback';
import { useUpdateCardContent } from '../data/api';

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

export const CARD_HEIGHT = 56;

export function CardListItem(props: CardListItemProps) {
  const { card, onDragStart, onDragEnd } = props;
  const { preview, position } = card;
  const { onOpen, cardID } = useCardList();
  const open = cardID === card.id;
  const theme = useTheme();
  const updateCardContent = useUpdateCardContent();
  const editorRef = React.useRef<EditorInstance>(null);
  const height = React.useRef(new Animated.Value(CARD_HEIGHT)).current;
  const shadow = React.useRef(new Animated.Value(0)).current;
  const [dragging, setDragging] = React.useState(false);
  const [draggable, ref] = useDraggable<CardListItem, View>({
    item: card,
  });

  const handleChangeContent = useDebouncedCallback(
    (content: Content) => {
      updateCardContent({
        id: card.id,
        content,
      });
    },
    [card],
  );

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

    if (open) {
      editorRef.current?.focus();
    }
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
        {open ? (
          <Editor
            ref={editorRef}
            initialValue={card.content}
            onChange={handleChangeContent}
          />
        ) : preview.title ? (
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
