import Delta from 'quill-delta';
import React from 'react';
import { Container } from '../../components';
import { EditorContentInstance, EditorContent } from './editor_content';
import {
  ChangeSource,
  Range,
  HeadingSize,
  Formats,
  ListType,
  LinkValue,
} from './types';
import { EditorProps } from './editor';
import { MobileSelectionToolbar } from './range_toolbar';
import { Animated } from 'react-native';

export interface BottomBarToolbarData {
  type: 'toolbar';
}

export interface BottomBarLinkPreviewData {
  type: 'link-preview';
  url: string;
}

export interface BottomBarLinkEditData {
  type: 'link-edit';
  link: LinkValue;
}

export interface BottomBarCommandsData {
  type: 'commands';
}

export type BottomBar =
  | BottomBarToolbarData
  | BottomBarLinkPreviewData
  | BottomBarCommandsData
  | BottomBarLinkEditData;

export interface BottomBarItem {
  isVisible: boolean;
  bottomBar: BottomBar | null;
  position: Animated.ValueXY;
  opacity: Animated.Value;
}

const initialBottomBarItem: BottomBarItem = {
  isVisible: false,
  bottomBar: null,
  position: new Animated.ValueXY(),
  opacity: new Animated.Value(0),
};

interface EditorState {
  bottomBarItem: BottomBarItem;
  /** Formats in current selection */
  formats: Formats;
}

export class EditorMobile extends React.Component<EditorProps, EditorState> {
  editorContentRef = React.createRef<EditorContentInstance>();
  editor: EditorContentInstance | null = null;
  contentHeight: number = 0;

  state: EditorState = {
    bottomBarItem: initialBottomBarItem,
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
        .insert('\n'),
    } = this.props;

    if (this.editor) {
      this.editor.setContents(initialContent, 'api');
    }
  };

  handleUpdateFormats = async () => {
    if (!this.editor) {
      return;
    }
    const formats = await this.editor.getFormat();
    this.setState({ formats });
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

    await this.handleUpdateFormats();
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

    console.log(range);

    if (range.length === 0) {
    } else {
    }

    await this.handleUpdateFormats();
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
  };

  handleFormatList = async (value: ListType | false) => {
    if (!this.editor) {
      return;
    }

    this.editor.format('list', value);
  };

  handleFormatBlockquote = async (value: boolean) => {
    if (!this.editor) {
      return;
    }

    this.editor.format('blockquote', value);
  };

  handleFormatCodeBlock = async (value: boolean) => {
    if (!this.editor) {
      return;
    }

    this.editor.format('code-block', value);
  };

  handleOpenLinkEdit = () => {};

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

  render() {
    const { formats } = this.state;

    return (
      <Container flex={1}>
        <EditorContent
          ref={this.editorContentRef}
          onLoad={this.handleEditorLoad}
          onTextChange={this.handleTextChange}
          onSelectionChange={this.handleSelectionChange}
        />
        <MobileSelectionToolbar
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
      </Container>
    );
  }
}
