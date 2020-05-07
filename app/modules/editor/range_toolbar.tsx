import React from 'react';
import { Formats, HeadingSize, ListType } from './types';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  IconName,
  Container,
  Row,
  Text,
  Spacing,
  Icon,
  Modal,
  CloseButton,
} from '../../components';
import { TextSize, tokens, useTheme } from '../../theme';

interface MobileSelectionToolbarProps {
  formats: Formats;
  onOpenLinkEdit: () => void;
  onFormatBold: (value: boolean) => void;
  onFormatItalic: (value: boolean) => void;
  onFormatStrike: (value: boolean) => void;
  onFormatHeading: (value: HeadingSize | false) => void;
  onFormatCode: (value: boolean) => void;
  onFormatList: (value: ListType | false) => void;
  onFormatBlockquote: (value: boolean) => void;
  onFormatCodeBlock: (value: boolean) => void;
}

export function MobileSelectionToolbar(props: MobileSelectionToolbarProps) {
  const {
    formats,
    onOpenLinkEdit,
    onFormatBold,
    onFormatItalic,
    onFormatStrike,
    onFormatHeading,
    onFormatCode,
    onFormatList,
    onFormatBlockquote,
    onFormatCodeBlock,
  } = props;
  const [isTextFormatOpen, setIsTextFormatOpen] = React.useState(false);

  const handleFormatText = React.useCallback(() => {
    if (formats.header === 1) {
      onFormatHeading(false);
    } else if (formats.header === 2) {
      onFormatHeading(false);
    } else if (formats.header === 3) {
      onFormatHeading(false);
    } else if (formats.list === 'bullet') {
      onFormatList(false);
    } else if (formats.list === 'ordered') {
      onFormatList(false);
    } else if (formats.code) {
      onFormatCodeBlock(false);
    } else if (formats.blockquote) {
      onFormatBlockquote(false);
    }
  }, [
    formats,
    onFormatHeading,
    onFormatList,
    onFormatCodeBlock,
    onFormatBlockquote,
  ]);

  const handleFormatBold = React.useCallback(() => {
    onFormatBold(!formats.bold);
  }, [onFormatBold, formats.bold]);

  const handleFormatItalic = React.useCallback(() => {
    onFormatItalic(!formats.italic);
  }, [onFormatItalic, formats.italic]);

  const handleFormatStrike = React.useCallback(() => {
    onFormatStrike(!formats.strike);
  }, [onFormatStrike, formats.strike]);

  const handleFormatCode = React.useCallback(() => {
    onFormatCode(!formats.code);
  }, [onFormatCode, formats.code]);

  const handleFormatHeading1 = React.useCallback(() => {
    onFormatHeading(1);
  }, [onFormatHeading]);

  const handleFormatHeading2 = React.useCallback(() => {
    onFormatHeading(2);
  }, [onFormatHeading]);

  const handleFormatHeading3 = React.useCallback(() => {
    onFormatHeading(3);
  }, [onFormatHeading]);

  const handleFormatBulletList = React.useCallback(() => {
    onFormatList('bullet');
  }, [onFormatList]);

  const handleFormatNumberedList = React.useCallback(() => {
    onFormatList('ordered');
  }, [onFormatList]);

  const handleFormatCodeBlock = React.useCallback(() => {
    onFormatCodeBlock(true);
  }, [onFormatCodeBlock]);

  const handleFormatBlockquote = React.useCallback(() => {
    onFormatBlockquote(true);
  }, [onFormatBlockquote]);

  const handleToggleTextFormatting = React.useCallback(() => {
    setIsTextFormatOpen(!isTextFormatOpen);
  }, [isTextFormatOpen]);

  const textLabel = 'Text';
  const titleLabel = 'Title';
  const headingLabel = 'Heading';
  const subheadingLabel = 'Subheading';
  const bulletedListLabel = 'Bulleted list';
  const numberedListLabel = 'Numbered list';
  const codeLabel = 'Code';
  const quoteLabel = 'Quote';

  let activeFormatLabel = textLabel;

  if (formats.header === 1) {
    activeFormatLabel = titleLabel;
  } else if (formats.header === 2) {
    activeFormatLabel = headingLabel;
  } else if (formats.header === 3) {
    activeFormatLabel = subheadingLabel;
  } else if (formats.list === 'bullet') {
    activeFormatLabel = bulletedListLabel;
  } else if (formats.list === 'ordered') {
    activeFormatLabel = numberedListLabel;
  } else if (formats.code) {
    activeFormatLabel = codeLabel;
  } else if (formats.blockquote) {
    activeFormatLabel = quoteLabel;
  }

  return (
    <Container color="content" borderTopWidth={1}>
      <Row>
        <Modal animationType="slide" isOpen={isTextFormatOpen}>
          <Row>
            <CloseButton onPress={handleToggleTextFormatting} />
          </Row>
          <Container color="content">
            <Button align="left" onPress={handleFormatText}>
              <Text size="sm">{textLabel}</Text>
            </Button>
            <Button align="left" onPress={handleFormatHeading1}>
              <Text size="sm">{titleLabel}</Text>
            </Button>
            <Button align="left" onPress={handleFormatHeading2}>
              <Text size="sm">{headingLabel}</Text>
            </Button>
            <Button align="left" onPress={handleFormatHeading3}>
              <Text size="sm">{subheadingLabel}</Text>
            </Button>
            <Button align="left" onPress={handleFormatBulletList}>
              <Text size="sm">{bulletedListLabel}</Text>
            </Button>
            <Button align="left" onPress={handleFormatNumberedList}>
              <Text size="sm">{numberedListLabel}</Text>
            </Button>
            <Button align="left" onPress={handleFormatCodeBlock}>
              <Text size="sm">{codeLabel}</Text>
            </Button>
            <Button align="left" onPress={handleFormatBlockquote}>
              <Text size="sm">{quoteLabel}</Text>
            </Button>
          </Container>
        </Modal>
        <Button onPress={handleToggleTextFormatting}>
          <Text>{activeFormatLabel}</Text>
          <Spacing width={8} />
          <Icon name="chevron-down" />
        </Button>
        <ToolbarDivider />
        <ToolbarButton
          isActive={formats.bold}
          icon="bold"
          onPress={handleFormatBold}
        />
        <ToolbarButton
          isActive={formats.italic}
          icon="italic"
          onPress={handleFormatItalic}
        />
        <ToolbarButton
          isActive={formats.strike}
          icon="strikethrough"
          size="lg"
          onPress={handleFormatStrike}
        />
        <ToolbarButton
          isActive={formats.code}
          icon="code"
          onPress={handleFormatCode}
        />
        <ToolbarButton
          isActive={!!formats.link}
          icon="link"
          onPress={onOpenLinkEdit}
        />
      </Row>
    </Container>
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
  toolbarButton: {
    height: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: tokens.radius,
  },
  toolbarDivider: {
    height: 24,
    marginHorizontal: 2,
    width: 1,
    alignSelf: 'center',
  },
});
