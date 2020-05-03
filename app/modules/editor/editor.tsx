import Delta from 'quill-delta';
import React from 'react';
import {
  Animated,
  StyleSheet,
  ScrollView,
  View,
  Clipboard,
} from 'react-native';
import { EditorContent, EditorContentInstance } from './editor_content';
import {
  IconName,
  Icon,
  Container,
  Row,
  Button,
  CloseButton,
  Text,
  TextInput,
  Dialog,
  Spacing,
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

type HoverableType = 'link';

interface HoverableState {
  isVisible: boolean;
  type: HoverableType;
  position: Animated.ValueXY;
  opacity: Animated.Value;
}

const LINK_PREVIEW_WIDTH = 280;
const LINK_PREVIEW_HEIGHT = 40;

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
  const [linkEdit, setLinkEdit] = React.useState({
    isOpen: false,
    initialValue: {
      text: '',
      url: '',
    },
  });

  const getHoverablePosition = React.useCallback(async (range: Range) => {
    if (editorContentRef.current) {
      const rangeBounds = await editorContentRef.current.getBounds(range);
      console.log(rangeBounds);

      let y = 0;

      if (rangeBounds.top - LINK_PREVIEW_HEIGHT - 16 < 16) {
        y = rangeBounds.top + LINK_PREVIEW_HEIGHT - 14;
      } else {
        y = rangeBounds.top - LINK_PREVIEW_HEIGHT - 8;
      }

      const x = between(
        rangeBounds.left + rangeBounds.width / 2 - LINK_PREVIEW_WIDTH / 2,
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

        const formats = await editorContentRef.current.getFormats();
        setActiveFormats(formats);

        if (range.length === 0) {
          handleHideHoverable();
        } else {
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

        const formats = await editorContentRef.current.getFormats();
        setActiveFormats(formats);

        if (range === null) {
          return;
        }

        if (range.length === 0) {
          handleHideHoverable();

          if (formats.link) {
            setLinkPreviewURL(formats.link);
            handleShowHoverable(range, 'link');
          }
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

  const handleRemoveLink = React.useCallback(async () => {
    editorContentRef.current?.removeLink();
  }, []);

  const handleFormatLink = React.useCallback(async () => {
    handleHideHoverable();

    if (editorContentRef.current && editorContentRef.current.selection) {
      const formats = await editorContentRef.current.getFormats();

      // If selection is collapsed
      if (editorContentRef.current.selection.length === 0) {
        if (formats.link) {
          const word = await editorContentRef.current.selectWord(
            editorContentRef.current.selection.index,
          );

          if (word) {
            setLinkEdit({
              isOpen: true,
              initialValue: {
                text: word.text,
                url: formats.link,
              },
            });
          }
        } else {
          setLinkEdit({
            isOpen: true,
            initialValue: {
              text: '',
              url: '',
            },
          });
        }

        return;
      }

      const initialText = await editorContentRef.current.getText(
        editorContentRef.current.selection,
      );

      setLinkEdit({
        isOpen: true,
        initialValue: {
          text: initialText || '',
          url: formats.link || '',
        },
      });
    }
  }, [handleHideHoverable]);

  const handleSubmitLinkEdit = React.useCallback((link: LinkValue) => {
    setLinkEdit({
      isOpen: false,
      initialValue: {
        text: '',
        url: '',
      },
    });

    if (editorContentRef.current?.selection) {
      editorContentRef.current.formatLink(
        editorContentRef.current.selection,
        link.text,
        link.url,
      );
    }
  }, []);

  const handleCloseLinkEdit = React.useCallback(() => {
    setLinkEdit({
      isOpen: false,
      initialValue: {
        text: '',
        url: '',
      },
    });
  }, []);

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

  const handleUndo = React.useCallback(() => {
    editorContentRef.current?.undo();
  }, []);

  const handleRedo = React.useCallback(() => {
    editorContentRef.current?.redo();
  }, []);

  return (
    <Container expanded>
      <Container paddingBottom={4}>
        <Toolbar
          activeFormats={activeFormats}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onFormatLink={handleFormatLink}
          onFormatBold={handleFormatBold}
          onFormatItalic={handleFormatItalic}
          onFormatStrike={handleFormatStrike}
          onFormatHeading={handleFormatHeading}
          onFormatCode={handleFormatCode}
          onFormatList={handleFormatList}
          onFormatBlockquote={handleFormatBlockquote}
          onFormatCodeBlock={handleFormatCodeBlock}
          onInsertImage={handleInsertImage}
          onInsertVideo={handleInsertVideo}
        />
      </Container>
      <Dialog
        animationType="slide"
        isOpen={linkEdit.isOpen}
        onRequestClose={handleCloseLinkEdit}
      >
        <LinkEdit
          initialValue={linkEdit.initialValue}
          onRequestClose={handleCloseLinkEdit}
          onSubmit={handleSubmitLinkEdit}
        />
      </Dialog>
      <ScrollView
        ref={scrollViewRef}
        scrollEventThrottle={0}
        {...scrollHandlers}
      >
        {hoverable.isVisible && (
          <Animated.View
            style={[
              styles.hoverable,
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
            {hoverable.type === 'link' && (
              <LinkPreview
                onFormatLink={handleFormatLink}
                onRemoveLink={handleRemoveLink}
                url={linkPreviewURL}
              />
            )}
          </Animated.View>
        )}
        <EditorContent
          ref={editorContentRef}
          onTextChange={handleTextChange}
          onSelectionChange={handleSelectionChange}
          initialContent={initialContent}
        />
      </ScrollView>
    </Container>
  );
}

interface ToolbarProps {
  activeFormats: Formats;
  onUndo: () => void;
  onRedo: () => void;
  onFormatBold: () => void;
  onFormatItalic: () => void;
  onFormatStrike: () => void;
  onFormatLink: () => void;
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
    onUndo,
    onRedo,
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

  const handleFormatHeadingLarge = React.useCallback(() => {
    onFormatHeading(1);
  }, [onFormatHeading]);

  const handleFormatHeadingMedium = React.useCallback(() => {
    onFormatHeading(2);
  }, [onFormatHeading]);

  return (
    <Row>
      <ToolbarButton icon="undo" onPress={onUndo} />
      <ToolbarButton icon="redo" onPress={onRedo} />
      <ToolbarDivider />
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
      <ToolbarDivider />
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
        isActive={activeFormats.code}
        icon="code"
        onPress={onFormatCode}
      />
      <ToolbarDivider />
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
      <ToolbarDivider />
      <ToolbarButton
        isActive={!!activeFormats.link}
        icon="link"
        onPress={onFormatLink}
      />
      <ToolbarButton icon="image" />
      <ToolbarButton icon="video" />
    </Row>
  );
}

interface ToolbarButtonProps {
  onPress?: () => void;
  icon: IconName;
  size?: TextSize;
  isActive?: boolean;
}

function ToolbarButton(props: ToolbarButtonProps) {
  const { onPress = () => {}, icon, size, isActive } = props;

  return (
    <Button style={styles.toolbarButton} onPress={onPress}>
      <Icon name={icon} size={size} color={isActive ? 'primary' : 'default'} />
    </Button>
  );
}

interface LinkValue {
  text: string;
  url: string;
}

interface LinkEditProps {
  initialValue: LinkValue;
  onSubmit: (link: LinkValue) => void;
  onRequestClose: () => void;
}

function LinkEdit(props: LinkEditProps) {
  const { onSubmit, onRequestClose, initialValue } = props;

  const [text, setText] = React.useState(initialValue.text);
  const [url, setURL] = React.useState(initialValue.url);

  const handleSubmit = React.useCallback(() => {
    onSubmit({ text: text || url, url });
  }, [text, url, onSubmit]);

  return (
    <Container padding={16} minWidth={400}>
      <CloseButton onPress={onRequestClose} />
      <Spacing height={16} />
      <Text>Text</Text>
      <TextInput value={text} onValueChange={setText} />
      <Spacing height={16} />
      <Text>URL</Text>
      <TextInput value={url} onValueChange={setURL} />
      <Spacing height={24} />
      <Button onPress={handleSubmit}>
        <Text>Submit</Text>
      </Button>
    </Container>
  );
}

interface LinkPreviewProps {
  url: string;
  onFormatLink: () => void;
  onRemoveLink: () => void;
}

function LinkPreview(props: LinkPreviewProps) {
  const { url, onFormatLink, onRemoveLink } = props;

  const handleCopy = React.useCallback(() => {
    Clipboard.setString(url);
  }, [url]);

  return (
    <Container width={LINK_PREVIEW_WIDTH} height={LINK_PREVIEW_HEIGHT}>
      <Row>
        <Container flex={1} padding={8}>
          <Text decoration="underline">{url}</Text>
        </Container>
        <Button onPress={handleCopy}>
          <Icon name="copy" />
        </Button>
        <Button onPress={onFormatLink}>
          <Icon name="edit" />
        </Button>
        <Button onPress={onRemoveLink}>
          <Icon name="x-circle" />
        </Button>
      </Row>
    </Container>
  );
}

function ToolbarDivider() {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.toolbarDivider,
        { backgroundColor: theme.border.color.default },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  hoverable: {
    position: 'absolute',
    borderRadius: tokens.radius,
    zIndex: 1,
  },
  toolbarButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: tokens.radius,
  },
  toolbarDivider: {
    height: 24,
    width: 1,
    alignSelf: 'center',
  },
});
