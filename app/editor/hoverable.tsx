import React from 'react';
import { Animated, StyleSheet, View, findNodeHandle } from 'react-native';
import { Container } from '../components';
import { tokens, useTheme } from '../theme';
import { between } from '../utils/numbers';
import { measure } from '../utils/measurements';
import { useEditor } from './editor';

export interface HoverableToolbarData {
  type: 'toolbar';
}

export interface HoverableLinkData {
  type: 'link';
}

export type Hoverable = HoverableToolbarData | HoverableLinkData;

export interface HoverableItem {
  isVisible: boolean;
  hoverable: Hoverable | null;
  position: Animated.ValueXY;
  opacity: Animated.Value;
}

const initialHoverableItem: HoverableItem = {
  isVisible: false,
  hoverable: null,
  position: new Animated.ValueXY(),
  opacity: new Animated.Value(0),
};

export function Hoverable() {
  const theme = useTheme();
  const editor = useEditor();
  const { selection } = editor;
  const hoverableRef = React.useRef<View>();
  const [hoverableItem, setHoverableItem] = React.useState<HoverableItem>(
    initialHoverableItem,
  );

  React.useEffect(() => {
    if (!hoverableRef.current || !selection) {
      return;
    }

    if (
      selection.height === 0 ||
      selection.left === 0 ||
      selection.top === 0 ||
      selection.width === 0
    ) {
      return;
    }

    const handle = findNodeHandle(hoverableRef.current);

    if (!handle) {
      return;
    }

    const { width, height } = await measure(hoverableRef);

    let y = 0;
    const LINE_OFFSET = 8;
    if (selection.top - height < 4) {
      y = selection.top + LINE_HEIGHT + LINE_OFFSET;
    } else {
      y = selection.top - height - LINE_OFFSET;
    }

    const x = between(selection.left + selection.width / 2 - width / 2, 8, 440);

    return { x, y };
  });

  const handleShowHoverable = async (hoverable: Hoverable) => {
    const item: HoverableItem = {
      hoverable,
      isVisible: true,
      position: new Animated.ValueXY(),
      opacity: new Animated.Value(0),
    };

    // Set hoverable item first so that we can measure its dimensions
    setHoverableItem(item);

    const position = await getHoverablePosition();

    if (!position) {
      return;
    }

    // Update its position
    const { x, y } = position;
    item.position.setValue({ x, y });

    Animated.timing(item.opacity, {
      toValue: 1,
      useNativeDriver: true,
      duration: 100,
    }).start();
  };

  const handleHideHoverable = () => {
    if (hoverableItem.isVisible) {
      Animated.timing(hoverableItem.opacity, {
        toValue: 0,
        useNativeDriver: true,
        duration: 100,
      }).start(() => {
        setHoverableItem(initialHoverableItem);
      });
    }
  };

  return (
    <Container expanded>
      <Animated.View
        style={[
          styles.hoverable,
          theme.container.shadow,
          {
            borderColor: theme.border.color.default,
            backgroundColor: theme.container.color.content,
            transform: [
              { translateX: hoverableItem.position.x },
              { translateY: hoverableItem.position.y },
            ],
            opacity: hoverableItem.opacity,
          },
        ]}
      >
        <View ref={hoverableRef}>
          {hoverableItem.hoverable?.type === 'toolbar' && (
            <HoverableToolbar
              formats={formats}
              onOpenLinkEdit={this.handleOpenLinkEdit}
            />
          )}
        </View>
      </Animated.View>
    </Container>
  );
}

const styles = StyleSheet.create({
  hoverable: {
    position: 'absolute',
    borderRadius: tokens.radius,
    zIndex: 1,
  },
  placeholder: {
    position: 'absolute',
    zIndex: -1,
  },
});

// const handleUpdateHoverablePositionIfNeeded = async () => {
//   if (!hoverableItem.hoverable) {
//     return;
//   }

//   const position = await this.getHoverablePosition();

//   if (!position) {
//     return;
//   }

//   const { x, y } = position;
//   const prevX = (hoverableItem.position.x as any)._value;
//   const prevY = (hoverableItem.position.y as any)._value;
//   const deltaX = prevX - x;
//   const deltaY = prevY - y;

//   // Update when significant enough
//   if (Math.hypot(deltaX, deltaY) > 10) {
//     Animated.spring(hoverableItem.position, {
//       toValue: {
//         x,
//         y,
//       },
//       useNativeDriver: true,
//       bounciness: 0,
//       speed: 300,
//     }).start();
//   }
// };
