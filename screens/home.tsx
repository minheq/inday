import React from 'react';
import { SafeAreaView } from 'react-native';
import { BlockListItem } from '../components/block_list_item';

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
      {blocks.map((block) => (
        <BlockListItem block={block} />
      ))}
    </SafeAreaView>
  );
}
