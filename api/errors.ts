export class NotFoundError extends Error {
  entity: string;
  id: string;

  constructor(entity: string, id: string) {
    super(`${entity} not found with id=${id}`);
    this.entity = entity;
    this.id = id;
  }
}

export class AuthenticationError extends Error {
  constructor() {
    super("not authenticated");
  }
}

export type ValidationErrorField = { field: string; message: string };

export class ValidationError extends Error {
  fields: ValidationErrorField[];

  constructor(fields: ValidationErrorField[]) {
    super();
    this.fields = fields;
  }
}

export class BadRequestError extends Error {}

export class UnauthorizedError extends Error {
  constructor() {
    super("not authorized");
  }
}
