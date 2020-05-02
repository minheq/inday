import Delta from 'quill-delta';
import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { EditorContent, EditorContentInstance } from './editor_content';
import {
  IconName,
  Icon,
  Divider,
  Container,
  Row,
  Button,
  Spacing,
} from '../../components';
import { useTheme, tokens, TextSize } from '../../theme';
import type { TextChangeEvent, SelectionChangeEvent, Range } from './types';

interface EditorProps {
  initialContent?: Delta;
}

const TOOLBAR_WIDTH = 280;
const TOOLBAR_HEIGHT = 40;
const SIDEBAR_CONTROLS_HEIGHT = 40;

export function Editor(props: EditorProps) {
  const {
    initialContent = new Delta()
      .insert(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque laoreet nulla tortor, ut consequat metus imperdiet eu. Aenean viverra non mi convallis auctor. Nullam felis elit, varius ut maximus sed, luctus ac arcu. Sed tincidunt, nibh eget ultrices tincidunt, felis eros commodo felis, vel ornare nibh sapien vel metus. Vivamus eu tristique sapien. Pellentesque imperdiet porttitor velit at pharetra. Morbi sem orci, dictum id sapien vel, ullamcorper semper neque.\n',
      )
      .insert('\n'),
  } = props;
  const theme = useTheme();
  const editorContentRef = React.useRef<EditorContentInstance | null>(null);
  const toolbar = React.useRef({
    position: new Animated.ValueXY(),
    opacity: new Animated.Value(0),
  }).current;
  const sidebar = React.useRef({
    position: new Animated.Value(0),
    opacity: new Animated.Value(0),
  }).current;
  const [isToolbarVisible, setIsToolbarVisible] = React.useState(false);
  const [isAddBlockVisible, setIsAddBlockVisible] = React.useState(false);

  const handleShowAddBlock = React.useCallback(
    async (index: number) => {
      if (editorContentRef.current) {
        const rangeBounds = await editorContentRef.current.getBounds({
          index,
          length: 0,
        });

        const value = rangeBounds.top - 12;

        if (isAddBlockVisible) {
          Animated.parallel([
            Animated.spring(sidebar.position, {
              toValue: value,
              useNativeDriver: true,
              bounciness: 0,
              speed: 300,
            }),
            Animated.timing(sidebar.opacity, {
              toValue: 1,
              useNativeDriver: true,
              duration: 100,
            }),
          ]).start();
        } else {
          setIsAddBlockVisible(true);
          sidebar.position.setValue(value);
          Animated.timing(sidebar.opacity, {
            toValue: 1,
            useNativeDriver: true,
            duration: 100,
          }).start();
        }
      }
    },
    [sidebar, isAddBlockVisible],
  );

  const handleHideAddBlock = React.useCallback(async () => {
    Animated.timing(sidebar.opacity, {
      toValue: 0,
      useNativeDriver: true,
      duration: 100,
    }).start(() => {
      setIsAddBlockVisible(false);
    });
  }, [sidebar]);

  const handleShowToolbar = React.useCallback(
    async (range: Range) => {
      if (editorContentRef.current) {
        const rangeBounds = await editorContentRef.current.getBounds(range);
        toolbar.position.setValue({
          x: Math.max(
            rangeBounds.left + rangeBounds.width / 2 - TOOLBAR_WIDTH / 2,
            0,
          ),
          y: rangeBounds.top - TOOLBAR_HEIGHT - 16,
        });

        setIsToolbarVisible(true);

        Animated.timing(toolbar.opacity, {
          toValue: 1,
          useNativeDriver: true,
          duration: 100,
        }).start();
      }
    },
    [toolbar],
  );

  const handleHideToolbar = React.useCallback(async () => {
    Animated.timing(toolbar.opacity, {
      toValue: 0,
      useNativeDriver: true,
      duration: 100,
    }).start(() => {
      setIsToolbarVisible(false);
    });
  }, [toolbar]);

  const handleTextChange = React.useCallback(
    async (_event: TextChangeEvent) => {
      if (editorContentRef.current) {
        const range = await editorContentRef.current.getSelection();
        const line = await editorContentRef.current.getLine(range.index);

        if (line?.isEmpty) {
          handleShowAddBlock(range.index);
        }
      }
    },
    [handleShowAddBlock],
  );

  const handleSelectionChange = React.useCallback(
    async (event: SelectionChangeEvent) => {
      console.log(event);
      const { range } = event;

      if (editorContentRef.current) {
        if (range.length === 0) {
          handleHideToolbar();
          const line = await editorContentRef.current.getLine(range.index);

          if (line?.isEmpty) {
            handleShowAddBlock(range.index);
          } else {
            handleHideAddBlock();
          }
        } else {
          handleShowToolbar(range);
        }
      }
    },
    [
      editorContentRef,
      handleHideAddBlock,
      handleHideToolbar,
      handleShowToolbar,
      handleShowAddBlock,
    ],
  );

  return (
    <Container expanded paddingHorizontal={48}>
      <Animated.View
        style={[
          styles.toolbar,
          isToolbarVisible ? styles.visible : styles.invisible,
          theme.container.shadow,
          {
            borderColor: theme.border.color.default,
            backgroundColor: theme.container.color.content,
            transform: [
              { translateX: toolbar.position.x },
              { translateY: toolbar.position.y },
            ],
            opacity: toolbar.opacity,
          },
        ]}
      >
        <Toolbar />
      </Animated.View>
      <Animated.View
        style={[
          styles.addBlockWrapper,
          isAddBlockVisible ? styles.visible : styles.invisible,
          {
            transform: [{ translateY: sidebar.position }],
            opacity: sidebar.opacity,
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

interface SidebarControl {
  icon: IconName;
  onPress: () => void;
  x: Animated.Value;
}

function AddBlock() {
  const theme = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const controls = React.useRef<SidebarControl[]>([
    { icon: 'bold' as const, onPress: () => {}, x: new Animated.Value(0) },
    { icon: 'italic' as const, onPress: () => {}, x: new Animated.Value(0) },
    { icon: 'code' as const, onPress: () => {}, x: new Animated.Value(0) },
  ]).current;

  const handleToggleSidebar = React.useCallback(() => {
    if (isOpen) {
      Animated.stagger(
        30,
        controls.map((c) =>
          Animated.spring(c.x, {
            toValue: 0,
            bounciness: 0,
            speed: 100,
            useNativeDriver: true,
          }),
        ),
      ).start(() => {
        setIsOpen(false);
      });
    } else {
      setIsOpen(true);
      Animated.stagger(
        30,
        controls.map((c, index) =>
          Animated.spring(c.x, {
            toValue: (index + 1) * 40,
            bounciness: 0,
            speed: 100,
            useNativeDriver: true,
          }),
        ),
      ).start();
    }
  }, [controls, isOpen]);

  return (
    <Row>
      <Button
        onPress={handleToggleSidebar}
        style={[styles.addBlock, { borderColor: theme.border.color.default }]}
      >
        <Icon name="plus" color="muted" />
      </Button>
      <Spacing width={8} />
      {isOpen && (
        <Row>
          {controls.map((c) => {
            const { onPress, icon, x } = c;

            return (
              <Animated.View
                key={icon}
                style={[
                  styles.sidebarControlButton,
                  { transform: [{ translateX: x }] },
                ]}
              >
                <ToolbarButton icon={icon} onPress={onPress} />
              </Animated.View>
            );
          })}
        </Row>
      )}
    </Row>
  );
}

function Toolbar() {
  return (
    <Row>
      <ToolbarButton icon="bold" onPress={() => {}} />
      <ToolbarButton icon="italic" onPress={() => {}} />
      <ToolbarButton icon="link" onPress={() => {}} />
      <Divider orientation="vertical" />
      <ToolbarButton icon="font" size="sm" onPress={() => {}} />
      <ToolbarButton icon="font" size="md" onPress={() => {}} />
      <ToolbarButton icon="quote" onPress={() => {}} />
      <ToolbarButton icon="code" onPress={() => {}} />
    </Row>
  );
}

interface ToolbarToggleProps {
  icon: IconName;
  size?: TextSize;
  onPress: () => void;
}

export function ToolbarButton(props: ToolbarToggleProps) {
  const { onPress, icon, size } = props;

  return (
    <Button style={styles.toolbarButton} onPress={onPress}>
      <Icon name={icon} size={size} />
    </Button>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    width: TOOLBAR_WIDTH,
    position: 'absolute',
    borderRadius: tokens.radius,
  },
  addBlockWrapper: {
    width: SIDEBAR_CONTROLS_HEIGHT,
    height: SIDEBAR_CONTROLS_HEIGHT,
    position: 'absolute',
    left: 0,
  },
  addBlock: {
    width: SIDEBAR_CONTROLS_HEIGHT,
    height: SIDEBAR_CONTROLS_HEIGHT,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 999,
    zIndex: 1,
  },
  visible: {
    display: 'flex',
  },
  invisible: {
    display: 'none',
  },
  sidebarControlButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    left: -48,
  },
  toolbarButton: {
    flex: 1,
    height: TOOLBAR_HEIGHT,
    width: TOOLBAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: tokens.radius,
  },
});
