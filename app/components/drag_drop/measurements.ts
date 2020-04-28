import { UIManager, findNodeHandle } from 'react-native';

export interface Measurements {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
}

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
