import Delta from 'quill-delta';
import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { EditorContent, EditorContentInstance } from './editor_content';
import {
  Pressable,
  IconName,
  Icon,
  Divider,
  Container,
  Row,
  Button,
  Text,
} from '../../components';
import { useTheme, tokens, TextSize } from '../../theme';
import type { TextChangeEvent, SelectionChangeEvent } from './types';

interface EditorProps {
  initialContent?: Delta;
}

const TOOLBAR_WIDTH = 336;
const TOOLBAR_HEIGHT = 48;
const SIDEBAR_CONTROLS_HEIGHT = 48;

export function Editor(props: EditorProps) {
  const {
    initialContent = new Delta()
      .insert(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque laoreet nulla tortor, ut consequat metus imperdiet eu. Aenean viverra non mi convallis auctor. Nullam felis elit, varius ut maximus sed, luctus ac arcu. Sed tincidunt, nibh eget ultrices tincidunt, felis eros commodo felis, vel ornare nibh sapien vel metus. Vivamus eu tristique sapien. Pellentesque imperdiet porttitor velit at pharetra. Morbi sem orci, dictum id sapien vel, ullamcorper semper neque.',
      )
      .insert('\n'),
  } = props;
  const theme = useTheme();
  const editorContentRef = React.useRef<EditorContentInstance | null>(null);
  const toolbar = React.useRef(new Animated.ValueXY()).current;
  const sidebar = React.useRef(new Animated.Value(0)).current;
  const [isToolbarVisible, setIsToolbarVisible] = React.useState(false);
  const [
    isSidebarControlsVisible,
    setIsSidebarControlsVisible,
  ] = React.useState(false);

  const handleTextChange = React.useCallback(
    async (event: TextChangeEvent) => {
      console.log(event);
      if (editorContentRef.current) {
        // Pressed enter
        if (event.delta.ops[1]?.insert === '\n' && event.delta.ops[0]?.retain) {
          const rangeBounds = await editorContentRef.current.getBounds({
            index: event.delta.ops[0].retain + 1,
            length: 0,
          });
          setIsSidebarControlsVisible(true);
          sidebar.setValue(rangeBounds.top - 16);
        }
      }
    },
    [sidebar],
  );

  const handleSelectionChange = React.useCallback(
    async (event: SelectionChangeEvent) => {
      console.log(event);
      const { range } = event;

      if (editorContentRef.current) {
        if (range.length === 0) {
          setIsToolbarVisible(false);
          const line = await editorContentRef.current.getLine(range.index);

          if (line?.isEmpty) {
            const rangeBounds = await editorContentRef.current.getBounds(range);
            setIsSidebarControlsVisible(true);
            sidebar.setValue(rangeBounds.top - 16);
          }
        } else {
          const rangeBounds = await editorContentRef.current.getBounds(range);
          toolbar.setValue({
            x: Math.max(
              rangeBounds.left + rangeBounds.width / 2 - TOOLBAR_WIDTH / 2,
              0,
            ),
            y: rangeBounds.top - TOOLBAR_HEIGHT - 16,
          });
          setIsToolbarVisible(true);
        }
      }
    },
    [editorContentRef, toolbar, sidebar],
  );

  return (
    <Container expanded paddingHorizontal={64}>
      <Animated.View
        style={[
          styles.toolbar,
          isToolbarVisible ? styles.visible : styles.invisible,
          theme.container.shadow,
          {
            borderColor: theme.border.color.default,
            backgroundColor: theme.container.color.content,
            transform: [{ translateX: toolbar.x }, { translateY: toolbar.y }],
          },
        ]}
      >
        <Toolbar />
      </Animated.View>
      <Animated.View
        style={[
          styles.sidebar,
          isSidebarControlsVisible ? styles.visible : styles.invisible,
          {
            transform: [{ translateY: sidebar }],
          },
        ]}
      >
        <AddBlock />
      </Animated.View>
      <EditorContent
        ref={editorContentRef}
        onTextChange={handleTextChange}
        onSelectionChange={handleSelectionChange}
        initialContent={initialContent}
      />
    </Container>
  );
}

function AddBlock() {
  return <ToolbarToggle icon="plus" onPress={() => {}} />;
}

function Toolbar() {
  return (
    <Row>
      <ToolbarToggle icon="bold" onPress={() => {}} />
      <ToolbarToggle icon="italic" onPress={() => {}} />
      <ToolbarToggle icon="link" onPress={() => {}} />
      <Divider orientation="vertical" />
      <ToolbarToggle icon="font" size="sm" onPress={() => {}} />
      <ToolbarToggle icon="font" size="md" onPress={() => {}} />
      <ToolbarToggle icon="quote" onPress={() => {}} />
      <ToolbarToggle icon="code" onPress={() => {}} />
    </Row>
  );
}

interface ToolbarToggleProps {
  icon: IconName;
  size?: TextSize;
  onPress: () => void;
}

export function ToolbarToggle(props: ToolbarToggleProps) {
  const { onPress, icon, size } = props;
  const background = React.useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered }) => {
        Animated.spring(background, {
          toValue: pressed ? 1 : hovered ? 0.5 : 0,
          useNativeDriver: true,
          bounciness: 0,
          speed: 100,
        }).start();

        return [
          styles.toggle,
          {
            backgroundColor: background.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [
                theme.button.flat.backgroundDefault,
                theme.button.flat.backgroundHovered,
                theme.button.flat.backgroundPressed,
              ],
            }),
          },
        ];
      }}
    >
      <Icon name={icon} size={size} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    width: TOOLBAR_WIDTH,
    position: 'absolute',
    borderRadius: tokens.radius,
  },
  sidebar: {
    width: 48,
    height: SIDEBAR_CONTROLS_HEIGHT,
    position: 'absolute',
    left: 0,
  },
  visible: {
    display: 'flex',
  },
  invisible: {
    display: 'none',
  },
  toggle: {
    flex: 1,
    height: TOOLBAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: tokens.radius,
  },
});
