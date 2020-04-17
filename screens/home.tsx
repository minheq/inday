import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { DragDropProvider } from '../components/drag_drop_context';
import { useDrag } from '../components/use_drag';

interface Block {
  id: string;
  title: string;
  note: string;
}

const blocks: Block[] = [
  { id: '1', title: 'Title', note: 'Note' },
  { id: '2', title: 'Title', note: 'Note' },
  { id: '3', title: 'Title', note: 'Note' },
  { id: '4', title: 'Title', note: 'Note' },
  { id: '5', title: 'Title', note: 'Note' },
  { id: '6', title: 'Title', note: 'Note' },
];

export function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DragDropProvider>
        <ScrollView bounces={false}>
          {blocks.map((block) => (
            <BlockItem block={block} />
          ))}
        </ScrollView>
      </DragDropProvider>
    </SafeAreaView>
  );
}

interface BlockItemProps {
  block: Block;
}

function BlockItem(props: BlockItemProps) {
  const { block } = props;
  const opacity = React.useRef(new Animated.Value(1)).current;
  const [viewProps, { isDragging, startDrag, endDrag }] = useDrag({});

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: isDragging ? 1 : 0.5,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [isDragging, opacity]);

  return (
    <Animated.View
      {...viewProps}
      style={[
        viewProps.style,
        {
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onLongPress={startDrag}
        onPressOut={endDrag}
      >
        <View style={[styles.block]}>
          <Text style={styles.blockTitle}>{block.title}</Text>
          <Text style={styles.blockNote}>{block.note}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
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
