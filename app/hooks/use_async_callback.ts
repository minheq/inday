import React from 'react';
import { AsyncState } from './use_async';

export type AsyncCallback<Result = any, Args extends any[] = any[]> = [
  AsyncState<Result>,
  (...args: Args | []) => Promise<void>,
];

export function useAsyncCallback<Result = any, Args extends any[] = any[]>(
  fn: (...args: Args | []) => Promise<Result>,
): AsyncCallback<Result, Args> {
  const [state, setState] = React.useState<AsyncState<Result>>({
    loading: false,
  });

  const callback = React.useCallback(
    async (...args: Args | []) => {
      if (state.loading === true) {
        return;
      }

      setState({ loading: true });

      try {
        const data = await fn(...args);

        setState({ data, loading: false });
      } catch (error) {
        setState({ error, loading: false });
      }
    },
    [fn, state],
  );

  return [state, callback];
}
