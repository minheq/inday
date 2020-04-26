import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useInteractivity } from './interactivity';

interface Block {
  id: string;
  title: string;
  note: string;
}

interface TestBlockCardProps {
  block: Block;
}

export function TestBlockCard(props: TestBlockCardProps) {
  const { block } = props;

  const config = React.useMemo(() => {
    return {
      onPress: () => {
        // console.log('TestBlockCard:onPress');
      },
      onLongPress: () => {
        // console.log('TestBlockCard:onLongPress');
      },
    };
  }, []);

  const eventHandlers = useInteractivity(config);

  return (
    <View accessible {...eventHandlers}>
      <View style={[styles.block]}>
        <Text style={styles.blockTitle}>{block.title}</Text>
        <Text style={styles.blockNote}>{block.note}</Text>
      </View>
    </View>
  );
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
