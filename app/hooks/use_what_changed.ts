import { useRef } from 'react';

export function useWhatChanged<T extends unknown[]>(...args: T): boolean {
  const arg0 = args[0];
  const arg1 = args[1];
  const arg2 = args[2];
  const arg3 = args[3];
  const arg4 = args[4];
  const prevArg0Ref = useRef(arg0);
  const prevArg1Ref = useRef(arg1);
  const prevArg2Ref = useRef(arg2);
  const prevArg3Ref = useRef(arg3);
  const prevArg4Ref = useRef(arg4);
  const prevArg0 = prevArg0Ref.current;
  const prevArg1 = prevArg1Ref.current;
  const prevArg2 = prevArg2Ref.current;
  const prevArg3 = prevArg3Ref.current;
  const prevArg4 = prevArg4Ref.current;

  let changed = false;

  if (prevArg0 && prevArg0 !== arg0) {
    console.log(
      `arg 0 changed, prev=${JSON.stringify(prevArg0)} next=${JSON.stringify(
        arg0,
      )}`,
    );
    changed = true;
  }
  if (prevArg1 && prevArg1 !== arg1) {
    console.log(
      `arg 1 changed, prev=${JSON.stringify(prevArg1)} next=${JSON.stringify(
        arg1,
      )}`,
    );
    changed = true;
  }
  if (prevArg2 && prevArg2 !== arg2) {
    console.log(
      `arg 2 changed, prev=${JSON.stringify(prevArg2)} next=${JSON.stringify(
        arg2,
      )}`,
    );
    changed = true;
  }
  if (prevArg3 && prevArg3 !== arg3) {
    console.log(
      `arg 3 changed, prev=${JSON.stringify(prevArg3)} next=${JSON.stringify(
        arg3,
      )}`,
    );
    changed = true;
  }
  if (prevArg4 && prevArg4 !== arg4) {
    console.log(
      `arg 4 changed, prev=${JSON.stringify(prevArg4)} next=${JSON.stringify(
        arg4,
      )}`,
    );
    changed = true;
  }

  prevArg0Ref.current = arg0;
  prevArg1Ref.current = arg1;
  prevArg2Ref.current = arg2;
  prevArg3Ref.current = arg3;
  prevArg4Ref.current = arg4;

  return changed;
}
