export type AsyncState<T> =
  | {
      loading: boolean;
      error?: undefined;
      data?: undefined;
    }
  | {
      loading: false;
      error: Error;
      data?: undefined;
    }
  | {
      loading: false;
      error?: undefined;
      data: T;
    };

interface Cache<TResult = any> {
  id: string;
  fn: Promise<void>;
  result?: TResult;
  error?: Error;
}

function createUseAsync() {
  const caches: { [id: string]: Cache } = {};

  function useAsync<TResult = any>(id: string, fn: () => Promise<TResult>) {
    const existingCache = caches[id];

    if (existingCache) {
      if (existingCache.result) {
        return existingCache.result;
      } else if (existingCache.error) {
        throw existingCache.error;
      }

      throw existingCache.fn;
    }

    const cache: Cache<TResult> = {
      id,
      fn: fn()
        .then((result) => {
          cache.result = result;
        })
        .catch((error) => {
          cache.error = error;
        }),
    };

    caches[id] = cache;

    throw cache.fn;
  }

  return useAsync;
}

export const useAsync = createUseAsync();
