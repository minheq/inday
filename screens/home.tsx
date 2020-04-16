import React from 'react';
import { Dimensions, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { SortableList, RenderItemProps } from '../components/sortable_list';
import { ListItem } from '../components/list_item';

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

const { width } = Dimensions.get('window');

const parentWidth = width;
const childrenWidth = width;
const childrenHeight = 80;

export class HomeScreen extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      data: TEST_DATA,
    };
  }

  handleDataChange = (data: Block[]) => {
    if (data.length !== this.state.data.length) {
      this.setState({
        data: data,
      });
    }
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <SortableList<Block>
          dataSource={this.state.data}
          parentWidth={parentWidth}
          childrenWidth={childrenWidth}
          childrenHeight={childrenHeight}
          keyExtractor={(item) => item.id}
          onDataChange={this.handleDataChange}
          renderItem={this.renderItem}
        />
      </SafeAreaView>
    );
  }

  renderItem = (props: RenderItemProps<Block>) => {
    const { item, onLongPress, onPressOut, isActive } = props;

    return (
      <ListItem item={item} onLongPress={onLongPress} onPressOut={onPressOut}>
        <View style={[styles.block, isActive && styles.active]}>
          <Text style={styles.blockTitle}>{item.title}</Text>
          <Text style={styles.blockNote}>{item.note}</Text>
        </View>
      </ListItem>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  block: {
    width: childrenWidth,
    height: childrenHeight,
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
