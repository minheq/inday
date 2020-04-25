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

export function HomeScreen() {
  // const scrollRef = React.useRef<ScrollView>(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <View style={{ padding: 16 }}>
          <DragDropProvider>
            <View style={{ flexDirection: 'row' }}>
              <Draggable>
                <Text>Draggable!</Text>
              </Draggable>
              <View style={{ width: 100 }} />
              <Draggable>
                <Text>Draggable!</Text>
              </Draggable>
            </View>
            <View style={{ height: 100 }} />
            <View style={{ flexDirection: 'row' }}>
              <DropTarget>
                <Text>DropTarget!</Text>
              </DropTarget>
              <View style={{ width: 100 }} />
              <DropTarget>
                <Text>DropTarget!</Text>
              </DropTarget>
            </View>
          </DragDropProvider>
        </View>
      </View>
    </SafeAreaView>
  );
}
