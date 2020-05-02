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
  const toolbar = React.useRef(new Animated.ValueXY()).current;
  const sidebar = React.useRef(new Animated.Value(0)).current;
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

        setIsAddBlockVisible(true);
        sidebar.setValue(value);
      }
    },
    [sidebar],
  );

  const handleHideAddBlock = React.useCallback(async () => {
    setIsAddBlockVisible(false);
  }, []);

  const handleShowToolbar = React.useCallback(
    async (range: Range) => {
      if (editorContentRef.current) {
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
    },
    [toolbar],
  );

  const handleHideToolbar = React.useCallback(async () => {
    setIsToolbarVisible(false);
  }, []);

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
            transform: [{ translateX: toolbar.x }, { translateY: toolbar.y }],
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
  const theme = useTheme();

  return (
    <Button
      style={[styles.addBlock, { borderColor: theme.border.color.default }]}
    >
      <Icon name="plus" color="muted" />
    </Button>
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
    borderRadius: 999,
  },
  visible: {
    display: 'flex',
  },
  invisible: {
    display: 'none',
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
