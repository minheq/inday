export const helllllo = '';
// import React from 'react';
// import { Animated, StyleSheet, View, Text } from 'react-native';
// import { useGestureDetector, GestureDetectorConfig } from './gesture_detector';
// import { useDraggable } from './drag_drop/use_draggable';

// interface Block {
//   id: string;
//   title: string;
//   note: string;
// }

// interface BlockCardProps {
//   block: Block;
// }

// export function BlockCard(props: BlockCardProps) {
//   const { block } = props;

//   const draggable = useDraggable({
//     onDragStarted: () => {
//       console.log('BlockCard:onDragStarted');
//     },
//     onDragEnd: () => {
//       console.log('BlockCard:onDragEnd');
//     },
//     onDraggableCanceled: () => {
//       console.log('BlockCard:onDraggableCanceled');
//     },
//     onDragCompleted: () => {
//       console.log('BlockCard:onDragCompleted');
//     },
//   });

//   const config: GestureDetectorConfig = React.useMemo(() => {
//     let isLongPress = false;

//     return {
//       onPress: () => {
//         // console.log('BlockCard:onPress');
//       },
//       onLongPress: () => {
//         // console.log('BlockCard:onLongPress');
//         isLongPress = true;
//       },
//       onDragStart: () => {
//         // console.log('BlockCard:onDragStart');
//         draggable.startDrag();
//         // pan.setOffset({
//         //   x: pan.x._value,
//         //   y: pan.y._value,
//         // });
//       },
//       onDragMove: (event, state) => {
//         // console.log('BlockCard:onDragMove');
//         if (isLongPress) {
//           draggable.drag();
//         } else {
//           draggable.pan.setValue({
//             x: state.dx,
//             y: 0,
//           });
//         }
//       },
//       onDragEnd: () => {
//         // console.log('BlockCard:onDragEnd');
//         draggable.endDrag();
//         isLongPress = false;
//       },
//     };
//   }, [draggable]);

//   const eventHandlers = useGestureDetector(config);

//   return (
//     <Animated.View
//       // @ts-ignore
//       ref={draggable.ref}
//       accessible
//       style={[
//         {
//           transform: [
//             { translateX: draggable.pan.x },
//             { translateY: draggable.pan.y },
//           ],
//         },
//       ]}
//       {...eventHandlers}
//     >
//       <View style={[styles.block]}>
//         <Text style={styles.blockTitle}>{block.title}</Text>
//         <Text style={styles.blockNote}>{block.note}</Text>
//       </View>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f0f0f0',
//   },
//   block: {
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//     backgroundColor: '#fff',
//     padding: 16,
//     borderColor: '#f0f0f0',
//     borderBottomWidth: 1,
//   },
//   blockTitle: {
//     fontWeight: 'bold',
//   },
//   active: {
//     backgroundColor: 'green',
//   },
//   blockNote: {},
// });
