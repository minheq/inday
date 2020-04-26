import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { DragDropProvider } from '../components/drag_drop/drag_drop_provider';
import { Block } from '../components/block_card';
import { BlockList } from '../components/block_list';

const TEST_DATA1: Block[] = [
  { id: '1', title: 'Title', note: 'Note', height: 150 },
  { id: '2', title: 'Title', note: 'Note', height: 100 },
  { id: '3', title: 'Title', note: 'Note', height: 140 },
  { id: '4', title: 'Title', note: 'Note', height: 50 },
  { id: '5', title: 'Title', note: 'Note', height: 100 },
  { id: '6', title: 'Title', note: 'Note', height: 100 },
  { id: '7', title: 'Title', note: 'Note', height: 100 },
  { id: '8', title: 'Title', note: 'Note', height: 50 },
  // { id: '9', title: 'Title', note: 'Note', height: 100 },
  // { id: '10', title: 'Title', note: 'Note', height: 150 },
  // { id: '11', title: 'Title', note: 'Note', height: 200 },
  // { id: '12', title: 'Title', note: 'Note', height: 100 },
  // { id: '13', title: 'Title', note: 'Note', height: 150 },
  // { id: '14', title: 'Title', note: 'Note', height: 250 },
  // { id: '15', title: 'Title', note: 'Note', height: 100 },
  // { id: '16', title: 'Title', note: 'Note', height: 50 },
  // { id: '17', title: 'Title', note: 'Note', height: 50 },
  // { id: '18', title: 'Title', note: 'Note', height: 100 },
  // { id: '19', title: 'Title', note: 'Note', height: 150 },
  // { id: '20', title: 'Title', note: 'Note', height: 100 },
  // { id: '21', title: 'Title', note: 'Note', height: 200 },
  // { id: '22', title: 'Title', note: 'Note', height: 100 },
  // { id: '23', title: 'Title', note: 'Note', height: 300 },
  // { id: '24', title: 'Title', note: 'Note', height: 100 },
  // { id: '25', title: 'Title', note: 'Note', height: 400 },
  // { id: '26', title: 'Title', note: 'Note', height: 100 },
];

export function HomeScreen() {
  const [data1] = React.useState(TEST_DATA1);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 16, flex: 1 }}>
        <View style={{ padding: 16, flex: 1 }}>
          <DragDropProvider>
            <BlockList id="A" blocks={data1} />
          </DragDropProvider>
        </View>
      </View>
    </SafeAreaView>
  );
}
