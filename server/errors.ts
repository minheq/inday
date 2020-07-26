export class NotFoundError extends Error {
  constructor(entity: string) {
    super(`${entity} not found`);
  }
}

export class AuthenticationError extends Error {
  constructor() {
    super('not authenticated');
  }
}

type FieldError = { field: string; message: string };
export class ValidationError extends Error {
  fields: FieldError[];

  constructor(fields: FieldError[]) {
    super();
    this.fields = fields;
  }
}

export class BadRequestError extends Error {}

export class UnauthorizedError extends Error {
  constructor() {
    super('not authorized');
  }
}
