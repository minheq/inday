import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

type PopoverPosition = 'center' | 'left' | 'right';

interface PopoverProps {
  isOpen?: boolean;
  onRequestClose?: () => void;
  content?: React.ReactNode;
  position?: PopoverPosition;
  children?: React.ReactNode;
}

export function Popover(props: PopoverProps) {
  const { isOpen, content, children, position = 'center' } = props;
  const [internalIsOpen, setInternalIsOpen] = React.useState(isOpen);
  const fade = React.useRef(new Animated.Value(isOpen ? 1 : 0)).current;
  const contentRef = React.useRef<View | null>(null);
  const targetRef = React.useRef<View | null>(null);

  React.useEffect(() => {
    if (!contentRef.current) {
      return;
    }

    if (isOpen) {
      setInternalIsOpen(isOpen);
      Animated.parallel([
        Animated.spring(fade, {
          toValue: 1,
          bounciness: 0,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(fade, {
          toValue: 0,
          bounciness: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setInternalIsOpen(false);
      });
    }
  }, [isOpen, fade]);

  return (
    <View style={styles.root}>
      <View style={styles.target} ref={targetRef}>
        {children}
      </View>
      <Animated.View
        // @ts-ignore
        ref={contentRef}
        style={[
          styles.content,
          styles[position],
          internalIsOpen && styles.visible,
          position === 'center' && { transform: [{ translateX: '-50%' }] },
          { opacity: fade },
        ]}
      >
        {content}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    zIndex: 1,
  },
  target: {
    height: '100%',
    width: '100%',
  },
  content: {
    position: 'absolute',
    zIndex: 1,
    display: 'none',
    top: '100%',
    marginTop: 4,
  },
  center: {
    left: '50%',
  },
  left: {
    left: 0,
  },
  right: {
    right: 0,
  },
  visible: {
    display: 'flex',
  },
});
