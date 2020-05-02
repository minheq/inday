import Delta from 'quill-delta';
import React from 'react';
import { Animated, StyleSheet, ScrollView, TextInput } from 'react-native';
import { EditorContent, EditorContentInstance } from './editor_content';
import {
  IconName,
  Icon,
  Container,
  Row,
  Button,
  Spacing,
  CloseButton,
} from '../../components';
import { useTheme, tokens } from '../../theme';
import type {
  TextChangeEvent,
  SelectionChangeEvent,
  Range,
  ResizeEvent,
  Formats,
} from './types';
import { between } from '../../utils/numbers';

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
  const scrollViewRef = React.useRef<ScrollView | null>(null);
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
  const [activeFormats, setActiveFormats] = React.useState<Formats>({});
  const [
    isSidebarControlsVisible,
    setIsSidebarControlsVisible,
  ] = React.useState(false);

  const handleHideSidebarControls = React.useCallback(() => {
    setIsSidebarControlsVisible(false);
  }, [setIsSidebarControlsVisible]);

  const handleShowSidebarControls = React.useCallback(() => {
    setIsSidebarControlsVisible(true);
  }, [setIsSidebarControlsVisible]);

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
          sidebar.position.setValue(value);
          setIsAddBlockVisible(true);
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

  const handleHideAddBlock = React.useCallback(() => {
    Animated.timing(sidebar.opacity, {
      toValue: 0,
      useNativeDriver: true,
      duration: 100,
    }).start(() => {
      handleHideSidebarControls();
      setIsAddBlockVisible(false);
    });
  }, [sidebar, handleHideSidebarControls]);

  const getToolbarPosition = React.useCallback(async (range: Range) => {
    if (editorContentRef.current) {
      const rangeBounds = await editorContentRef.current.getBounds(range);
      let y = 0;

      if (rangeBounds.top - TOOLBAR_HEIGHT - 16 < 16) {
        y = rangeBounds.top + TOOLBAR_HEIGHT - 14;
      } else {
        y = rangeBounds.top - TOOLBAR_HEIGHT - 8;
      }

      const x = between(
        rangeBounds.left + rangeBounds.width / 2 - TOOLBAR_WIDTH / 2,
        -40,
        440,
      );

      return { x, y };
    }

    return null;
  }, []);

  const handleShowToolbar = React.useCallback(
    async (range: Range) => {
      if (editorContentRef.current) {
        const position = await getToolbarPosition(range);

        if (!position) {
          return;
        }

        const { x, y } = position;

        toolbar.position.setValue({
          x,
          y,
        });

        setIsToolbarVisible(true);

        Animated.timing(toolbar.opacity, {
          toValue: 1,
          useNativeDriver: true,
          duration: 100,
        }).start();
      }
    },
    [toolbar, getToolbarPosition],
  );

  const handleUpdateToolbarIfNeeded = React.useCallback(
    async (range: Range) => {
      const position = await getToolbarPosition(range);

      if (!position) {
        return;
      }

      const { x, y } = position;
      const prevX = (toolbar.position.x as any)._value;
      const prevY = (toolbar.position.y as any)._value;

      if (x !== prevX || y !== prevY) {
        Animated.spring(toolbar.position, {
          toValue: {
            x,
            y,
          },
          useNativeDriver: true,
          bounciness: 0,
          speed: 300,
        }).start();
      }
    },
    [toolbar, getToolbarPosition],
  );

  const handleHideToolbar = React.useCallback(async () => {
    if (isToolbarVisible) {
      Animated.timing(toolbar.opacity, {
        toValue: 0,
        useNativeDriver: true,
        duration: 100,
      }).start(() => {
        setIsToolbarVisible(false);
      });
    }
  }, [toolbar, isToolbarVisible]);

  const handleTextChange = React.useCallback(
    async (_event: TextChangeEvent) => {
      if (editorContentRef.current) {
        const range = await editorContentRef.current.getSelection();
        const line = await editorContentRef.current.getLine(range.index);

        if (range.length === 0) {
          handleHideToolbar();
        } else {
          const formats = await editorContentRef.current.getFormats();
          setActiveFormats(formats);
          handleUpdateToolbarIfNeeded(range);
        }

        if (line?.isEmpty) {
          handleShowAddBlock(range.index);
        } else if (isAddBlockVisible) {
          handleHideAddBlock();
        }
      }
    },
    [
      handleShowAddBlock,
      handleHideAddBlock,
      handleHideToolbar,
      handleUpdateToolbarIfNeeded,
      isAddBlockVisible,
    ],
  );

  const handleSelectionChange = React.useCallback(
    async (event: SelectionChangeEvent) => {
      const { range } = event;

      if (range === null) {
        handleHideAddBlock();
        return;
      }

      if (editorContentRef.current) {
        if (range.length === 0) {
          handleHideToolbar();
          handleHideSidebarControls();
          const line = await editorContentRef.current.getLine(range.index);

          if (line?.isEmpty) {
            handleShowAddBlock(range.index);
          } else {
            handleHideAddBlock();
          }
        } else {
          handleShowToolbar(range);
          const formats = await editorContentRef.current.getFormats();
          setActiveFormats(formats);
        }
      }
    },
    [
      editorContentRef,
      handleHideSidebarControls,
      handleHideAddBlock,
      handleHideToolbar,
      handleShowToolbar,
      handleShowAddBlock,
    ],
  );

  const handleResize = React.useCallback(
    (event: ResizeEvent) => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: event.size.height });
      }
    },
    [scrollViewRef],
  );

  const handleBold = React.useCallback(() => {
    editorContentRef.current?.bold();
  }, []);

  const handleItalic = React.useCallback(() => {
    editorContentRef.current?.italic();
  }, []);

  const handleStrikethrough = React.useCallback(() => {
    editorContentRef.current?.strikethrough();
  }, []);

  const handleLink = React.useCallback((url: string) => {
    editorContentRef.current?.link(url);
  }, []);

  const handleHeadingMedium = React.useCallback(() => {
    editorContentRef.current?.heading(2);
  }, []);

  const handleHeadingLarge = React.useCallback(() => {
    editorContentRef.current?.heading(1);
  }, []);

  const handleCode = React.useCallback(() => {
    editorContentRef.current?.code();
  }, []);

  return (
    <ScrollView ref={scrollViewRef}>
      <Container expanded paddingHorizontal={48}>
        {isToolbarVisible && (
          <Animated.View
            style={[
              styles.toolbar,
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
            <Toolbar
              activeFormats={activeFormats}
              onBold={handleBold}
              onItalic={handleItalic}
              onStrikethrough={handleStrikethrough}
              onLink={handleLink}
              onHeadingMedium={handleHeadingMedium}
              onHeadingLarge={handleHeadingLarge}
              onCode={handleCode}
            />
          </Animated.View>
        )}
        {isAddBlockVisible && (
          <Animated.View
            style={[
              styles.addBlockWrapper,
              {
                transform: [{ translateY: sidebar.position }],
                opacity: sidebar.opacity,
              },
            ]}
          >
            <AddBlock
              onOpen={handleShowSidebarControls}
              onClose={handleHideSidebarControls}
              isSidebarControlsVisible={isSidebarControlsVisible}
            />
          </Animated.View>
        )}
        <EditorContent
          ref={editorContentRef}
          onTextChange={handleTextChange}
          onSelectionChange={handleSelectionChange}
          onResize={handleResize}
          initialContent={initialContent}
        />
      </Container>
    </ScrollView>
  );
}

interface SidebarControl {
  icon: IconName;
  onPress: () => void;
  x: Animated.Value;
}

interface AddBlockProps {
  isSidebarControlsVisible: boolean;
  onOpen: () => void;
  onClose: () => void;
}

function AddBlock(props: AddBlockProps) {
  const { isSidebarControlsVisible, onOpen, onClose } = props;
  const theme = useTheme();

  const controls = React.useRef<SidebarControl[]>([
    { icon: 'image' as const, onPress: () => {}, x: new Animated.Value(0) },
    { icon: 'video' as const, onPress: () => {}, x: new Animated.Value(0) },
    { icon: 'quote' as const, onPress: () => {}, x: new Animated.Value(0) },
    { icon: 'code' as const, onPress: () => {}, x: new Animated.Value(0) },
  ]).current;

  React.useEffect(() => {
    if (isSidebarControlsVisible) {
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
    } else {
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
      ).start();
    }
  }, [controls, isSidebarControlsVisible]);

  const handleToggleSidebar = React.useCallback(() => {
    if (isSidebarControlsVisible) {
      onClose();
    } else {
      onOpen();
    }
  }, [onClose, onOpen, isSidebarControlsVisible]);

  return (
    <Row>
      <Button
        onPress={handleToggleSidebar}
        style={[styles.addBlock, { borderColor: theme.border.color.default }]}
      >
        <Icon name="plus" color="muted" />
      </Button>
      <Spacing width={8} />
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
              <Button style={styles.toolbarButton} onPress={onPress}>
                <Icon name={icon} />
              </Button>
            </Animated.View>
          );
        })}
      </Row>
    </Row>
  );
}

interface ToolbarProps {
  activeFormats: Formats;
  onBold: () => void;
  onItalic: () => void;
  onStrikethrough: () => void;
  onLink: (url: string) => void;
  onHeadingMedium: () => void;
  onHeadingLarge: () => void;
  onCode: () => void;
}

function Toolbar(props: ToolbarProps) {
  const {
    activeFormats,
    onBold,
    onItalic,
    onStrikethrough,
    onLink,
    onHeadingMedium,
    onHeadingLarge,
    onCode,
  } = props;
  console.log(activeFormats, 'activeFormats');

  const [isAddingLink, setIsAddingLink] = React.useState(false);
  const [link, setLink] = React.useState('');

  const handlePressLink = React.useCallback(() => {
    setIsAddingLink(true);
  }, []);

  const handleCloseLink = React.useCallback(() => {
    setIsAddingLink(false);
  }, []);

  const handleChangeLink = React.useCallback((url: string) => {
    setLink(url);
  }, []);

  const handleSubmitLink = React.useCallback(() => {
    onLink(link);
  }, [link, onLink]);

  return (
    <Row>
      {isAddingLink ? (
        <>
          <Container expanded flex={1}>
            <TextInput
              autoFocus
              placeholder="Enter link"
              value={link}
              onChangeText={handleChangeLink}
              style={[
                styles.linkInput,
                // @ts-ignore
                webStyles.outline,
              ]}
            />
          </Container>
          <Button style={styles.linkSubmit} onPress={handleSubmitLink}>
            <Icon name="check" size="lg" />
          </Button>
          <CloseButton onPress={handleCloseLink} />
        </>
      ) : (
        <>
          <Button style={styles.toolbarButton} onPress={onBold}>
            <Icon
              name="bold"
              color={activeFormats.bold ? 'primary' : 'default'}
            />
          </Button>
          <Button style={styles.toolbarButton} onPress={onItalic}>
            <Icon
              name="italic"
              color={activeFormats.italic ? 'primary' : 'default'}
            />
          </Button>
          <Button style={styles.toolbarButton} onPress={onStrikethrough}>
            <Icon
              name="strikethrough"
              size="lg"
              color={activeFormats.strike ? 'primary' : 'default'}
            />
          </Button>
          <Button style={styles.toolbarButton} onPress={handlePressLink}>
            <Icon name="link" />
          </Button>
          <Button style={styles.toolbarButton} onPress={onHeadingMedium}>
            <Icon
              name="font"
              size="sm"
              color={activeFormats.header === 2 ? 'primary' : 'default'}
            />
          </Button>
          <Button style={styles.toolbarButton} onPress={onHeadingLarge}>
            <Icon
              name="font"
              color={activeFormats.header === 1 ? 'primary' : 'default'}
            />
          </Button>
          <Button style={styles.toolbarButton} onPress={onCode}>
            <Icon
              name="code"
              color={activeFormats.code ? 'primary' : 'default'}
            />
          </Button>
        </>
      )}
    </Row>
  );
}

const webStyles = {
  outline: {
    outline: 'none',
  },
};

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
  linkInput: {
    height: TOOLBAR_HEIGHT,
    paddingHorizontal: 8,
  },
  linkSubmit: {
    width: TOOLBAR_HEIGHT,
    height: TOOLBAR_HEIGHT,
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
