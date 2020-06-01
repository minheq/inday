import React from 'react';
import { StyleSheet, View, Linking, Clipboard } from 'react-native';

import { Text } from '../components';
import { LinkValue } from './editable/nodes/link';
import { ToolbarButton } from './toolbar';
import { useEditor } from './editor';
import { useLinkEdit } from './link_edit';

interface LinkToolbarProps {
  value: LinkValue;
}

export function LinkToolbar(props: LinkToolbarProps) {
  const { value } = props;
  const { url } = value;
  const { removeLink } = useEditor();
  const { onEdit } = useLinkEdit();

  const handleOpen = React.useCallback(() => {
    Linking.canOpenURL(url).then(() => {
      return Linking.openURL(url);
    });
  }, [url]);

  const handleCopy = React.useCallback(() => {
    Clipboard.setString(url);
  }, [url]);

  const handleRemove = React.useCallback(() => {
    removeLink();
  }, [removeLink]);

  const handleEdit = React.useCallback(() => {
    onEdit(value);
  }, [onEdit, value]);

  return (
    <View style={styles.root}>
      <View style={styles.urlWrapper}>
        <Text numberOfLines={1}>{value.url}</Text>
      </View>
      <ToolbarButton onPress={handleOpen}>
        <Text>Open</Text>
      </ToolbarButton>
      <ToolbarButton onPress={handleCopy}>
        <Text>Copy</Text>
      </ToolbarButton>
      <ToolbarButton onPress={handleEdit}>
        <Text>Edit</Text>
      </ToolbarButton>
      <ToolbarButton onPress={handleRemove}>
        <Text>Remove</Text>
      </ToolbarButton>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
  },
  urlWrapper: {
    width: 200,
    height: 32,
    justifyContent: 'center',
  },
});
