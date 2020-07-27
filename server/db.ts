import { Pool, PoolClient } from 'pg';
import { env } from './env';
import { Workspace } from '../app/data/workspace';
import { NotFoundError } from './errors';
import { first } from '../lib/data_structures/arrays';
import { Space } from '../app/data/spaces';
import { Collection } from '../app/data/collections';
import { Document } from '../app/data/documents';
import { View, ViewType } from '../app/data/views';
import { Field, FieldType } from '../app/data/fields';

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
    await db.query('DELETE FROM workspaces');
  });
}

//#region Helpers
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

//#endregion Helpers

//#region Workspace
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

export async function getWorkspaceByID(db: DB, id: string): Promise<Workspace> {
  const result = await db.query<WorkspaceRow>(
    'SELECT * FROM workspaces WHERE id=$1',
    [id],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('workspace');
  }

  const row = first(result.rows);

  return toWorkspace(row);
}

export async function createWorkspace(
  db: DB,
  input: {
    id: string;
    name: string;
    userID: string;
  },
): Promise<Workspace> {
  const { id, name, userID } = input;

  const result = await db.query<WorkspaceRow>(
    'INSERT INTO workspaces (id, name, owner_id) VALUES($1, $2, $3) RETURNING *',
    [id, name, userID],
  );

  const row = first(result.rows);

  return toWorkspace(row);
}

export async function fullUpdateWorkspace(
  db: DB,
  input: {
    id: string;
    name: string;
  },
): Promise<Workspace> {
  const { id, name } = input;
  const result = await db.query<WorkspaceRow>(
    'UPDATE workspaces SET name=$2 WHERE id=$1 RETURNING *',
    [id, name],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('workspace');
  }

  const row = first(result.rows);

  return toWorkspace(row);
}

export async function partialUpdateWorkspace(
  db: DB,
  input: {
    id: string;
    name?: string;
  },
): Promise<Workspace> {
  const { id, name } = input;
  const [setText, values] = buildPartialUpdateQuery({ name });

  const result = await db.query<WorkspaceRow>(
    `UPDATE workspaces SET ${setText} WHERE id=$1 RETURNING *`,
    [id, ...values],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('workspace');
  }

  const row = first(result.rows);

  return toWorkspace(row);
}

export async function deleteWorkspace(
  db: DB,
  input: { id: string },
): Promise<void> {
  const { id } = input;
  const result = await db.query<WorkspaceRow>(
    'DELETE FROM workspaces where id=$1',
    [id],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('workspace');
  }
}
//#endregion Workspace

//#region Space
interface SpaceRow {
  id: string;
  name: string;
  workspace_id: string;
  created_at: Date;
  updated_at: Date;
}

function toSpace(data: SpaceRow): Space {
  return {
    id: data.id,
    name: data.name,
    workspaceID: data.workspace_id,
  };
}

export async function getSpaceByID(db: DB, id: string): Promise<Space> {
  const result = await db.query<SpaceRow>('SELECT * FROM spaces WHERE id=$1', [
    id,
  ]);

  if (result.rowCount === 0) {
    throw new NotFoundError('space');
  }

  const row = first(result.rows);

  return toSpace(row);
}

export async function createSpace(
  db: DB,
  input: {
    id: string;
    name: string;
    workspaceID: string;
  },
): Promise<Space> {
  const { id, name, workspaceID } = input;
  const result = await db.query<SpaceRow>(
    'INSERT INTO spaces (id, name, workspace_id) VALUES($1, $2, $3) RETURNING *',
    [id, name, workspaceID],
  );

  const row = first(result.rows);

  return toSpace(row);
}

export async function fullUpdateSpace(
  db: DB,
  input: {
    id: string;
    name: string;
  },
): Promise<Space> {
  const { id, name } = input;
  const result = await db.query<SpaceRow>(
    'UPDATE spaces SET name=$2 WHERE id=$1 RETURNING *',
    [id, name],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('space');
  }

  const row = first(result.rows);

  return toSpace(row);
}

export async function partialUpdateSpace(
  db: DB,
  input: {
    id: string;
    name?: string;
  },
): Promise<Space> {
  const { id, name } = input;
  const [setText, values] = buildPartialUpdateQuery({ name });

  const result = await db.query<SpaceRow>(
    `UPDATE spaces SET ${setText} WHERE id=$1 RETURNING *`,
    [id, ...values],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('space');
  }

  const row = first(result.rows);

  return toSpace(row);
}

export async function deleteSpace(
  db: DB,
  input: { id: string },
): Promise<void> {
  const { id } = input;
  const result = await db.query<SpaceRow>('DELETE FROM spaces where id=$1', [
    id,
  ]);

  if (result.rowCount === 0) {
    throw new NotFoundError('space');
  }
}
//#endregion Space

//#region Collection
interface CollectionRow {
  id: string;
  name: string;
  space_id: string;
  created_at: Date;
  updated_at: Date;
}

function toCollection(data: CollectionRow): Collection {
  return {
    id: data.id,
    name: data.name,
    spaceID: data.space_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function getCollectionByID(
  db: DB,
  input: { id: string },
): Promise<Collection> {
  const { id } = input;
  const result = await db.query<CollectionRow>(
    'SELECT * FROM collections WHERE id=$1',
    [id],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('collection');
  }

  const row = first(result.rows);

  return toCollection(row);
}

export async function createCollection(
  db: DB,
  input: {
    id: string;
    name: string;
    spaceID: string;
  },
): Promise<Collection> {
  const { id, name, spaceID } = input;
  const result = await db.query<CollectionRow>(
    'INSERT INTO collections (id, name, space_id) VALUES($1, $2, $3) RETURNING *',
    [id, name, spaceID],
  );

  const row = first(result.rows);

  return toCollection(row);
}

export async function fullUpdateCollection(
  db: DB,
  input: {
    id: string;
    name: string;
  },
): Promise<Collection> {
  const { id, name } = input;
  const result = await db.query<CollectionRow>(
    'UPDATE collections SET name=$2 WHERE id=$1 RETURNING *',
    [id, name],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('collection');
  }

  const row = first(result.rows);

  return toCollection(row);
}

export async function partialUpdateCollection(
  db: DB,
  input: {
    id: string;
    name?: string;
  },
): Promise<Collection> {
  const { id, name } = input;
  const [setText, values] = buildPartialUpdateQuery({ name });

  const result = await db.query<CollectionRow>(
    `UPDATE collections SET ${setText} WHERE id=$1 RETURNING *`,
    [id, ...values],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('collection');
  }

  const row = first(result.rows);

  return toCollection(row);
}

export async function deleteCollection(
  db: DB,
  input: { id: string },
): Promise<void> {
  const { id } = input;
  const result = await db.query<CollectionRow>(
    'DELETE FROM collections where id=$1',
    [id],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('collection');
  }
}
//#endregion Collection

//#region Document
interface DocumentRow {
  id: string;
  name: string;
  collection_id: string;
  created_at: Date;
  updated_at: Date;
}

function toDocument(data: DocumentRow): Document {
  return {
    id: data.id,
    collectionID: data.collection_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function getDocumentByID(
  db: DB,
  input: { id: string },
): Promise<Document> {
  const { id } = input;
  const result = await db.query<DocumentRow>(
    'SELECT * FROM documents WHERE id=$1',
    [id],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('collection');
  }

  const row = first(result.rows);

  return toDocument(row);
}

export async function createDocument(
  db: DB,
  input: {
    id: string;
    collectionID: string;
  },
): Promise<Document> {
  const { id, collectionID } = input;
  const result = await db.query<DocumentRow>(
    'INSERT INTO documents (id, collection_id) VALUES($1, $3) RETURNING *',
    [id, collectionID],
  );

  const row = first(result.rows);

  return toDocument(row);
}

export async function fullUpdateDocument(
  db: DB,
  input: {
    id: string;
  },
): Promise<Document> {
  const { id } = input;
  const result = await db.query<DocumentRow>(
    'UPDATE documents SET WHERE id=$1 RETURNING *',
    [id],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('document');
  }

  const row = first(result.rows);

  return toDocument(row);
}

export async function partialUpdateDocument(
  db: DB,
  input: {
    id: string;
  },
): Promise<Document> {
  const { id } = input;

  const result = await db.query<DocumentRow>(
    'SELECT * FROM documents WHERE id=$1',
    [id],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('document');
  }

  const row = first(result.rows);

  return toDocument(row);
}

export async function deleteDocument(
  db: DB,
  input: { id: string },
): Promise<void> {
  const { id } = input;
  const result = await db.query<DocumentRow>(
    'DELETE FROM documents where id=$1',
    [id],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('document');
  }
}
//#endregion Document

//#region View
interface ViewRow {
  id: string;
  name: string;
  type: ViewType;
  collection_id: string;
  created_at: Date;
  updated_at: Date;
}

function toView(data: ViewRow): View {
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    collectionID: data.collection_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function getViewByID(
  db: DB,
  input: { id: string },
): Promise<View> {
  const { id } = input;
  const result = await db.query<ViewRow>('SELECT * FROM views WHERE id=$1', [
    id,
  ]);

  if (result.rowCount === 0) {
    throw new NotFoundError('view');
  }

  const row = first(result.rows);

  return toView(row);
}

export async function createView(
  db: DB,
  input: {
    id: string;
    collectionID: string;
  },
): Promise<View> {
  const { id, collectionID } = input;
  const result = await db.query<ViewRow>(
    'INSERT INTO views (id, collection_id) VALUES($1, $3) RETURNING *',
    [id, collectionID],
  );

  const row = first(result.rows);

  return toView(row);
}

export async function fullUpdateView(
  db: DB,
  input: {
    id: string;
    name: string;
  },
): Promise<View> {
  const { id, name } = input;
  const result = await db.query<ViewRow>(
    'UPDATE views SET name=$2 WHERE id=$1 RETURNING *',
    [id, name],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('view');
  }

  const row = first(result.rows);

  return toView(row);
}

export async function partialUpdateView(
  db: DB,
  input: {
    id: string;
    name?: string;
  },
): Promise<View> {
  const { id, name } = input;
  const [setText, values] = buildPartialUpdateQuery({ name });

  const result = await db.query<ViewRow>(
    `UPDATE views SET ${setText} WHERE id=$1 RETURNING *`,
    [id, ...values],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('view');
  }

  const row = first(result.rows);

  return toView(row);
}

export async function deleteView(db: DB, input: { id: string }): Promise<void> {
  const { id } = input;
  const result = await db.query<ViewRow>('DELETE FROM views where id=$1', [id]);

  if (result.rowCount === 0) {
    throw new NotFoundError('view');
  }
}
//#endregion View

//#region Field
interface FieldRow {
  id: string;
  name: string;
  description: string | null;
  type: FieldType;
  collection_id: string;
  created_at: Date;
  updated_at: Date;
}

function toField(data: FieldRow): Field {
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    description: data.description,
    collectionID: data.collection_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function getFieldByID(
  db: DB,
  input: { id: string },
): Promise<Field> {
  const { id } = input;
  const result = await db.query<FieldRow>('SELECT * FROM field WHERE id=$1', [
    id,
  ]);

  if (result.rowCount === 0) {
    throw new NotFoundError('field');
  }

  const row = first(result.rows);

  return toField(row);
}

export async function createField(
  db: DB,
  input: {
    id: string;
    collectionID: string;
  },
): Promise<Field> {
  const { id, collectionID } = input;
  const result = await db.query<FieldRow>(
    'INSERT INTO field (id, collection_id) VALUES($1, $3) RETURNING *',
    [id, collectionID],
  );

  const row = first(result.rows);

  return toField(row);
}

export async function fullUpdateField(
  db: DB,
  input: {
    id: string;
    name: string;
  },
): Promise<Field> {
  const { id, name } = input;
  const result = await db.query<FieldRow>(
    'UPDATE field SET name=$2 WHERE id=$1 RETURNING *',
    [id, name],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('field');
  }

  const row = first(result.rows);

  return toField(row);
}

export async function partialUpdateField(
  db: DB,
  input: {
    id: string;
    name?: string;
  },
): Promise<Field> {
  const { id, name } = input;
  const [setText, values] = buildPartialUpdateQuery({ name });

  const result = await db.query<FieldRow>(
    `UPDATE field SET ${setText} WHERE id=$1 RETURNING *`,
    [id, ...values],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('field');
  }

  const row = first(result.rows);

  return toField(row);
}

export async function deleteField(
  db: DB,
  input: { id: string },
): Promise<void> {
  const { id } = input;
  const result = await db.query<FieldRow>('DELETE FROM field where id=$1', [
    id,
  ]);

  if (result.rowCount === 0) {
    throw new NotFoundError('field');
  }
}
//#endregion Field
