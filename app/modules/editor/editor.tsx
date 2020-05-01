import Delta from 'quill-delta';
import React from 'react';
import { ScrollView, Animated, StyleSheet } from 'react-native';
import { EditorContent, EditorContentInstance } from './editor_content';
import {
  Spacing,
  Pressable,
  IconName,
  Icon,
  Column,
  Divider,
  Container,
  Row,
} from '../../components';
import { useTheme, tokens, TextSize } from '../../theme';

interface EditorProps {
  initialContent?: Delta;
}

const init = new Delta()
  .insert('Hello ')
  .insert('World!', { bold: true })
  .insert('\n');

export function Editor(props: EditorProps) {
  const {} = props;
  const editorContentRef = React.useRef<EditorContentInstance | null>(null);

  const handleBold = React.useCallback(() => {
    editorContentRef.current?.bold();
  }, []);

  return (
    <Container expanded>
      <Toolbar />
      <Spacing height={16} />
      <ScrollView>
        <EditorContent initialContent={init} ref={editorContentRef} />
      </ScrollView>
    </Container>
  );
}

interface ToolbarProps {}

function Toolbar() {
  return (
    <Column>
      <Row>
        <ToolbarToggle icon="bold" onPress={() => {}} />
        <ToolbarToggle icon="italic" onPress={() => {}} />
        <ToolbarToggle icon="quote" onPress={() => {}} />
        <ToolbarToggle icon="font" size="sm" onPress={() => {}} />
        <ToolbarToggle icon="font" size="md" onPress={() => {}} />
        <ToolbarToggle icon="font" size="md" onPress={() => {}} />
      </Row>
      <Divider />
    </Column>
  );
}

interface ToolbarToggleProps {
  icon: IconName;
  size?: TextSize;
  onPress: () => void;
}

export function ToolbarToggle(props: ToolbarToggleProps) {
  const { onPress, icon, size } = props;
  const background = React.useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered }) => {
        Animated.spring(background, {
          toValue: pressed ? 1 : hovered ? 0.5 : 0,
          useNativeDriver: true,
          bounciness: 0,
          speed: 100,
        }).start();

        return [
          styles.toggle,
          {
            backgroundColor: background.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [
                theme.button.flat.backgroundDefault,
                theme.button.flat.backgroundHovered,
                theme.button.flat.backgroundPressed,
              ],
            }),
          },
        ];
      }}
    >
      <Icon name={icon} size={size} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toggle: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: tokens.radius,
  },
});
