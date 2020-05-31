import React from 'react';
import { StyleSheet, View, Linking, Clipboard } from 'react-native';

import { Text, Dialog } from '../components';
import { LinkValue } from './editable/nodes/link';
import { ToolbarButton } from './toolbar';
import { useEditor } from './editor';
import { useToggle } from '../hooks/use_toggle';
import { LinkEdit } from './link_edit';

interface LinkToolbarProps {
  value: LinkValue;
}

export function LinkToolbar(props: LinkToolbarProps) {
  const { value } = props;
  const { url } = value;
  const { removeLink, insertLink } = useEditor();
  const [edit, { setFalse, setTrue }] = useToggle();

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

  const handleInsert = React.useCallback(
    (newValue: LinkValue) => {
      setFalse();
      insertLink(newValue);
    },
    [insertLink, setFalse],
  );

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
      <ToolbarButton onPress={setTrue}>
        <Text>Edit</Text>
      </ToolbarButton>
      <ToolbarButton onPress={handleRemove}>
        <Text>Remove</Text>
      </ToolbarButton>
      <Dialog isOpen={edit} onRequestClose={setFalse}>
        <LinkEdit initialValue={value} onSubmit={handleInsert} />
      </Dialog>
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
