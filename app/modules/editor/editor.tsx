import Delta from 'quill-delta';
import React from 'react';
import {
  Animated,
  StyleSheet,
  View,
  ScrollView,
  findNodeHandle,
} from 'react-native';
import { Container, Text } from '../../components';
import { ThemeContext, tokens } from '../../theme';
import { between } from '../../utils/numbers';
import { EditorContentInstance, EditorContent } from './editor_content';
import {
  LinkValue,
  ChangeSource,
  Range,
  HeadingSize,
  Formats,
  ListType,
  HoverableItem,
  Hoverable,
} from './types';
import { measure } from '../drag_drop/measurements';
import { HoverableToolbar } from './hoverable_toolbar';
import { HoverableCommands } from './hoverable_commands';
import { HoverableLinkEdit } from './hoverable_link_edit';
import { HoverableLinkPreview } from './hoverable_link_preview';

interface EditorProps {
  initialContent?: Delta;
}

// Type of commands
// Inline format
//  - Emphasis (Bold, Italic, Code, Strike)
//  - Link
// Block format
//  - Headers
//  - Lists
//  - Blockquotes
//  - Code Block
// Blocks
//  - Images
//  - Divider
//  - Videos
//  - Tables

// Desktop
// HoverableToolbar -> Inline format + Block format
// Commands -> Block format + Blocks

// Mobile
// Selection -> Inline Format
// Collapsed selection -> Block format + Blocks
// Collapsed on link -> Link edit/preview

// TODO:
// - Markdown auto formatting
// - Code and Code block syntax highlighting
// - Disable pasted formats
// - Paste image

// - Smooth loading of editor
// - Drag and drop image/video into editor
// - Embed Videos
// - Embed Tweets
// - Embed Drawings

const initialHoverableItem = {
  isVisible: false,
  hoverable: null,
  position: new Animated.ValueXY(),
  opacity: new Animated.Value(0),
};

interface Placeholder {
  position: {
    top: number;
    left: number;
  };
}

interface EditorState {
  placeholder: Placeholder | null;
  hoverableItem: HoverableItem;
  /** Formats under current selection */
  formats: Formats;
}

const LINE_HEIGHT = 16;

export class Editor extends React.Component<EditorProps, EditorState> {
  scrollViewRef = React.createRef<ScrollView>();
  hoverableRef = React.createRef<View>();
  editorContentRef = React.createRef<EditorContentInstance>();
  editor: EditorContentInstance | null = null;
  contentHeight: number = 0;

  state: EditorState = {
    placeholder: null,
    hoverableItem: initialHoverableItem,
    formats: {},
  };

  constructor(props: EditorProps) {
    super(props);
  }

  componentDidMount() {
    this.editor = this.editorContentRef.current;
  }

  handleEditorLoad = () => {
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

  handleTextChange = async (
    _delta: Delta,
    _oldContents: Delta,
    _source: ChangeSource,
  ) => {
    if (!this.editor) {
      return;
    }

    const range = await this.editor.getSelection();
    if (!range) {
      return null;
    }

    const formats = await this.editor.getFormat();
    this.setState({ formats });

    const bounds = await this.editor.getBounds(range.index, range.length);

    if (bounds.bottom > this.contentHeight) {
      this.scrollViewRef.current?.scrollTo({ y: bounds.bottom });
    }

    if (range.length === 0) {
      this.handleShowPlaceholderIfNeeded(range);
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

    const formats = await this.editor.getFormat();
    this.setState({ formats });

    if (range.length === 0) {
      if (formats.link) {
        this.handleShowHoverable({ type: 'link-preview', url: formats.link });
        return;
      }

      this.handleHideHoverable();
      this.handleShowPlaceholderIfNeeded(range);
    } else {
      this.handleShowHoverable({ type: 'toolbar' });
    }
  };

  handleShowPlaceholderIfNeeded = async (range: Range) => {
    if (!this.editor) {
      return;
    }

    if (range === null) {
      return;
    }

    const [line] = await this.editor.getLine(range.index);

    if (line?.tagName === 'P' && line?.firstChild?.tagName === 'BR') {
      this.handleShowPlaceholder(range);
    } else {
      this.handleHidePlaceholder();
    }
  };

  handleShowPlaceholder = async (range: Range) => {
    const { placeholder } = this.state;

    if (!this.editor) {
      return;
    }

    const bounds = await this.editor.getBounds(range.index, range.length);

    // "4" comes from eyeball adjustment to be inline with cursor
    const top = bounds.top - 4;
    const prevTop = placeholder?.position.top;
    const left = 4;

    if (top !== prevTop) {
      this.setState({
        placeholder: {
          position: {
            top,
            left,
          },
        },
      });
    }
  };

  handleHidePlaceholder = () => {
    const { placeholder } = this.state;

    if (placeholder) {
      this.setState({
        placeholder: null,
      });
    }
  };

  getHoverablePosition = async () => {
    if (!this.editor) {
      return;
    }

    const selection = await this.editor.getSelection();
    if (!selection) {
      return;
    }

    const bounds = await this.editor.getBounds(
      selection.index,
      selection.length,
    );

    const handle = findNodeHandle(this.hoverableRef.current);

    if (!handle) {
      return;
    }

    const { width, height } = await measure(this.hoverableRef);

    let y = 0;
    const LINE_OFFSET = 8;
    if (bounds.top - height < 4) {
      y = bounds.top + LINE_HEIGHT + LINE_OFFSET;
    } else {
      y = bounds.top - height - LINE_OFFSET;
    }

    const x = between(bounds.left + bounds.width / 2 - width / 2, 8, 440);

    return { x, y };
  };

  handleShowHoverable = async (hoverable: Hoverable) => {
    const hoverableItem: HoverableItem = {
      hoverable,
      isVisible: true,
      position: new Animated.ValueXY(),
      opacity: new Animated.Value(0),
    };

    // Set hoverable item first so that we can measure its dimensions
    this.setState({ hoverableItem });

    const position = await this.getHoverablePosition();

    if (!position) {
      return;
    }

    // Update its position
    const { x, y } = position;
    hoverableItem.position.setValue({ x, y });

    Animated.timing(hoverableItem.opacity, {
      toValue: 1,
      useNativeDriver: true,
      duration: 100,
    }).start();
  };

  handleUpdateHoverablePositionIfNeeded = async () => {
    const { hoverableItem } = this.state;

    if (!hoverableItem.hoverable) {
      return;
    }

    const position = await this.getHoverablePosition();

    if (!position) {
      return;
    }

    const { x, y } = position;
    const prevX = (hoverableItem.position.x as any)._value;
    const prevY = (hoverableItem.position.y as any)._value;
    const deltaX = prevX - x;
    const deltaY = prevY - y;

    // Update when significant enough
    if (Math.hypot(deltaX, deltaY) > 10) {
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

  handleFormatBold = async (value: boolean) => {
    if (!this.editor) {
      return;
    }

    this.editor.format('bold', value);
  };

  handleFormatItalic = async (value: boolean) => {
    if (!this.editor) {
      return;
    }

    this.editor.format('italic', value);
  };

  handleFormatStrike = async (value: boolean) => {
    if (!this.editor) {
      return;
    }

    this.editor.format('strike', value);
  };

  handleFormatCode = async (value: boolean) => {
    if (!this.editor) {
      return;
    }

    this.editor.format('code', value);
  };

  handleFormatHeading = async (value: HeadingSize | false) => {
    if (!this.editor) {
      return;
    }
    this.editor.format('header', value);
    this.handleHideHoverable();
  };

  handleFormatList = async (value: ListType | false) => {
    if (!this.editor) {
      return;
    }

    this.editor.format('list', value);
    this.handleHideHoverable();
  };

  handleFormatBlockquote = async (value: boolean) => {
    if (!this.editor) {
      return;
    }

    this.editor.format('blockquote', value);
    this.handleHideHoverable();
  };

  handleFormatCodeBlock = async (value: boolean) => {
    if (!this.editor) {
      return;
    }

    this.editor.format('code-block', value);
    this.handleHideHoverable();
  };

  handleRemoveLink = async () => {
    if (!this.editor) {
      return;
    }

    const range = await this.editor.getSelection();
    if (!range) {
      return;
    }

    const { index } = range;
    const [link, offset] = await this.editor.getLeaf(index);

    if (link && link.parent.tagName === 'A') {
      const linkRange = { index: index - offset, length: link.length };

      this.editor.formatText(linkRange.index, linkRange.length, 'link', false);
    }

    this.handleHideHoverable();
  };

  handleSubmitLinkEdit = async (link: LinkValue) => {
    if (!this.editor) {
      return;
    }

    const range = await this.editor.getSelection();
    if (!range) {
      return;
    }

    this.editor.deleteText(range.index, range.length);
    this.editor.insertText(range.index, link.text, 'link', link.url);
    this.handleHideHoverable();
  };

  handleOpenLinkEdit = async () => {
    if (!this.editor) {
      return;
    }

    const selection = await this.editor.getSelection();
    if (!selection) {
      return;
    }

    // + 1 does some adjustments that works well when selecting a word
    const index = selection.index + 1;
    const [link, offset] = await this.editor.getLeaf(index);

    let linkRange = null;

    if (link && link.parent.tagName === 'A') {
      linkRange = { index: index - offset, length: link.length };
    }

    if (!linkRange) {
      const text = await this.editor.getText(selection);
      this.handleShowHoverable({
        type: 'link-edit',
        link: { text, url: '' },
      });
    } else {
      await this.editor.setSelection(linkRange.index, linkRange.length);
      const formats = await this.editor.getFormat();
      const text = await this.editor.getText(linkRange);

      if (!formats.link) {
        this.handleShowHoverable({
          type: 'link-edit',
          link: { text: '', url: '' },
        });
      } else {
        this.handleShowHoverable({
          type: 'link-edit',
          link: { text: text, url: formats.link },
        });
      }
    }
  };

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
    const { hoverableItem, placeholder, formats } = this.state;

    return (
      <Container expanded>
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
                  <View ref={this.hoverableRef}>
                    {hoverableItem.hoverable?.type === 'commands' && (
                      <HoverableCommands />
                    )}
                    {hoverableItem.hoverable?.type === 'link-edit' && (
                      <HoverableLinkEdit
                        initialValue={hoverableItem.hoverable.link}
                        onSubmit={this.handleSubmitLinkEdit}
                      />
                    )}
                    {hoverableItem.hoverable?.type === 'link-preview' && (
                      <HoverableLinkPreview
                        url={hoverableItem.hoverable.url}
                        onOpenLinkEdit={this.handleOpenLinkEdit}
                        onRemoveLink={this.handleRemoveLink}
                      />
                    )}
                    {hoverableItem.hoverable?.type === 'toolbar' && (
                      <HoverableToolbar
                        formats={formats}
                        onOpenLinkEdit={this.handleOpenLinkEdit}
                        onFormatBold={this.handleFormatBold}
                        onFormatItalic={this.handleFormatItalic}
                        onFormatStrike={this.handleFormatStrike}
                        onFormatHeading={this.handleFormatHeading}
                        onFormatCode={this.handleFormatCode}
                        onFormatList={this.handleFormatList}
                        onFormatBlockquote={this.handleFormatBlockquote}
                        onFormatCodeBlock={this.handleFormatCodeBlock}
                      />
                    )}
                  </View>
                </Animated.View>
              )}
            </ThemeContext.Consumer>
          )}
          {placeholder && (
            <View
              style={[
                styles.placeholder,
                {
                  top: placeholder.position.top,
                  left: placeholder.position.left,
                },
              ]}
            >
              <Text color="muted">Type "/" for commands</Text>
            </View>
          )}
          <EditorContent
            ref={this.editorContentRef}
            onLoad={this.handleEditorLoad}
            onTextChange={this.handleTextChange}
            onSelectionChange={this.handleSelectionChange}
            onPromptCommands={this.handlePromptCommands}
          />
        </ScrollView>
      </Container>
    );
  }
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
