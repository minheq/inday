import { isEqual } from "./lang_utils";

type DeepEqualFn = <T>(valA: T, valB: T, description?: string) => void;
type FailFn = (description?: string) => void;

interface Assert {
  deepEqual: DeepEqualFn;
  fail: FailFn;
}

type Spec = (assert: Assert) => Promise<void> | void;

export function test(description: string, spec: Spec): void {
  const deepEqual: DeepEqualFn = (valA, valB, d) => {
    if (isEqual(valA, valB) === false) {
      throw new Error(`${description}${d ? `- ${d}` : ""}`);
    }
  };

  const fail: FailFn = (d) => {
    throw new Error(`${description}${d ? `- ${d}` : ""}`);
  };

  const assert: Assert = {
    deepEqual,
    fail,
  };

  void spec(assert);
}
