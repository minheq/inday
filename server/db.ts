import { Client } from 'pg';

export const dbClient = new Client();

export async function connectDatabase() {
  return await dbClient.connect();
}

export interface Database {}

export const db = {};
