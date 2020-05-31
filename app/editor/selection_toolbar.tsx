import React from 'react';

import { Pressable, Icon, IconName } from '../components';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme';
import { Mark } from './editable/nodes/leaf';
import { useEditor } from './editor';

export function SelectionToolbar() {
  return (
    <View style={styles.root}>
      <MarkButton icon="bold" format="bold" />
      <MarkButton icon="italic" format="italic" />
      <MarkButton icon="strikethrough" format="strikethrough" />
      <MarkButton icon="code" format="code" />
    </View>
  );
}

interface MarkButtonProps {
  icon: IconName;
  format: Mark;
}

function MarkButton(props: MarkButtonProps) {
  const { icon, format } = props;
  const theme = useTheme();
  const { toggleMark, marks } = useEditor();
  const active = marks && !!marks[format];

  const handlePress = React.useCallback(() => {
    toggleMark(format);
  }, [toggleMark, format]);

  return (
    <Pressable
      style={[styles.button, { borderColor: theme.border.color.default }]}
      onPress={handlePress}
    >
      <Icon color={active ? 'primary' : 'default'} name={icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    height: 24,
  },
  button: {
    height: '100%',
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
