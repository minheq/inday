import React from 'react';
import { Formats, HeadingSize, ListType } from './types';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  IconName,
  Container,
  Row,
  Popover,
  Text,
  Spacing,
  Icon,
} from '../components';
import { TextSize, tokens, useTheme } from '../theme';
import { useTextFormattingHandlers } from './use_text_formatting_handlers';

interface HoverableToolbarProps {
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

export function HoverableToolbar(props: HoverableToolbarProps) {
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

  const {
    labels,
    activeLabel,
    handleFormatBold,
    handleFormatItalic,
    handleFormatStrike,
    handleFormatCode,
    handleFormatText,
    handleFormatHeading1,
    handleFormatHeading2,
    handleFormatHeading3,
    handleFormatBulletList,
    handleFormatNumberedList,
    handleFormatCodeBlock,
    handleFormatBlockquote,
  } = useTextFormattingHandlers({
    formats,
    onFormatBold,
    onFormatItalic,
    onFormatStrike,
    onFormatHeading,
    onFormatCode,
    onFormatList,
    onFormatBlockquote,
    onFormatCodeBlock,
  });
  const handleToggleTextFormatting = React.useCallback(() => {
    setIsTextFormatOpen(!isTextFormatOpen);
  }, [isTextFormatOpen]);

  return (
    <Container>
      <Row>
        <Popover
          isOpen={isTextFormatOpen}
          position="left"
          content={
            <Container width={160} shadow color="content">
              <Button align="left" onPress={handleFormatText}>
                <Text size="sm">{labels.text}</Text>
              </Button>
              <Button align="left" onPress={handleFormatHeading1}>
                <Text size="sm">{labels.title}</Text>
              </Button>
              <Button align="left" onPress={handleFormatHeading2}>
                <Text size="sm">{labels.heading}</Text>
              </Button>
              <Button align="left" onPress={handleFormatHeading3}>
                <Text size="sm">{labels.subheading}</Text>
              </Button>
              <Button align="left" onPress={handleFormatBulletList}>
                <Text size="sm">{labels.bulletedList}</Text>
              </Button>
              <Button align="left" onPress={handleFormatNumberedList}>
                <Text size="sm">{labels.numberedList}</Text>
              </Button>
              <Button align="left" onPress={handleFormatCodeBlock}>
                <Text size="sm">{labels.code}</Text>
              </Button>
              <Button align="left" onPress={handleFormatBlockquote}>
                <Text size="sm">{labels.quote}</Text>
              </Button>
            </Container>
          }
        >
          <Button onPress={handleToggleTextFormatting}>
            <Text>{activeLabel}</Text>
            <Spacing width={8} />
            <Icon name="chevron-down" />
          </Button>
        </Popover>
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
