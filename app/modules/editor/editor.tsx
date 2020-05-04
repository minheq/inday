import Delta from 'quill-delta';
import React from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Clipboard,
  ScrollView,
} from 'react-native';
import {
  IconName,
  Icon,
  Container,
  Row,
  Button,
  CloseButton,
  Text,
  TextInput,
  Spacing,
} from '../../components';
import { ThemeContext, tokens, TextSize, useTheme } from '../../theme';
import { between } from '../../utils/numbers';
import { EditorContentInstance, EditorContent } from './editor_content';
import { ChangeSource, Range, HeadingSize, Formats } from './types';

interface EditorProps {
  initialContent?: Delta;
}

interface HoverableToolbar {
  type: 'toolbar';
}

interface HoverableLinkPreview {
  type: 'link-preview';
}

interface HoverableLinkEdit {
  type: 'link-edit';
}

interface HoverableCommands {
  type: 'commands';
}

type Hoverable =
  | HoverableToolbar
  | HoverableLinkPreview
  | HoverableLinkEdit
  | HoverableCommands;

interface HoverableItem {
  isVisible: boolean;
  hoverable: Hoverable | null;
  position: Animated.ValueXY;
  opacity: Animated.Value;
}

const LINK_PREVIEW_WIDTH = 280;
const LINK_PREVIEW_HEIGHT = 40;

// TODO:
// - Markdown auto formatting
// - Disable pasted formats
// - Code block syntax highlighting
// - Smooth loading of editor
// - Drag and drop image/video into editor
// - Paste image
// - Embed videos
// - Embed Tweets
// - Embed Drawings

const initialHoverableItem = {
  isVisible: false,
  hoverable: null,
  position: new Animated.ValueXY(),
  opacity: new Animated.Value(0),
};

interface EditorState {
  hoverableItem: HoverableItem;
}

export class Editor extends React.Component<EditorProps, EditorState> {
  scrollViewRef = React.createRef<ScrollView>();
  editorContentRef = React.createRef<EditorContentInstance>();
  editor: EditorContentInstance | null = null;
  contentHeight: number = 0;

  state: EditorState = {
    hoverableItem: initialHoverableItem,
  };

  constructor(props: EditorProps) {
    super(props);
  }

  componentDidMount() {
    this.editor = this.editorContentRef.current;
  }

  getHoverablePosition = async (hoverable: Hoverable) => {
    if (!this.editor) {
      return;
    }

    const selection = await this.editor.getSelection();
    if (!selection) {
      return null;
    }

    const rangeBounds = await this.editor.getBounds(
      selection.index,
      selection.length,
    );

    let hoverableHeight = 0;
    let hoverableWidth = 0;

    switch (hoverable.type) {
      case 'commands':
        hoverableHeight = HOVERABLE_COMMANDS_HEIGHT;
        hoverableWidth = HOVERABLE_COMMANDS_WIDTH;
        break;
      default:
        return;
    }

    let y = 0;
    const LINE_HEIGHT = 16;
    const LINE_OFFSET = 8;
    if (rangeBounds.top - hoverableHeight < 4) {
      y = rangeBounds.top + LINE_HEIGHT + LINE_OFFSET;
    } else {
      y = rangeBounds.top - hoverableHeight - LINE_OFFSET;
    }

    const x = between(
      rangeBounds.left + rangeBounds.width / 2 - hoverableWidth / 2,
      8,
      440,
    );

    return { x, y };
  };

  handleShowHoverable = async (hoverable: Hoverable) => {
    const position = await this.getHoverablePosition(hoverable);

    if (!position) {
      return;
    }

    const { x, y } = position;
    const hoverableItem: HoverableItem = {
      hoverable,
      isVisible: true,
      position: new Animated.ValueXY({ x, y }),
      opacity: new Animated.Value(0),
    };

    this.setState({
      hoverableItem,
    });

    Animated.timing(hoverableItem.opacity, {
      toValue: 1,
      useNativeDriver: true,
      duration: 100,
    }).start();
  };

  handleEditorContentLoad = () => {
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
    } = this.props;

    if (this.editor) {
      this.editor.setContents(initialContent, 'api');
    }
  };

  handleUpdateHoverablePositionIfNeeded = async () => {
    const { hoverableItem } = this.state;

    if (!hoverableItem.hoverable) {
      return;
    }

    const position = await this.getHoverablePosition(hoverableItem.hoverable);

    if (!position) {
      return;
    }

    const { x, y } = position;
    const prevX = (hoverableItem.position.x as any)._value;
    const prevY = (hoverableItem.position.y as any)._value;

    if (x !== prevX || y !== prevY) {
      Animated.spring(hoverableItem.position, {
        toValue: {
          x,
          y,
        },
        useNativeDriver: true,
        bounciness: 0,
        speed: 300,
      }).start();
    }
  };

  handleHideHoverable = () => {
    const { hoverableItem } = this.state;

    if (hoverableItem.isVisible) {
      Animated.timing(hoverableItem.opacity, {
        toValue: 0,
        useNativeDriver: true,
        duration: 100,
      }).start(() => {
        this.setState({
          hoverableItem: initialHoverableItem,
        });
      });
    }
  };

  handleTextChange = async (
    _delta: Delta,
    _oldContents: Delta,
    _source: ChangeSource,
  ) => {
    if (!this.editor) {
      return;
    }

    const selection = await this.editor.getSelection();
    if (!selection) {
      return null;
    }

    const bounds = await this.editor.getBounds(
      selection.index,
      selection.length,
    );

    if (bounds.bottom > this.contentHeight) {
      this.scrollViewRef.current?.scrollTo({ y: bounds.bottom });
    }

    if (selection.length === 0) {
      // this.handleHideHoverable();
    } else {
      this.handleUpdateHoverablePositionIfNeeded();
    }
  };

  handleSelectionChange = async (
    range: Range | null,
    _oldRange: Range | null,
    _source: ChangeSource,
  ) => {
    if (!this.editor) {
      return;
    }

    if (range === null) {
      return;
    }

    const formats = await this.editor.getFormats();

    if (range.length === 0) {
      this.handleHideHoverable();

      if (formats.link) {
        this.handleShowHoverable(range, 'link');
      }
    }
  };

  handleFormatBold = async () => {
    if (!this.editor) {
      return;
    }

    const formats = await this.editor.getFormats();
    this.editor.format('bold', !formats.bold);
  };

  handleFormatItalic = async () => {
    if (!this.editor) {
      return;
    }

    const formats = await this.editor.getFormats();
    this.editor.format('italic', !formats.italic);
  };

  handleFormatStrike = async () => {
    if (!this.editor) {
      return;
    }

    const formats = await this.editor.getFormats();
    this.editor.format('strike', !formats.strike);
  };

  handleFormatCode = async () => {
    if (!this.editor) {
      return;
    }

    const formats = await this.editor.getFormats();
    this.editor.format('code', !formats.code);
  };

  handleFormatHeading = async (size: HeadingSize) => {
    if (!this.editor) {
      return;
    }
    const formats = await this.editor.getFormats();

    if (formats.header === size) {
      this.editor.format('header', false);
    } else {
      this.editor.format('header', size);
    }
  };

  handleFormatList = async () => {
    if (!this.editor) {
      return;
    }

    const formats = await this.editor.getFormats();
    this.editor.format('list', formats.list ? false : 'bullet');
  };

  handleFormatBlockquote = async () => {
    if (!this.editor) {
      return;
    }

    const formats = await this.editor.getFormats();
    this.editor.format('blockquote', !formats.blockquote);
  };

  handleFormatCodeBlock = async () => {
    if (!this.editor) {
      return;
    }

    const formats = await this.editor.getFormats();
    this.editor.format('code-block', !formats['code-block']);
  };

  handleRemoveLink = () => {};

  handleFormatLink = async () => {
    this.handleHideHoverable();
  };

  handleSubmitLinkEdit = () => {};

  handleCloseLinkEdit = () => {};

  handleInsertImage = () => {};

  handleInsertVideo = () => {};

  handleContentSizeChange = (width: number, height: number) => {
    this.contentHeight = height;
  };

  handleUndo = () => {
    if (!this.editor) {
      return;
    }

    this.editor.undo();
  };

  handleRedo = () => {
    if (!this.editor) {
      return;
    }

    this.editor.redo();
  };

  handlePromptCommands = () => {
    if (!this.editor) {
      return;
    }

    this.handleShowHoverable({ type: 'commands' });
  };

  render() {
    const { hoverableItem } = this.state;

    return (
      <Container expanded>
        <Container paddingBottom={4}>
          <Toolbar
            formats={{}}
            onUndo={this.handleUndo}
            onRedo={this.handleRedo}
            onFormatLink={this.handleFormatLink}
            onFormatBold={this.handleFormatBold}
            onFormatItalic={this.handleFormatItalic}
            onFormatStrike={this.handleFormatStrike}
            onFormatHeading={this.handleFormatHeading}
            onFormatCode={this.handleFormatCode}
            onFormatList={this.handleFormatList}
            onFormatBlockquote={this.handleFormatBlockquote}
            onFormatCodeBlock={this.handleFormatCodeBlock}
            onInsertImage={this.handleInsertImage}
            onInsertVideo={this.handleInsertVideo}
          />
        </Container>
        <ScrollView
          ref={this.scrollViewRef}
          onContentSizeChange={this.handleContentSizeChange}
        >
          {hoverableItem.isVisible && (
            <ThemeContext.Consumer>
              {(theme) => (
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
                  {hoverableItem.hoverable?.type === 'commands' && (
                    <HoverableCommands />
                  )}
                </Animated.View>
              )}
            </ThemeContext.Consumer>
          )}
          <EditorContent
            ref={this.editorContentRef}
            onLoad={this.handleEditorContentLoad}
            onTextChange={this.handleTextChange}
            onSelectionChange={this.handleSelectionChange}
            onPromptCommands={this.handlePromptCommands}
          />
        </ScrollView>
      </Container>
    );
  }
}

interface ToolbarProps {
  formats: Formats;
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
  onInsertImage: () => void;
  onInsertVideo: () => void;
}

function Toolbar(props: ToolbarProps) {
  const {
    formats,
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
        isActive={formats.header === 2}
        icon="font"
        size="sm"
        onPress={handleFormatHeadingMedium}
      />
      <ToolbarButton
        isActive={formats.header === 1}
        icon="font"
        onPress={handleFormatHeadingLarge}
      />
      <ToolbarDivider />
      <ToolbarButton
        isActive={formats.bold}
        icon="bold"
        onPress={onFormatBold}
      />
      <ToolbarButton
        isActive={formats.italic}
        icon="italic"
        onPress={onFormatItalic}
      />
      <ToolbarButton
        isActive={formats.strike}
        icon="strikethrough"
        size="lg"
        onPress={onFormatStrike}
      />
      <ToolbarButton
        isActive={formats.code}
        icon="code"
        onPress={onFormatCode}
      />
      <ToolbarDivider />
      <ToolbarButton
        isActive={formats.list}
        icon="list"
        onPress={onFormatList}
      />
      <ToolbarButton
        isActive={formats.blockquote}
        icon="quote"
        onPress={onFormatBlockquote}
      />
      <ToolbarButton
        isActive={formats['code-block']}
        icon="codepen"
        onPress={onFormatCodeBlock}
      />
      <ToolbarDivider />
      <ToolbarButton
        isActive={!!formats.link}
        icon="link"
        onPress={onFormatLink}
      />
      <ToolbarButton icon="image" />
      <ToolbarButton icon="video" onPress={onInsertVideo} />
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

interface HoverableCommandsProps {}

const options = ['item-1', 'item-2', 'item-3'];

const HOVERABLE_COMMANDS_WIDTH = 240;
const HOVERABLE_COMMANDS_HEIGHT = 280;

function HoverableCommands(props: HoverableCommandsProps) {
  console.log('render');

  return (
    <Container
      width={HOVERABLE_COMMANDS_WIDTH}
      height={HOVERABLE_COMMANDS_HEIGHT}
    >
      {options.map((opt) => {
        return (
          <Container flex={1} key={opt}>
            <Text>{opt}</Text>
          </Container>
        );
      })}
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
    marginHorizontal: 8,
    width: 1,
    alignSelf: 'center',
  },
});
