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
  CloseButton,
  Text,
} from '../../components';
import { useTheme, tokens, TextSize } from '../../theme';
import type {
  TextChangeEvent,
  SelectionChangeEvent,
  Range,
  Formats,
  HeadingSize,
} from './types';
import { between } from '../../utils/numbers';
import { useScrollViewState } from '../../utils/scrollview';

interface EditorProps {
  initialContent?: Delta;
}

const TOOLBAR_WIDTH = 280;
const TOOLBAR_HEIGHT = 40;
const SIDEBAR_CONTROLS_HEIGHT = 40;

type HoverableType = 'link';

interface HoverableState {
  isVisible: boolean;
  type: HoverableType;
  position: Animated.ValueXY;
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
  const { scrollViewState, handlers: scrollHandlers } = useScrollViewState();
  const editorContentRef = React.useRef<EditorContentInstance | null>(null);
  const scrollViewRef = React.useRef<ScrollView | null>(null);
  const [hoverable, setHoverable] = React.useState<HoverableState>({
    isVisible: false,
    type: 'link',
    position: new Animated.ValueXY(),
    opacity: new Animated.Value(0),
  });
  const [activeFormats, setActiveFormats] = React.useState<Formats>({});
  const [linkPreviewURL, setLinkPreviewURL] = React.useState('');

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
        const range = await editorContentRef.current.getSelection();
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
      }
    },
    [
      handleHideHoverable,
      handleUpdateHoverablePositionIfNeeded,
      scrollViewState,
    ],
  );

  const handleSelectionChange = React.useCallback(
    async (event: SelectionChangeEvent) => {
      const { range } = event;

      if (editorContentRef.current) {
        editorContentRef.current.selection = range;

        if (range === null) {
          return;
        }
        if (range.length === 0) {
          handleHideHoverable();
          const formats = await editorContentRef.current.getFormats();

          if (formats.link) {
            setLinkPreviewURL(formats.link);
            handleShowHoverable(range, 'link');
          }
        } else {
          const formats = await editorContentRef.current.getFormats();
          setActiveFormats(formats);
        }
      }
    },
    [editorContentRef, handleHideHoverable, handleShowHoverable],
  );

  const handleFormatBold = React.useCallback(() => {
    editorContentRef.current?.formatBold();
  }, []);

  const handleFormatItalic = React.useCallback(() => {
    editorContentRef.current?.formatItalic();
  }, []);

  const handleFormatStrike = React.useCallback(() => {
    editorContentRef.current?.formatStrike();
  }, []);

  const handleFormatLink = React.useCallback(
    (url: string) => {
      editorContentRef.current?.formatLink(url);
      handleHideHoverable();
    },
    [handleHideHoverable],
  );

  const handleFormatHeading = React.useCallback((size: HeadingSize) => {
    editorContentRef.current?.formatHeading(size);
  }, []);

  const handleFormatCode = React.useCallback(() => {
    editorContentRef.current?.formatCode();
  }, []);

  const handleFormatList = React.useCallback(() => {
    if (editorContentRef.current?.selection) {
      editorContentRef.current.formatList(
        editorContentRef.current.selection.index,
      );
    }
  }, []);

  const handleFormatBlockquote = React.useCallback(() => {
    if (editorContentRef.current?.selection) {
      editorContentRef.current.formatBlockquote(
        editorContentRef.current.selection.index,
      );
    }
  }, []);

  const handleFormatCodeBlock = React.useCallback(() => {
    if (editorContentRef.current?.selection) {
      editorContentRef.current.formatCodeBlock(
        editorContentRef.current.selection.index,
      );
    }
  }, []);

  const handleInsertImage = React.useCallback((url: string) => {
    if (editorContentRef.current?.selection) {
      editorContentRef.current.insertImage(
        editorContentRef.current.selection.index,
        url,
      );
    }
  }, []);

  const handleInsertVideo = React.useCallback((url: string) => {
    if (editorContentRef.current?.selection) {
      editorContentRef.current.insertVideo(
        editorContentRef.current.selection.index,
        url,
      );
    }
  }, []);

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
            {hoverable.type === 'link' && <LinkPreview url={linkPreviewURL} />}
          </Animated.View>
        )}
        <Toolbar
          activeFormats={activeFormats}
          onFormatBold={handleFormatBold}
          onFormatItalic={handleFormatItalic}
          onFormatStrike={handleFormatStrike}
          onFormatLink={handleFormatLink}
          onFormatHeading={handleFormatHeading}
          onFormatCode={handleFormatCode}
          onFormatList={handleFormatList}
          onFormatBlockquote={handleFormatBlockquote}
          onFormatCodeBlock={handleFormatCodeBlock}
          onInsertImage={handleInsertImage}
          onInsertVideo={handleInsertVideo}
        />
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

interface ToolbarProps {
  activeFormats: Formats;
  onFormatBold: () => void;
  onFormatItalic: () => void;
  onFormatStrike: () => void;
  onFormatLink: (url: string) => void;
  onFormatHeading: (size: HeadingSize) => void;
  onFormatCode: () => void;
  onFormatList: () => void;
  onFormatBlockquote: () => void;
  onFormatCodeBlock: () => void;
  onInsertImage: (url: string) => void;
  onInsertVideo: (url: string) => void;
}

function Toolbar(props: ToolbarProps) {
  const {
    activeFormats,
    onFormatBold,
    onFormatItalic,
    onFormatStrike,
    onFormatLink,
    onFormatHeading,
    onFormatCode,
    onFormatList,
    onFormatBlockquote,
    onFormatCodeBlock,
    onInsertImage,
    onInsertVideo,
  } = props;
  const [isAddingLink, setIsAddingLink] = React.useState(false);
  const [link, setLink] = React.useState('');

  const handlePressLink = React.useCallback(() => {
    if (activeFormats.link) {
      onFormatLink('');
    } else {
      setIsAddingLink(true);
    }
  }, [onFormatLink, activeFormats.link]);

  const handleCloseLink = React.useCallback(() => {
    setIsAddingLink(false);
  }, []);

  const handleChangeLink = React.useCallback((url: string) => {
    setLink(url);
  }, []);

  const handleFormatHeadingLarge = React.useCallback(() => {
    onFormatHeading(1);
  }, [onFormatHeading]);

  const handleFormatHeadingMedium = React.useCallback(() => {
    onFormatHeading(2);
  }, [onFormatHeading]);

  const handleSubmitLink = React.useCallback(() => {
    onFormatLink(link);
  }, [link, onFormatLink]);

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
          <ToolbarButton
            isActive={activeFormats.bold}
            icon="bold"
            onPress={onFormatBold}
          />
          <ToolbarButton
            isActive={activeFormats.italic}
            icon="italic"
            onPress={onFormatItalic}
          />
          <ToolbarButton
            isActive={activeFormats.strike}
            icon="strikethrough"
            size="lg"
            onPress={onFormatStrike}
          />
          <ToolbarButton
            isActive={!!activeFormats.link}
            icon="link"
            size="lg"
            onPress={handlePressLink}
          />
          <ToolbarButton
            isActive={activeFormats.header === 2}
            icon="font"
            size="sm"
            onPress={handleFormatHeadingMedium}
          />
          <ToolbarButton
            isActive={activeFormats.header === 1}
            icon="font"
            onPress={handleFormatHeadingLarge}
          />
          <ToolbarButton
            isActive={activeFormats.code}
            icon="code"
            onPress={onFormatCode}
          />
          <ToolbarButton
            isActive={activeFormats.list}
            icon="list"
            onPress={onFormatList}
          />
          <ToolbarButton
            isActive={activeFormats.blockquote}
            icon="quote"
            onPress={onFormatBlockquote}
          />
          <ToolbarButton
            isActive={activeFormats['code-block']}
            icon="codepen"
            onPress={onFormatCodeBlock}
          />
        </>
      )}
    </Row>
  );
}

interface ToolbarButtonProps {
  onPress: () => void;
  icon: IconName;
  size?: TextSize;
  isActive?: boolean;
}

function ToolbarButton(props: ToolbarButtonProps) {
  const { onPress, icon, size, isActive } = props;

  return (
    <Button style={styles.toolbarButton} onPress={onPress}>
      <Icon name={icon} size={size} color={isActive ? 'primary' : 'default'} />
    </Button>
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
