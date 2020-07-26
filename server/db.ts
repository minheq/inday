import { Pool } from 'pg';
import { env } from './env';
import { Workspace } from '../app/data/workspace';

const db = new Pool({
  user: env.database.username,
  host: env.database.host,
  port: env.database.port,
  password: env.database.password,
  database: env.database.name,
});

export async function checkConnection() {
  return db.query('SELECT NOW()');
}

export async function closeDB() {
  return db.end();
}

async function startTx() {
  return db.query('BEGIN');
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

interface WorkspaceRow {
  id: string;
  name: string;
  owner_id: string;
  created_at: Date;
  updated_at: Date;
}

function toWorkspace(data: WorkspaceRow): Workspace {
  return {
    id: data.id,
    name: data.name,
  };
}

export async function createWorkspace(
  id: string,
  name: string,
  userID: string,
): Promise<Workspace> {
  const result = await db.query(
    'INSERT INTO workspace (id, name, owner_id) VALUES($1, $2, $3) RETURNING *',
    [id, name, userID],
  );

  const row = result.rows[0] as WorkspaceRow;

  return toWorkspace(row);
}
