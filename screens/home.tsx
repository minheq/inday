import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { DragDropProvider } from '../components/drag_drop/drag_drop_provider';
import { Draggable } from '../components/draggable';
import { DropTarget } from '../components/drop_target';

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
  // { id: '6', title: 'Title', note: 'Note' },
  // { id: '7', title: 'Title', note: 'Note' },
  // { id: '8', title: 'Title', note: 'Note' },
  // { id: '9', title: 'Title', note: 'Note' },
  // { id: '10', title: 'Title', note: 'Note' },
  // { id: '11', title: 'Title', note: 'Note' },
  // { id: '12', title: 'Title', note: 'Note' },
  // { id: '13', title: 'Title', note: 'Note' },
  // { id: '14', title: 'Title', note: 'Note' },
  // { id: '15', title: 'Title', note: 'Note' },
  // { id: '16', title: 'Title', note: 'Note' },
  // { id: '17', title: 'Title', note: 'Note' },
];

export function HomeScreen() {
  // const scrollRef = React.useRef<ScrollView>(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <View style={{ padding: 16 }}>
          <DragDropProvider>
            <Draggable>
              <Text>Draggable!</Text>
            </Draggable>
            <View style={{ height: 400 }} />
            <DropTarget
              onAccept={() => {
                console.log('onAccept');
              }}
              onHover={() => {
                console.log('onHover');
              }}
            >
              <Text>Draggable!</Text>
            </DropTarget>
          </DragDropProvider>
        </View>
      </View>
    </SafeAreaView>
  );
}
