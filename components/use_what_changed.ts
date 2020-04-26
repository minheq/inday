import React from 'react';

export function useWhatChanged(...args: any[]) {
  const prevArg0 = React.useRef(args[0]).current;
  const prevArg1 = React.useRef(args[1]).current;
  const prevArg2 = React.useRef(args[2]).current;
  const prevArg3 = React.useRef(args[3]).current;
  const prevArg4 = React.useRef(args[4]).current;

  React.useEffect(() => {
    if (prevArg0 && prevArg0 !== args[0]) {
      console.log(`arg 0 changed, prev=${prevArg0} next=${args[0]}`);
    }
    if (prevArg1 && prevArg1 !== args[1]) {
      console.log(`arg 1 changed, prev=${prevArg1} next=${args[1]}`);
    }
    if (prevArg2 && prevArg2 !== args[2]) {
      console.log(`arg 2 changed, prev=${prevArg2} next=${args[2]}`);
    }
    if (prevArg3 && prevArg3 !== args[3]) {
      console.log(`arg 3 changed, prev=${prevArg3} next=${args[3]}`);
    }
    if (prevArg4 && prevArg4 !== args[4]) {
      console.log(`arg 4 changed, prev=${prevArg4} next=${args[4]}`);
    }
  });
}
