import { Pool, PoolClient } from 'pg';
import { env } from './env';
import { Workspace } from '../app/data/workspace';
import { NotFoundError } from './errors';

const pool = new Pool({
  user: env.database.username,
  host: env.database.host,
  port: env.database.port,
  password: env.database.password,
  database: env.database.name,
});

/** Database client */
export type DB = PoolClient;

export async function getDB(): Promise<DB> {
  return pool.connect();
}

export async function closeDB(db: DB) {
  db.release();
  return pool.end();
}

export async function wrapInTx<T>(query: (db: DB) => Promise<T>): Promise<T> {
  const db = await pool.connect();

  try {
    await db.query('BEGIN');
    const result = await query(db);
    await db.query('COMMIT');

    return result;
  } catch (e) {
    await db.query('ROLLBACK');
    throw e;
  } finally {
    db.release();
  }
}

export async function cleanDB() {
  await wrapInTx(async (db) => {
    await db.query('DELETE FROM workspace');
  });
}

function buildPartialUpdateQuery<T extends { [field: string]: any }>(
  fields: T,
): [string, any[]] {
  let setText = '';
  let values: any[] = [];
  // $1 is always assumed to be for ID, so we start from $2
  let index = 2;

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    setText += `${key}=$${index} `;
    values.push(value);
    index++;
  });

  return [setText.trim(), values];
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
    ownerID: data.owner_id,
  };
}

export async function getWorkspace(db: DB, id: string): Promise<Workspace> {
  const result = await db.query('SELECT * FROM workspace WHERE id=$1', [id]);

  if (result.rowCount === 0) {
    throw new NotFoundError('workspace');
  }

  const row = result.rows[0] as WorkspaceRow;

  return toWorkspace(row);
}

export async function createWorkspace(
  db: DB,
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

export async function fullUpdateWorkspace(
  db: DB,
  id: string,
  name: string,
): Promise<Workspace> {
  const result = await db.query(
    'UPDATE workspace SET name=$2 WHERE id=$1 RETURNING *',
    [id, name],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('workspace');
  }

  const row = result.rows[0] as WorkspaceRow;

  return toWorkspace(row);
}

export async function partialUpdateWorkspace(
  db: DB,
  id: string,
  name?: string,
): Promise<Workspace> {
  const [setText, values] = buildPartialUpdateQuery({ name });

  const result = await db.query(
    `UPDATE workspace SET ${setText} WHERE id=$1 RETURNING *`,
    [id, ...values],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('workspace');
  }

  const row = result.rows[0] as WorkspaceRow;

  return toWorkspace(row);
}

export async function deleteWorkspace(db: DB, id: string): Promise<void> {
  const result = await db.query('DELETE FROM workspace where id=$1', [id]);

  if (result.rowCount === 0) {
    throw new NotFoundError('workspace');
  }
}
