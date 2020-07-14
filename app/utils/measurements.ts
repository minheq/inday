import { UIManager, findNodeHandle } from 'react-native';

export interface Measurements {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
}

export const initialMeasurements: Measurements = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  pageX: 0,
  pageY: 0,
};

export async function measure(
  ref: React.MutableRefObject<any>,
): Promise<Measurements> {
  return new Promise((resolve, reject) => {
    function measureOnSuccessCallback(
      x: number,
      y: number,
      width: number,
      height: number,
      pageX: number,
      pageY: number,
    ) {
      const measurements = {
        x,
        y,
        width,
        height,
        pageX,
        pageY,
      };

      resolve(measurements);
    }

    if (ref.current) {
      if (ref.current.measure) {
        ref.current.measure(measureOnSuccessCallback);
      } else {
        const handle = findNodeHandle(ref.current);

        if (handle) {
          UIManager.measure(handle, measureOnSuccessCallback);
        } else {
          reject('Could not measure');
        }
      }
    } else {
      reject('Ref node not ready for measurement');
    }
  });
}

export function areMeasurementsEqual(
  m1: Measurements,
  m2: Measurements,
): boolean {
  return (
    m1.height === m2.height &&
    m1.pageX === m2.pageX &&
    m1.pageY === m2.pageY &&
    m1.width === m2.width &&
    m1.x === m2.x &&
    m1.y === m2.y
  );
}
