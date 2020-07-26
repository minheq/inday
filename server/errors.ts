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

export class UnauthorizedError extends Error {
  constructor() {
    super('not authorized');
  }
}
