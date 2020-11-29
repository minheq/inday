export interface Measurements {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
}

export const Measurements = {
  initial: (): Measurements => ({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    pageX: 0,
    pageY: 0,
  }),
  isEqual: (m1: Measurements, m2: Measurements): boolean => {
    return (
      m1.height === m2.height &&
      m1.pageX === m2.pageX &&
      m1.pageY === m2.pageY &&
      m1.width === m2.width &&
      m1.x === m2.x &&
      m1.y === m2.y
    );
  },
  fromArray: (
    arr: [
      x: number,
      y: number,
      width: number,
      height: number,
      pageX: number,
      pageY: number,
    ],
  ): Measurements => {
    const [x, y, width, height, pageX, pageY] = arr;

    return {
      x,
      y,
      width,
      height,
      pageX,
      pageY,
    };
  },
};
