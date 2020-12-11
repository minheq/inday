export function isPromise<T>(p: unknown): p is Promise<T> {
  return !!(p && Object.prototype.toString.call(p) === '[object Promise]');
}
