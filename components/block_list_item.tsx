import React from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';
import { Interactivity } from './interactivity';

interface Block {
  id: string;
  title: string;
  note: string;
}

interface BlockListItemProps {
  block: Block;
}

export class BlockListItem extends React.Component<BlockListItemProps> {
  _interactivity: Interactivity = new Interactivity({});

  render() {
    const { block } = this.props;

    return (
      <Animated.View {...this._interactivity.getEventHandlers()}>
        <View style={[styles.block]}>
          <Text style={styles.blockTitle}>{block.title}</Text>
          <Text style={styles.blockNote}>{block.note}</Text>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  block: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderColor: '#f0f0f0',
    borderBottomWidth: 1,
  },
  blockTitle: {
    fontWeight: 'bold',
  },
  active: {
    backgroundColor: 'green',
  },
  blockNote: {},
});
