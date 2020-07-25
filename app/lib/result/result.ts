class ResultOk<T> {
  public readonly ok: true = true;
  public readonly err: false = false;
  private readonly data: T;

  constructor(data: T) {
    this.data = data;
  }

  public unwrap(): T {
    return this.data;
  }

  public wrap(_err: ResultErr): void {
    throw new Error('Tried to wrap ok result');
  }
}

class ResultErr {
  public readonly ok: false = false;
  public readonly err: true = true;
  public readonly error: Error;

  constructor(error: Error) {
    this.error = error;
  }

  public unwrap(): void {
    throw new Error(`Tried to unwrap Error: ${this.error.message}`);
  }

  public wrap(resultErr: ResultErr): ResultErr {
    return new ResultErr(resultErr.error);
  }
}

export type Result<T> = ResultOk<T> | ResultErr;

function ok(): ResultOk<void>;
function ok<T>(data: T): ResultOk<T>;
function ok(data?: any) {
  if (data) {
    return new ResultOk(data);
  }

  return new ResultOk(undefined);
}

function err(error: Error): ResultErr {
  return new ResultErr(error);
}

export const Result = {
  ok,
  err,
};
