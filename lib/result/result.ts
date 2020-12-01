type OkCallback<T, K> = (data: T) => K;
type ErrCallback<K> = (error: Error) => K;

interface BaseResult {
  match: {
    ok: <T, K>(data: T) => K;
  };
}

interface Ok<T> {
  ok: true;
  data: T;
}

interface Err<E> {
  ok: false;
  error: E;
}

export type Result<T, E> = Ok<T> | Err<E>;

export const Result = {
  ok: <T>(data: T): Ok<T> => {
    return {
      ok: true,
      data,
    };
  },
  err: <E>(error: E): Err<E> => {
    return {
      ok: false,
      error,
    };
  },
};
