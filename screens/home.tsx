import React from 'react';
import { Dimensions, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { SortableList } from '../components/sortable_list';

interface Item {
  txt: number;
}

const TEST_DATA: Item[] = [
  { txt: 1 },
  { txt: 2 },
  { txt: 3 },
  { txt: 4 },
  { txt: 5 },
  { txt: 6 },
  { txt: 7 },
  { txt: 8 },
  { txt: 9 },
  { txt: 10 },
  { txt: 11 },
  { txt: 12 },
  { txt: 13 },
  { txt: 14 },
  { txt: 15 },
  { txt: 16 },
  { txt: 17 },
  { txt: 18 },
  { txt: 19 },
  { txt: 20 },
  { txt: 21 },
  { txt: 22 },
  { txt: 23 },
  { txt: 24 },
  { txt: 25 },
  { txt: 26 },
];

const { width } = Dimensions.get('window');

const parentWidth = width;
const childrenWidth = width - 20;
const childrenHeight = 48;

export class HomeScreen extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      data: TEST_DATA,
    };
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.header_title}>
            Automatic Sliding: Single Line
          </Text>
        </View>
        <SortableList
          dataSource={this.state.data}
          parentWidth={parentWidth}
          childrenWidth={childrenWidth}
          delayLongPress={200}
          marginChildrenBottom={10}
          marginChildrenRight={10}
          marginChildrenLeft={10}
          marginChildrenTop={10}
          childrenHeight={childrenHeight}
          onDataChange={(data) => {
            if (data.length !== this.state.data.length) {
              this.setState({
                data: data,
              });
            }
          }}
          keyExtractor={(item) => item.txt}
          renderItem={(item) => {
            return this.renderItem(item);
          }}
        />
      </SafeAreaView>
    );
  }

  renderItem(item: Item) {
    return (
      <View style={styles.item}>
        <View style={styles.item_icon_swipe}>
          <View style={styles.item_icon} />
        </View>
        <Text style={styles.item_text}>{item.txt}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#2ecc71',
    borderBottomWidth: 2,
  },
  header_title: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
  },
  item: {
    width: childrenWidth,
    height: childrenHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2ecc71',
    borderRadius: 4,
  },
  item_icon_swipe: {
    width: childrenHeight - 10,
    height: childrenHeight - 10,
    backgroundColor: '#fff',
    borderRadius: (childrenHeight - 10) / 2,
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item_icon: {
    width: childrenHeight - 20,
    height: childrenHeight - 20,
    resizeMode: 'contain',
  },
  item_text: {
    color: '#fff',
    fontSize: 20,
    marginRight: 20,
    fontWeight: 'bold',
  },
});
