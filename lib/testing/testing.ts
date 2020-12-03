import { test as zora } from 'zora';

interface Assert {
  deepEqual: <T>(valA: T, valB: T, description?: string) => void;
  throws: <T extends () => void>(fn: T, description?: string) => void;
  fail: (description?: string) => void;
}

type Spec = (assert: Assert) => Promise<void> | void;

export function test(description: string, spec: Spec): void {
  void zora(description, async (t) => {
    await spec(t);
  });
}
