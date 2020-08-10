export function defer<T extends Function>(fn: T, ms: number) {
  return setTimeout(fn, ms);
}

export function wait(ms: number = 0): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
