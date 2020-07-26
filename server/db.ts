import { Pool } from 'pg';
import { env } from './env';
import { Workspace } from '../app/data/workspace';
import { v4 } from 'uuid';

const db = new Pool({
  user: env.database.username,
  host: env.database.host,
  port: env.database.port,
  password: env.database.password,
  database: env.database.name,
});

export async function connectDatabase() {
  return await db.connect();
}

async function startTx() {
  return await db.query('BEGIN');
}

async function commitTx() {
  return await db.query('COMMIT');
}

async function rollbackTx() {
  return await db.query('ROLLBACK');
}

export async function wrapInTx<T>(query: () => Promise<T>): Promise<T> {
  try {
    await startTx();
    const result = await query();
    await commitTx();

    return result;
  } catch (error) {
    await rollbackTx();
    throw error;
  }
}

enum Table {
  Workspace = 'workspace',
}

export interface CreateWorkspaceInput {
  id?: string;
  name: string;
}

export async function createWorkspace(
  input: CreateWorkspaceInput,
): Promise<Workspace> {
  const { id, name } = input;

  const result = await db.query(
    `INSERT INTO ${Table.Workspace} (id, name) VALUES($1, $2) RETURNING *`,
    [id ?? v4(), name],
  );

  console.log(result);
}
