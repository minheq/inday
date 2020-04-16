import React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  StyleSheet,
  View,
  ScrollView,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
  GestureResponderEvent,
  LayoutChangeEvent,
} from 'react-native';

const { width } = Dimensions.get('window');

const defaultZIndex = 8;
const touchZIndex = 99;

type ScaleStatus = 'scale' | 'scaleX' | 'scaleY';

export interface RenderItemProps<T = any> {
  item: T;
  isActive: boolean;
  index: number;
  onLongPress: () => void;
  onPressOut: () => void;
}

interface SortableListProps<T = any> {
  dataSource: T[];
  parentWidth: number;
  childrenHeight: number;
  childrenWidth: number;

  sortable: boolean;

  onClickItem?: (originalData: T[], item: T, index: number) => void;
  onDragStart?: (touchIndex: number) => void;
  onDragEnd?: (index: number, toIndex: number) => void;
  onDataChange?: (data: T[]) => void;
  renderItem: (props: RenderItemProps<T>) => React.ReactElement;
  scaleStatus: ScaleStatus;
  fixedItems: number[];
  keyExtractor?: (item: T, index: number) => string;
  isDragFreely?: boolean;
  onDragging?: (
    gestureState: {
      dx: number;
      dy: number;
      vy?: number | undefined;
    },
    left: number,
    top: number,
    moveToIndex: number,
  ) => void;
  maxScale: number;
  minOpacity: number;
  scaleDuration: number;
  slideDuration: number;
  autoThrottle: number;
  autoThrottleDuration: number;
  renderHeaderView?: () => React.ReactElement;
  headerViewHeight: number;
  renderBottomView?: () => React.ReactElement;
  bottomViewHeight: number;
}
interface ListItem<T = any> {
  data: T;
  originIndex: number;
  originLeft: number;
  originTop: number;
  position: Animated.ValueXY;
  scaleValue: Animated.Value;
}
interface SortableListState<T = any> {
  dataSource: ListItem<T>[];
  curPropsDataSource: T[];
  height: number;
  itemWidth: number;
  itemHeight: number;
  scrollEnabled: boolean;
}

enum ForceScrollStatus {
  None = 0,
  Down = 1,
  OnlyDown = 2,
  Up = -1,
  OnlyUp = -2,
}

export class SortableList<T = any> extends React.Component<
  SortableListProps<T>,
  SortableListState<T>
> {
  public static defaultProps = {
    parentWidth: width,
    sortable: true,
    scaleStatus: 'scale',
    fixedItems: [],
    isDragFreely: false,
    maxScale: 1.1,
    minOpacity: 0.8,
    scaleDuration: 100,
    slideDuration: 300,
    autoThrottle: 2,
    autoThrottleDuration: 10,
    headerViewHeight: 0,
    bottomViewHeight: 0,
  };

  scrollRef: { current: ScrollView | null } = React.createRef();

  sortRefs = new Map<number, View>();

  isMovePanResponder: boolean = false;

  _panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => {
      this.isMovePanResponder = false;
      return false;
    },
    onMoveShouldSetPanResponder: () => this.isMovePanResponder,
    onMoveShouldSetPanResponderCapture: () => this.isMovePanResponder,

    onPanResponderGrant: () => {},
    onPanResponderMove: (evt, gestureState) =>
      this.moveTouch(evt, gestureState),
    onPanResponderRelease: () => this.endTouch(),

    onPanResponderTerminationRequest: () => false,
    onShouldBlockNativeResponder: () => false,
  });

  autoInterval: number | null = null;
  isScaleRecovery: number | null = null;
  contentHeight: number = 0;
  frameHeight: number = 0;

  curScrollData: {
    totalHeight: number;
    windowHeight: number;
    offsetY: number;
    hasScroll: boolean;
  } | null = null;

  touchCurItem: {
    ref: View;
    index: number;
    originLeft: number;
    originTop: number;
    moveToIndex: number;
  } | null = null;

  isHasMove: boolean = false;

  constructor(props: SortableListProps<T>) {
    super(props);

    const itemWidth = props.childrenWidth;
    const itemHeight = props.childrenHeight;

    const rowNum = Math.floor(props.parentWidth / itemWidth);

    const dataSource: ListItem<T>[] = props.dataSource.map((item, index) => {
      const left = (index % rowNum) * itemWidth;
      const top = Math.floor(index / rowNum) * itemHeight;

      return {
        data: item,
        originIndex: index,
        originLeft: left,
        originTop: top,
        position: new Animated.ValueXY({
          x: Math.floor(left + 0.5),
          y: Math.floor(top + 0.5),
        }),
        scaleValue: new Animated.Value(1),
      };
    });

    this.state = {
      dataSource,
      curPropsDataSource: props.dataSource,
      height: Math.ceil(dataSource.length / rowNum) * itemHeight,
      itemWidth,
      itemHeight,
      scrollEnabled: true,
    };
  }

  static getDerivedStateFromProps<T>(
    nextProps: SortableListProps<T>,
    prevState: SortableListState<T>,
  ) {
    const itemWidth = nextProps.childrenWidth;
    const itemHeight = nextProps.childrenHeight;
    if (
      nextProps.dataSource !== prevState.curPropsDataSource ||
      itemWidth !== prevState.itemWidth ||
      itemHeight !== prevState.itemHeight
    ) {
      const rowNum = Math.floor(nextProps.parentWidth / itemWidth);

      const dataSource: ListItem<T>[] = nextProps.dataSource.map(
        (item, index) => {
          const left = (index % rowNum) * itemWidth;
          const top = Math.floor(index / rowNum) * itemHeight;

          return {
            data: item,
            originIndex: index,
            originLeft: left,
            originTop: top,
            position: new Animated.ValueXY({
              x: Math.floor(left + 0.5),
              y: Math.floor(top + 0.5),
            }),
            scaleValue: new Animated.Value(1),
          };
        },
      );

      return {
        dataSource: dataSource,
        curPropsDataSource: nextProps.dataSource,
        height: Math.ceil(dataSource.length / rowNum) * itemHeight,
        itemWidth,
        itemHeight,
        scrollEnabled: false,
      };
    }
    return null;
  }

  componentDidMount() {
    this.initTag();
  }

  autoObj: {
    curDy: number;
    scrollDx: number;
    scrollDy: number;
    hasScrollDy: number;
    forceScrollStatus: ForceScrollStatus;
  } = {
    curDy: 0,
    scrollDx: 0,
    scrollDy: 0,
    hasScrollDy: 0,
    forceScrollStatus: ForceScrollStatus.None,
  };

  // Initialization tag
  initTag = () => {
    this.clearAutoInterval();
    this.autoObj = {
      curDy: 0,
      scrollDx: 0,
      scrollDy: 0,
      hasScrollDy: 0,
      forceScrollStatus: ForceScrollStatus.None,
    };
  };

  // Unified processing
  dealtScrollStatus = () => {
    const scrollData = this.curScrollData;
    if (scrollData == null || scrollData.offsetY == null) {
      return;
    }
    const { totalHeight, windowHeight, offsetY } = scrollData;
    if (totalHeight <= windowHeight + offsetY) {
      this.autoObj.forceScrollStatus = ForceScrollStatus.OnlyUp;
    } else if (offsetY <= 0) {
      this.autoObj.forceScrollStatus = ForceScrollStatus.OnlyDown;
    }
  };

  // Handle automatic slide timer
  clearAutoInterval = () => {
    if (this.autoInterval) {
      clearInterval(this.autoInterval);
      this.autoInterval = null;
    }
  };

  startAutoScroll = () => {
    if (this.autoInterval != null) {
      return;
    }

    // Start automatic swipe
    this.autoInterval = setInterval(() => {
      if (
        this.autoObj.forceScrollStatus === ForceScrollStatus.None ||
        this.autoObj.forceScrollStatus === ForceScrollStatus.OnlyDown ||
        this.autoObj.forceScrollStatus === ForceScrollStatus.OnlyUp
      ) {
        this.clearAutoInterval();
        return;
      }
      // Anti-shake 1.x1
      if (this.curScrollData && !this.curScrollData.hasScroll) {
        return;
      }
      if (this.autoObj.forceScrollStatus === ForceScrollStatus.Down) {
        this.autoObj.scrollDy = this.autoObj.scrollDy + this.props.autoThrottle;
      } else if (this.autoObj.forceScrollStatus === ForceScrollStatus.Up) {
        this.autoObj.scrollDy = this.autoObj.scrollDy - this.props.autoThrottle;
      }
      this.scrollTo(this.autoObj.scrollDy, false);
      this.dealtScrollStatus();
      // Android slide time 30ms-50ms, iOS close to 0ms, optimize Android jitter
      if (Platform.OS === 'android') {
        setTimeout(() => {
          if (this.isHasMove) {
            this.moveTouch(null, {
              dx: this.autoObj.scrollDx,
              dy: this.autoObj.curDy + this.autoObj.scrollDy,
            });
          }
        }, 0);
      } else {
        this.moveTouch(null, {
          dx: this.autoObj.scrollDx,
          dy: this.autoObj.curDy + this.autoObj.scrollDy,
        });
      }
    }, this.props.autoThrottleDuration);
  };

  startTouch(touchIndex: number) {
    //Prevent drag
    const fixedItems = this.props.fixedItems;
    if (fixedItems.length > 0 && fixedItems.includes(touchIndex)) {
      return;
    }

    this.isHasMove = false;

    if (!this.props.sortable) {
      return;
    }

    if (this.sortRefs.has(touchIndex)) {
      // Initialization data
      if (this.curScrollData) {
        this.autoObj.hasScrollDy = this.curScrollData.offsetY;
        this.autoObj.scrollDy = this.curScrollData.offsetY;
      }

      this.setState({
        scrollEnabled: false,
      });
      if (this.props.onDragStart) {
        this.props.onDragStart(touchIndex);
      }
      Animated.timing(this.state.dataSource[touchIndex].scaleValue, {
        toValue: this.props.maxScale,
        duration: this.props.scaleDuration,
        useNativeDriver: false,
      }).start(() => {
        let ref = this.sortRefs.get(touchIndex) as View;

        this.touchCurItem = {
          ref,
          index: touchIndex,
          originLeft: this.state.dataSource[touchIndex].originLeft,
          originTop: this.state.dataSource[touchIndex].originTop,
          moveToIndex: touchIndex,
        };

        ref.setNativeProps({
          style: {
            zIndex: touchZIndex,
          },
        });
        this.isMovePanResponder = true;
      });
    }
  }

  moveTouch(
    nativeEvent: GestureResponderEvent | null,
    gestureState: { dx: number; dy: number; vy?: number },
  ) {
    this.isHasMove = true;

    if (this.touchCurItem) {
      let { dx, dy, vy } = gestureState;
      const itemWidth = this.state.itemWidth;
      const itemHeight = this.state.itemHeight;

      const rowNum = Math.floor(this.props.parentWidth / itemWidth);
      const maxWidth = this.props.parentWidth - itemWidth;
      const maxHeight =
        itemHeight * Math.ceil(this.state.dataSource.length / rowNum) -
        itemHeight;

      // Is it free to drag
      if (!this.props.isDragFreely) {
        // Maximum or minimum after out of bounds
        if (this.touchCurItem.originLeft + dx < 0) {
          dx = -this.touchCurItem.originLeft;
        } else if (this.touchCurItem.originLeft + dx > maxWidth) {
          dx = maxWidth - this.touchCurItem.originLeft;
        }
        if (!this.curScrollData) {
          if (this.touchCurItem.originTop + dy < 0) {
            dy = -this.touchCurItem.originTop;
          } else if (this.touchCurItem.originTop + dy > maxHeight) {
            dy = maxHeight - this.touchCurItem.originTop;
          }
        }
      }

      if (this.curScrollData) {
        const curDis =
          this.touchCurItem.originTop + dy - this.autoObj.hasScrollDy;
        if (nativeEvent != null) {
          const tempForceScrollStatus = this.autoObj.forceScrollStatus;
          // Automatic sliding
          const minDownDiss =
            curDis +
            this.props.childrenHeight * (1 + (this.props.maxScale - 1) / 2) +
            this.props.headerViewHeight;
          const maxUpDiss = curDis + this.props.headerViewHeight;
          if (
            (tempForceScrollStatus === ForceScrollStatus.None ||
              tempForceScrollStatus === ForceScrollStatus.OnlyDown) &&
            vy &&
            vy > 0.01 &&
            this.curScrollData &&
            minDownDiss > this.curScrollData.windowHeight
          ) {
            this.autoObj.curDy = dy;
            this.autoObj.forceScrollStatus = ForceScrollStatus.Down;
            this.startAutoScroll();
          } else if (
            (tempForceScrollStatus === ForceScrollStatus.None ||
              tempForceScrollStatus === ForceScrollStatus.OnlyUp) &&
            vy &&
            -vy > 0.01 &&
            maxUpDiss < 0
          ) {
            this.autoObj.curDy = dy;
            this.autoObj.forceScrollStatus = ForceScrollStatus.Up;
            this.startAutoScroll();
          }
        }

        // Determine whether to change steering
        if (vy != null) {
          // Slide down 1、2
          if (
            (this.autoObj.forceScrollStatus === ForceScrollStatus.Down ||
              this.autoObj.forceScrollStatus === ForceScrollStatus.OnlyDown) &&
            -vy > 0.01
          ) {
            this.autoObj.forceScrollStatus = ForceScrollStatus.None;
            // Slide up -1、-2
          } else if (
            (this.autoObj.forceScrollStatus === ForceScrollStatus.Up ||
              this.autoObj.forceScrollStatus === ForceScrollStatus.OnlyUp) &&
            vy > 0.01
          ) {
            this.autoObj.forceScrollStatus = ForceScrollStatus.None;
          }
        }

        // Remember the X axis
        this.autoObj.scrollDx = dx;
        // Correction data 1
        dy = dy - this.autoObj.hasScrollDy;
        if (nativeEvent != null) {
          // Correction data 2
          dy = dy + this.autoObj.scrollDy;
          // Prevent fingers from sliding when sliding automatically
          if (
            this.autoObj.forceScrollStatus === ForceScrollStatus.Down ||
            this.autoObj.forceScrollStatus === ForceScrollStatus.Up
          ) {
            return;
          }
        }
      }

      const left = this.touchCurItem.originLeft + dx;
      const top = this.touchCurItem.originTop + dy;

      this.state.dataSource[this.touchCurItem.index].position.setValue({
        x: left,
        y: top,
      });

      let moveToIndex = 0;
      let moveXNum = dx / itemWidth;
      let moveYNum = dy / itemHeight;
      if (moveXNum > 0) {
        moveXNum = Math.floor(moveXNum + 0.5);
      } else if (moveXNum < 0) {
        moveXNum = Math.floor(moveXNum - 0.5);
      }
      if (moveYNum > 0) {
        moveYNum = Math.floor(moveYNum + 0.5);
      } else if (moveYNum < 0) {
        moveYNum = Math.floor(moveYNum - 0.5);
      }

      moveToIndex = this.touchCurItem.index + moveXNum + moveYNum * rowNum;

      if (moveToIndex > this.state.dataSource.length - 1) {
        moveToIndex = this.state.dataSource.length - 1;
      } else if (moveToIndex < 0) {
        moveToIndex = 0;
      }

      if (this.props.onDragging) {
        this.props.onDragging(gestureState, left, top, moveToIndex);
      }

      if (this.touchCurItem.moveToIndex !== moveToIndex) {
        const fixedItems = this.props.fixedItems;
        if (fixedItems.length > 0 && fixedItems.includes(moveToIndex)) {
          return;
        }

        this.touchCurItem.moveToIndex = moveToIndex;
        this.state.dataSource.forEach((item, index) => {
          let nextItem = null;
          if (this.touchCurItem) {
            if (index > this.touchCurItem.index && index <= moveToIndex) {
              nextItem = this.state.dataSource[index - 1];
            } else if (
              index >= moveToIndex &&
              index < this.touchCurItem.index
            ) {
              nextItem = this.state.dataSource[index + 1];
            } else if (
              index !== this.touchCurItem.index &&
              ((item.position.x as any)._value !== item.originLeft ||
                (item.position.y as any)._value !== item.originTop)
            ) {
              nextItem = this.state.dataSource[index];
            } else if (
              (this.touchCurItem.index - moveToIndex > 0 &&
                moveToIndex === index + 1) ||
              (this.touchCurItem.index - moveToIndex < 0 &&
                moveToIndex === index - 1)
            ) {
              nextItem = this.state.dataSource[index];
            }
          }

          if (nextItem != null) {
            Animated.timing(item.position, {
              toValue: {
                x: Math.floor(nextItem.originLeft + 0.5),
                y: Math.floor(nextItem.originTop + 0.5),
              },
              duration: this.props.slideDuration,
              easing: Easing.out(Easing.quad),
              useNativeDriver: false,
            }).start();
          }
        });
      }
    }
  }

  endTouch() {
    this.isHasMove = false;

    this.initTag();
    //clear
    if (this.touchCurItem) {
      this.setState({
        scrollEnabled: true,
      });
      if (this.props.onDragEnd) {
        this.props.onDragEnd(
          this.touchCurItem.index,
          this.touchCurItem.moveToIndex,
        );
      }

      Animated.timing(
        this.state.dataSource[this.touchCurItem.index].scaleValue,
        {
          toValue: 1,
          duration: this.props.scaleDuration,
          useNativeDriver: false,
        },
      ).start(() => {
        if (this.touchCurItem) {
          this.touchCurItem.ref.setNativeProps({
            style: {
              zIndex: defaultZIndex,
            },
          });
          this.changePosition(
            this.touchCurItem.index,
            this.touchCurItem.moveToIndex,
          );
          this.touchCurItem = null;
        }
      });
    }
  }

  onPressOut() {
    this.isScaleRecovery = setTimeout(() => {
      if (this.isMovePanResponder && !this.isHasMove) {
        this.endTouch();
      }
    }, 220);
  }

  changePosition(startIndex: number, endIndex: number) {
    if (startIndex === endIndex) {
      const curItem = this.state.dataSource[startIndex];
      if (curItem != null) {
        curItem.position.setValue({
          x: Math.floor(curItem.originLeft + 0.5),
          y: Math.floor(curItem.originTop + 0.5),
        });
      }
      return;
    }

    let isCommon = true;
    if (startIndex > endIndex) {
      isCommon = false;
      let tempIndex = startIndex;
      startIndex = endIndex;
      endIndex = tempIndex;
    }

    const newDataSource = [...this.state.dataSource].map((item, index) => {
      let newIndex = null;
      if (isCommon) {
        if (endIndex > index && index >= startIndex) {
          newIndex = index + 1;
        } else if (endIndex === index) {
          newIndex = startIndex;
        }
      } else {
        if (endIndex >= index && index > startIndex) {
          newIndex = index - 1;
        } else if (startIndex === index) {
          newIndex = endIndex;
        }
      }

      if (newIndex != null) {
        const newItem = { ...this.state.dataSource[newIndex] };
        newItem.originLeft = item.originLeft;
        newItem.originTop = item.originTop;
        newItem.position = new Animated.ValueXY({
          x: Math.floor(item.originLeft + 0.5),
          y: Math.floor(item.originTop + 0.5),
        });
        item = newItem;
      }

      return item;
    });

    this.setState(
      {
        dataSource: newDataSource,
      },
      () => {
        if (this.props.onDataChange) {
          this.props.onDataChange(this.getOriginalData());
        }
        // Prevent RN from drawing the beginning and end
        const startItem = this.state.dataSource[startIndex];
        this.state.dataSource[startIndex].position.setValue({
          x: Math.floor(startItem.originLeft + 0.5),
          y: Math.floor(startItem.originTop + 0.5),
        });
        const endItem = this.state.dataSource[endIndex];
        this.state.dataSource[endIndex].position.setValue({
          x: Math.floor(endItem.originLeft + 0.5),
          y: Math.floor(endItem.originTop + 0.5),
        });
      },
    );
  }

  getOriginalData() {
    return this.state.dataSource.map((item) => item.data);
  }

  scrollTo = (height: number, animated = true) => {
    // Prevent iOS from sliding when elastically sliding negative numbers
    if (this.curScrollData) {
      if (
        this.autoObj.forceScrollStatus < ForceScrollStatus.None &&
        this.curScrollData.offsetY <= 0
      ) {
        this.autoObj.scrollDy = 0; // Correcting data system deviations
        return;
      } else if (
        this.autoObj.forceScrollStatus > ForceScrollStatus.None &&
        this.curScrollData.windowHeight + this.curScrollData.offsetY >=
          this.curScrollData.totalHeight
      ) {
        this.autoObj.scrollDy = this.curScrollData.offsetY; //Correcting data system deviations
        return;
      }
      //Barrel effect, the slowest is 1.x1
      this.curScrollData.hasScroll = false;
    }
    this.scrollRef.current?.scrollTo({ x: 0, y: height, animated });
  };

  handleScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.curScrollData = {
      totalHeight: nativeEvent.contentSize.height,
      windowHeight: nativeEvent.layoutMeasurement.height,
      offsetY: nativeEvent.contentOffset.y,
      hasScroll: true,
    };
  };

  handleLayout = (event: LayoutChangeEvent) => {
    this.frameHeight = event.nativeEvent.layout.height;
    // const maxOffset = this.contentHeight - this.frameHeight;
    // if (maxOffset < this.yOffset) {
    //   this.yOffset = maxOffset;
    // }
    this.curScrollData = {
      totalHeight: this.contentHeight,
      windowHeight: this.frameHeight,
      offsetY: 0,
      hasScroll: true,
    };
  };

  handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    this.contentHeight = contentHeight;
    // const maxOffset = this.contentHeight - this.frameHeight;
    // if (maxOffset < this.yOffset) {
    //   this.yOffset = maxOffset;
    // }
  };

  render() {
    return (
      <ScrollView
        bounces={false}
        scrollEventThrottle={1}
        ref={(ref) => (this.scrollRef.current = ref)}
        scrollEnabled={this.state.scrollEnabled}
        onScroll={this.handleScroll}
        onLayout={this.handleLayout}
        onContentSizeChange={this.handleContentSizeChange}
        style={styles.container}
      >
        {this.props.renderHeaderView ? this.props.renderHeaderView : null}
        <View
          style={[
            styles.swipe,
            {
              width: this.props.parentWidth,
              height: this.state.height,
            },
          ]}
        >
          {this._renderItemView()}
        </View>
        {this.props.renderBottomView ? this.props.renderBottomView : null}
      </ScrollView>
    );
  }

  _renderItemView = () => {
    return this.state.dataSource.map((item, index) => {
      const transformObj: { [scaleStatus: string]: Animated.Value } = {};
      transformObj[this.props.scaleStatus] = item.scaleValue;
      const key = this.props.keyExtractor
        ? this.props.keyExtractor(item.data, index)
        : item.originIndex;

      return (
        <Animated.View
          key={key}
          // @ts-ignore
          ref={(ref) => this.sortRefs.set(index, ref)}
          {...this._panResponder.panHandlers}
          style={[
            styles.item,
            {
              left: item.position.x,
              top: item.position.y,
              opacity: item.scaleValue.interpolate({
                inputRange: [1, this.props.maxScale],
                outputRange: [1, this.props.minOpacity],
              }),
              transform: [transformObj],
            },
          ]}
        >
          {this.props.renderItem({
            isActive: false,
            item: item.data,
            index,
            onPressOut: () => this.onPressOut(),
            onLongPress: () => this.startTouch(index),
          })}
        </Animated.View>
      );
    });
  };

  componentWillUnmount() {
    if (this.isScaleRecovery) {
      clearTimeout(this.isScaleRecovery);
    }
    this.clearAutoInterval();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swipe: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  item: {
    position: 'absolute',
    zIndex: defaultZIndex,
  },
});
