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
  Text,
} from '../../components';
import { useTheme, tokens } from '../../theme';
import type {
  TextChangeEvent,
  SelectionChangeEvent,
  Range,
  Formats,
} from './types';
import { between } from '../../utils/numbers';
import { useScrollViewState } from '../../utils/scrollview';

interface EditorProps {
  initialContent?: Delta;
}

const TOOLBAR_WIDTH = 280;
const TOOLBAR_HEIGHT = 40;
const SIDEBAR_CONTROLS_HEIGHT = 40;

type HoverableType = 'toolbar' | 'link';

interface HoverableState {
  isVisible: boolean;
  type: HoverableType;
  position: Animated.ValueXY;
  opacity: Animated.Value;
}

interface SidebarState {
  index: number;
  isVisible: boolean;
  isControlsVisible: boolean;
  position: Animated.Value;
  opacity: Animated.Value;
}

export function Editor(props: EditorProps) {
  const {
    initialContent = new Delta()
      .insert(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque laoreet nulla tortor, ut consequat metus imperdiet eu. Aenean viverra non mi convallis auctor. Nullam felis elit, varius ut maximus sed, luctus ac arcu. Sed tincidunt, nibh eget ultrices tincidunt, felis eros commodo felis, vel ornare nibh sapien vel metus. Vivamus eu tristique sapien. Pellentesque imperdiet porttitor velit at pharetra. Morbi sem orci, dictum id sapien vel, ullamcorper semper neque.\n',
      )
      .insert(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque laoreet nulla tortor, ut consequat metus imperdiet eu. Aenean viverra non mi convallis auctor. Nullam felis elit, varius ut maximus sed, luctus ac arcu. Sed tincidunt, nibh eget ultrices tincidunt, felis eros commodo felis, vel ornare nibh sapien vel metus. Vivamus eu tristique sapien. Pellentesque imperdiet porttitor velit at pharetra. Morbi sem orci, dictum id sapien vel, ullamcorper semper neque.\n',
      )
      .insert(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque laoreet nulla tortor, ut consequat metus imperdiet eu. Aenean viverra non mi convallis auctor. Nullam felis elit, varius ut maximus sed, luctus ac arcu. Sed tincidunt, nibh eget ultrices tincidunt, felis eros commodo felis, vel ornare nibh sapien vel metus. Vivamus eu tristique sapien. Pellentesque imperdiet porttitor velit at pharetra. Morbi sem orci, dictum id sapien vel, ullamcorper semper neque.\n',
      )
      .insert(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque laoreet nulla tortor, ut consequat metus imperdiet eu. Aenean viverra non mi convallis auctor. Nullam felis elit, varius ut maximus sed, luctus ac arcu. Sed tincidunt, nibh eget ultrices tincidunt, felis eros commodo felis, vel ornare nibh sapien vel metus. Vivamus eu tristique sapien. Pellentesque imperdiet porttitor velit at pharetra. Morbi sem orci, dictum id sapien vel, ullamcorper semper neque.\n',
      )
      .insert(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque laoreet nulla tortor, ut consequat metus imperdiet eu. Aenean viverra non mi convallis auctor. Nullam felis elit, varius ut maximus sed, luctus ac arcu. Sed tincidunt, nibh eget ultrices tincidunt, felis eros commodo felis, vel ornare nibh sapien vel metus. Vivamus eu tristique sapien. Pellentesque imperdiet porttitor velit at pharetra. Morbi sem orci, dictum id sapien vel, ullamcorper semper neque.\n',
      )
      .insert(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque laoreet nulla tortor, ut consequat metus imperdiet eu. Aenean viverra non mi convallis auctor. Nullam felis elit, varius ut maximus sed, luctus ac arcu. Sed tincidunt, nibh eget ultrices tincidunt, felis eros commodo felis, vel ornare nibh sapien vel metus. Vivamus eu tristique sapien. Pellentesque imperdiet porttitor velit at pharetra. Morbi sem orci, dictum id sapien vel, ullamcorper semper neque.\n',
      )
      .insert('\n'),
  } = props;
  const theme = useTheme();
  const editorContentRef = React.useRef<EditorContentInstance | null>(null);
  const scrollViewRef = React.useRef<ScrollView | null>(null);
  const [hoverable, setHoverable] = React.useState<HoverableState>({
    isVisible: false,
    type: 'toolbar',
    position: new Animated.ValueXY(),
    opacity: new Animated.Value(0),
  });
  const [sidebar, setSidebar] = React.useState<SidebarState>({
    index: 0,
    isVisible: false,
    isControlsVisible: false,
    position: new Animated.Value(0),
    opacity: new Animated.Value(0),
  });
  const [activeFormats, setActiveFormats] = React.useState<Formats>({});
  const [linkPreviewURL, setLinkPreviewURL] = React.useState('');
  const { scrollViewState, handlers: scrollHandlers } = useScrollViewState();

  const handleHideSidebarControls = React.useCallback(() => {
    setSidebar((prev) => ({
      ...prev,
      isControlsVisible: false,
    }));
  }, []);

  const handleShowSidebarControls = React.useCallback(() => {
    setSidebar((prev) => ({
      ...prev,
      isControlsVisible: true,
    }));
  }, []);

  const handleShowAddBlock = React.useCallback(
    async (index: number) => {
      if (editorContentRef.current) {
        const rangeBounds = await editorContentRef.current.getBounds({
          index,
          length: 0,
        });

        const value = rangeBounds.top - 12;

        if (sidebar.isVisible) {
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
          setSidebar((prev) => ({
            ...prev,
            index,
            isVisible: true,
          }));
          Animated.timing(sidebar.opacity, {
            toValue: 1,
            useNativeDriver: true,
            duration: 100,
          }).start();
        }
      }
    },
    [sidebar],
  );

  const handleHideAddBlock = React.useCallback(() => {
    Animated.timing(sidebar.opacity, {
      toValue: 0,
      useNativeDriver: true,
      duration: 100,
    }).start(() => {
      setSidebar((prev) => ({
        ...prev,
        index: 0,
        isVisible: false,
        isControlsVisible: false,
      }));
    });
  }, [sidebar]);

  const getHoverablePosition = React.useCallback(async (range: Range) => {
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

  const handleShowHoverable = React.useCallback(
    async (range: Range, type: HoverableType) => {
      if (editorContentRef.current) {
        const position = await getHoverablePosition(range);

        if (!position) {
          return;
        }

        const { x, y } = position;

        hoverable.position.setValue({
          x,
          y,
        });

        setHoverable((prev) => ({
          ...prev,
          type,
          isVisible: true,
        }));

        Animated.timing(hoverable.opacity, {
          toValue: 1,
          useNativeDriver: true,
          duration: 100,
        }).start();
      }
    },
    [hoverable, getHoverablePosition],
  );

  const handleUpdateHoverablePositionIfNeeded = React.useCallback(
    async (range: Range) => {
      const position = await getHoverablePosition(range);

      if (!position) {
        return;
      }

      const { x, y } = position;
      const prevX = (hoverable.position.x as any)._value;
      const prevY = (hoverable.position.y as any)._value;

      if (x !== prevX || y !== prevY) {
        Animated.spring(hoverable.position, {
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
    [hoverable, getHoverablePosition],
  );

  const handleHideHoverable = React.useCallback(async () => {
    if (hoverable.isVisible) {
      Animated.timing(hoverable.opacity, {
        toValue: 0,
        useNativeDriver: true,
        duration: 100,
      }).start(() => {
        setHoverable((prev) => ({
          ...prev,
          isVisible: false,
        }));
      });
    }
  }, [hoverable]);

  const handleTextChange = React.useCallback(
    async (_event: TextChangeEvent) => {
      if (editorContentRef.current) {
        // These take around 3-6ms
        const range = await editorContentRef.current.getSelection();
        const line = await editorContentRef.current.getLine(range.index);
        const rangeBounds = await editorContentRef.current.getBounds(range);

        if (rangeBounds.bottom > scrollViewState.contentHeight) {
          scrollViewRef.current?.scrollTo({ y: rangeBounds.bottom });
        }

        if (range.length === 0) {
          handleHideHoverable();
        } else {
          const formats = await editorContentRef.current.getFormats();
          setActiveFormats(formats);
          handleUpdateHoverablePositionIfNeeded(range);
        }

        if (line?.isEmpty) {
          handleShowAddBlock(range.index);
        } else if (sidebar.isVisible) {
          handleHideAddBlock();
        }
      }
    },
    [
      handleShowAddBlock,
      handleHideAddBlock,
      handleHideHoverable,
      handleUpdateHoverablePositionIfNeeded,
      sidebar,
      scrollViewState,
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
          handleHideHoverable();
          handleHideSidebarControls();
          const line = await editorContentRef.current.getLine(range.index);
          const formats = await editorContentRef.current.getFormats();

          if (formats.link) {
            setLinkPreviewURL(formats.link);
            handleShowHoverable(range, 'link');
          }

          if (line?.isEmpty) {
            handleShowAddBlock(range.index);
          } else {
            handleHideAddBlock();
          }
        } else {
          handleShowHoverable(range, 'toolbar');
          const formats = await editorContentRef.current.getFormats();
          setActiveFormats(formats);
        }
      }
    },
    [
      editorContentRef,
      handleHideSidebarControls,
      handleHideAddBlock,
      handleHideHoverable,
      handleShowHoverable,
      handleShowAddBlock,
    ],
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

  const handleLink = React.useCallback(
    (url: string) => {
      editorContentRef.current?.link(url);
      handleHideHoverable();
    },
    [handleHideHoverable],
  );

  const handleHeadingMedium = React.useCallback(() => {
    editorContentRef.current?.heading(2);
  }, []);

  const handleHeadingLarge = React.useCallback(() => {
    editorContentRef.current?.heading(1);
  }, []);

  const handleCode = React.useCallback(() => {
    editorContentRef.current?.code();
  }, []);

  const handleInsertList = React.useCallback(() => {
    editorContentRef.current?.insertList(sidebar.index);
  }, [sidebar]);

  const handleInsertBlockquote = React.useCallback(() => {
    editorContentRef.current?.insertBlockquote(sidebar.index);
  }, [sidebar]);

  const handleInsertCodeBlock = React.useCallback(() => {
    editorContentRef.current?.insertCodeBlock(sidebar.index);
  }, [sidebar]);

  const handleInsertImage = React.useCallback(
    (url: string) => {
      editorContentRef.current?.insertImage(sidebar.index, url);
    },
    [sidebar],
  );

  const handleInsertVideo = React.useCallback(
    (url: string) => {
      editorContentRef.current?.insertVideo(sidebar.index, url);
    },
    [sidebar],
  );

  return (
    <ScrollView ref={scrollViewRef} scrollEventThrottle={0} {...scrollHandlers}>
      <Container expanded paddingHorizontal={48}>
        {hoverable.isVisible && (
          <Animated.View
            style={[
              styles.toolbar,
              theme.container.shadow,
              {
                borderColor: theme.border.color.default,
                backgroundColor: theme.container.color.content,
                transform: [
                  { translateX: hoverable.position.x },
                  { translateY: hoverable.position.y },
                ],
                opacity: hoverable.opacity,
              },
            ]}
          >
            {hoverable.type === 'toolbar' && (
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
            )}
            {hoverable.type === 'link' && <LinkPreview url={linkPreviewURL} />}
          </Animated.View>
        )}
        {sidebar.isVisible && (
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
              onSidebarControls={handleShowSidebarControls}
              onCloseSidebarControls={handleHideSidebarControls}
              isSidebarControlsVisible={sidebar.isControlsVisible}
              onInsertList={handleInsertList}
              onInsertBlockquote={handleInsertBlockquote}
              onInsertCodeBlock={handleInsertCodeBlock}
              onInsertImage={handleInsertImage}
              onInsertVideo={handleInsertVideo}
            />
          </Animated.View>
        )}
        <EditorContent
          ref={editorContentRef}
          onTextChange={handleTextChange}
          onSelectionChange={handleSelectionChange}
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
  onSidebarControls: () => void;
  onCloseSidebarControls: () => void;
  onInsertList: () => void;
  onInsertBlockquote: () => void;
  onInsertCodeBlock: () => void;
  onInsertImage: (url: string) => void;
  onInsertVideo: (url: string) => void;
}

function AddBlock(props: AddBlockProps) {
  const {
    isSidebarControlsVisible,
    onSidebarControls,
    onCloseSidebarControls,
    onInsertList,
    onInsertBlockquote,
    onInsertCodeBlock,
    onInsertImage,
    onInsertVideo,
  } = props;
  const theme = useTheme();

  const controls = React.useRef<SidebarControl[]>([
    { icon: 'list' as const, onPress: onInsertList, x: new Animated.Value(0) },
    { icon: 'image' as const, onPress: () => {}, x: new Animated.Value(0) },
    { icon: 'video' as const, onPress: () => {}, x: new Animated.Value(0) },
    {
      icon: 'quote' as const,
      onPress: onInsertBlockquote,
      x: new Animated.Value(0),
    },
    {
      icon: 'code' as const,
      onPress: onInsertCodeBlock,
      x: new Animated.Value(0),
    },
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
      onCloseSidebarControls();
    } else {
      onSidebarControls();
    }
  }, [onCloseSidebarControls, onSidebarControls, isSidebarControlsVisible]);

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
  const [isAddingLink, setIsAddingLink] = React.useState(false);
  const [link, setLink] = React.useState('');

  const handlePressLink = React.useCallback(() => {
    if (activeFormats.link) {
      onLink('');
    } else {
      setIsAddingLink(true);
    }
  }, [onLink, activeFormats.link]);

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
            <Icon
              name="link"
              color={activeFormats.link ? 'primary' : 'default'}
            />
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

interface LinkPreviewProps {
  url: string;
}

function LinkPreview(props: LinkPreviewProps) {
  const { url } = props;
  return (
    <Container padding={8}>
      <Text decoration="underline">{url}</Text>
    </Container>
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
    zIndex: 1,
  },
  addBlockWrapper: {
    width: SIDEBAR_CONTROLS_HEIGHT,
    height: SIDEBAR_CONTROLS_HEIGHT,
    position: 'absolute',
    left: 0,
    zIndex: 1,
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
