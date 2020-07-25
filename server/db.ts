import { Pool } from 'pg';
import { env } from './env';

export const dbClient = new Pool({
  user: env.database.username,
  host: env.database.host,
  port: env.database.port,
  password: env.database.password,
  database: env.database.name,
});

export async function connectDatabase() {
  return await dbClient.connect();
}

export interface Database {}

export const db = {};
