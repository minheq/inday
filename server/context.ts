import { FastifyRequest } from 'fastify';

type Request = FastifyRequest;

export interface Context {
  userID: string;
}

export async function createContext(_req: Request): Promise<Context> {
  return {
    userID: '1',
  };
}
