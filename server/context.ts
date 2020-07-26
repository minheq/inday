import { FastifyRequest } from 'fastify';

type Request = FastifyRequest;

export interface AuthenticatedContext {
  userID: string;
}

export interface UnauthenticatedContext {
  userID?: string;
}

export type Context = AuthenticatedContext | UnauthenticatedContext;

export async function createContext(_req: Request): Promise<Context> {
  return {
    userID: '1',
  };
}
