import { Request } from 'express';

export interface Context {}

export async function createContext(_req: Request): Promise<Context> {
  return {};
}
