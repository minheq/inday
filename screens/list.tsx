import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Animated,
  ScrollView,
  findNodeHandle,
  UIManager,
} from 'react-native';
import { DragDropProvider } from '../components/drag_drop/drag_drop_provider';
import { Draggable } from '../components/draggable';
import { useDropTarget } from '../components/drag_drop/use_drop_target';

interface Block {
  id: string;
  title: string;
  note: string;
}

const TEST_DATA: Block[] = [
  { id: '1', title: 'Title', note: 'Note' },
  { id: '2', title: 'Title', note: 'Note' },
  { id: '3', title: 'Title', note: 'Note' },
  { id: '4', title: 'Title', note: 'Note' },
  { id: '5', title: 'Title', note: 'Note' },
  { id: '6', title: 'Title', note: 'Note' },
  { id: '7', title: 'Title', note: 'Note' },
  { id: '8', title: 'Title', note: 'Note' },
  { id: '9', title: 'Title', note: 'Note' },
  { id: '10', title: 'Title', note: 'Note' },
  { id: '11', title: 'Title', note: 'Note' },
  { id: '12', title: 'Title', note: 'Note' },
  { id: '13', title: 'Title', note: 'Note' },
  { id: '14', title: 'Title', note: 'Note' },
  { id: '15', title: 'Title', note: 'Note' },
  { id: '16', title: 'Title', note: 'Note' },
  { id: '17', title: 'Title', note: 'Note' },
  { id: '18', title: 'Title', note: 'Note' },
  { id: '19', title: 'Title', note: 'Note' },
  { id: '20', title: 'Title', note: 'Note' },
  { id: '21', title: 'Title', note: 'Note' },
  { id: '22', title: 'Title', note: 'Note' },
  { id: '23', title: 'Title', note: 'Note' },
  { id: '24', title: 'Title', note: 'Note' },
  { id: '25', title: 'Title', note: 'Note' },
  { id: '26', title: 'Title', note: 'Note' },
];

export function HomeScreen() {
  // const scrollRef = React.useRef<ScrollView>(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 16, flex: 1 }}>
        <View style={{ padding: 16, flex: 1 }}>
          <DragDropProvider>
            <ScrollViewDropTarget>
              {TEST_DATA.map((b) => (
                <ListItem key={b.id} block={b} />
              ))}
            </ScrollViewDropTarget>
          </DragDropProvider>
        </View>
      </View>
    </SafeAreaView>
  );
}

interface ScrollViewDropTargetProps {
  children?: React.ReactNode;
}

function ScrollViewDropTarget(props: ScrollViewDropTargetProps) {
  const { children } = props;
  const [scrollEnabled, setScrollEnabled] = React.useState(false);

  const [, ref] = useDropTarget<ScrollView>({
    onAccept: () => {
      setScrollEnabled(true);
    },
    onEnter: () => {
      console.log('onEnter');

      setScrollEnabled(false);
    },
    onHover: (draggable, dragState) => {
      console.log('onHover');
    },
    onLeave: () => {
      console.log('onLeave');

      setScrollEnabled(true);
    },
    onWillAccept: () => {
      return true;
    },
  });

  return (
    <ScrollView scrollEnabled={scrollEnabled} ref={ref}>
      {children}
    </ScrollView>
  );
}

interface ListItemProps {
  block: Block;
}

function ListItem(props: ListItemProps) {
  const { block } = props;

  return (
    <Draggable direction="vertical" item={block}>
      <View style={{ backgroundColor: 'green', padding: 16, borderWidth: 1 }}>
        <Text>{block.title}</Text>
      </View>
    </Draggable>
  );
}
