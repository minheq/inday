import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { BlockCard } from '../components/block_card';

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
];

export function HomeScreen() {
  const scrollRef = React.useRef<ScrollView>(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView ref={scrollRef}>
        {blocks.map((block) => (
          <BlockCard key={block.id} block={block} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
