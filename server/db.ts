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

export async function closeDB() {
  return pool.end();
}

export async function wrapInTx<T>(
  query: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await query(client);
    await client.query('COMMIT');

    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
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

    setText += `${key}=${index} `;
    values.push(value);
    index++;
  });

  return [setText, values];
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

export async function getWorkspace(id: string): Promise<Workspace> {
  const result = await pool.query('SELECT * FROM workspace WHERE id=$1', [id]);

  if (result.rowCount === 0) {
    throw new NotFoundError('workspace');
  }

  const row = result.rows[0] as WorkspaceRow;

  return toWorkspace(row);
}

export async function createWorkspace(
  id: string,
  name: string,
  userID: string,
): Promise<Workspace> {
  const result = await pool.query(
    'INSERT INTO workspace (id, name, owner_id) VALUES($1, $2, $3) RETURNING *',
    [id, name, userID],
  );

  const row = result.rows[0] as WorkspaceRow;

  return toWorkspace(row);
}

export async function fullUpdateWorkspace(
  id: string,
  name: string,
): Promise<Workspace> {
  const result = await pool.query(
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
  id: string,
  name?: string,
): Promise<Workspace> {
  const [setText, values] = buildPartialUpdateQuery({ name });

  const result = await pool.query(
    `UPDATE workspace SET ${setText} WHERE id=$1 RETURNING *`,
    [id, ...values],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('workspace');
  }

  const row = result.rows[0] as WorkspaceRow;

  return toWorkspace(row);
}

export async function deleteWorkspace(id: string): Promise<void> {
  const result = await pool.query('DELETE FROM workspace where id=$1', [id]);

  if (result.rowCount === 0) {
    throw new NotFoundError('workspace');
  }
}
