import { Pool, PoolClient } from 'pg';
import { env } from './env';
import { Workspace } from '../app/data/workspace';
import { NotFoundError } from './errors';
import { Array } from '../lib/js_utils';
import { Space } from '../app/data/spaces';
import { Collection } from '../app/data/collections';
import { Record } from '../app/data/records';
import { View, ViewType } from '../app/data/views';
import { Field, FieldType } from '../app/data/fields';
import { Template } from '../app/data/templates';

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

//#endregion Helpers

//#region Workspace
interface WorkspaceRow {
  workspace_id: string;
  name: string;
  owner_id: string;
  created_at: Date;
  updated_at: Date;
}

function toWorkspace(data: WorkspaceRow): Workspace {
  return {
    id: data.workspace_id,
    name: data.name,
    ownerID: data.owner_id,
  };
}

export async function getWorkspaceByID(
  db: DB,
  workspaceID: string,
): Promise<Workspace> {
  const result = await db.query<WorkspaceRow>(
    'SELECT * FROM workspaces WHERE workspace_id=$1',
    [workspaceID],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('workspace', workspaceID);
  }

  const row = Array.first(result.rows);

  return toWorkspace(row);
}

export async function createWorkspace(
  db: DB,
  workspaceID: string,
  name: string,
  userID: string,
): Promise<Workspace> {
  const result = await db.query<WorkspaceRow>(
    'INSERT INTO workspaces (workspace_id, name, owner_id) VALUES($1, $2, $3) RETURNING *',
    [workspaceID, name, userID],
  );

  const row = Array.first(result.rows);

  return toWorkspace(row);
}

export async function updateWorkspaceName(
  db: DB,
  workspaceID: string,
  name: string,
): Promise<Workspace> {
  const result = await db.query<WorkspaceRow>(
    'UPDATE workspaces SET name=$2 WHERE workspace_id=$1 RETURNING *',
    [workspaceID, name],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('workspace', workspaceID);
  }

  const row = Array.first(result.rows);

  return toWorkspace(row);
}

export async function deleteWorkspace(
  db: DB,
  workspaceID: string,
): Promise<void> {
  const result = await db.query<WorkspaceRow>(
    'DELETE FROM workspaces where workspace_id=$1',
    [workspaceID],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('workspace', workspaceID);
  }
}
//#endregion Workspace

//#region Space
interface SpaceRow {
  space_id: string;
  name: string;
  workspace_id: string;
  created_at: Date;
  updated_at: Date;
}

function toSpace(data: SpaceRow): Space {
  return {
    id: data.space_id,
    name: data.name,
    workspaceID: data.workspace_id,
  };
}

export async function getSpaceByID(db: DB, spaceID: string): Promise<Space> {
  const result = await db.query<SpaceRow>(
    'SELECT * FROM spaces WHERE space_id=$1',
    [spaceID],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('space', spaceID);
  }

  const row = Array.first(result.rows);

  return toSpace(row);
}

export async function createSpace(
  db: DB,
  spaceID: string,
  name: string,
  workspaceID: string,
): Promise<Space> {
  const result = await db.query<SpaceRow>(
    'INSERT INTO spaces (space_id, name, workspace_id) VALUES($1, $2, $3) RETURNING *',
    [spaceID, name, workspaceID],
  );

  const row = Array.first(result.rows);

  return toSpace(row);
}

export async function updateSpaceName(
  db: DB,
  spaceID: string,
  name: string,
): Promise<Space> {
  const result = await db.query<SpaceRow>(
    'UPDATE spaces SET name=$2 WHERE space_id=$1 RETURNING *',
    [spaceID, name],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('space', spaceID);
  }

  const row = Array.first(result.rows);

  return toSpace(row);
}

export async function deleteSpace(db: DB, spaceID: string): Promise<void> {
  const result = await db.query<SpaceRow>(
    'DELETE FROM spaces where space_id=$1',
    [spaceID],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('space', spaceID);
  }
}
//#endregion Space

//#region Collection
interface CollectionRow {
  collection_id: string;
  name: string;
  space_id: string;
  created_at: Date;
  updated_at: Date;
}

function toCollection(data: CollectionRow): Collection {
  return {
    id: data.collection_id,
    name: data.name,
    spaceID: data.space_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function getCollectionByID(
  db: DB,
  collectionID: string,
): Promise<Collection> {
  const result = await db.query<CollectionRow>(
    'SELECT * FROM collections WHERE collection_id=$1',
    [collectionID],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('collection', collectionID);
  }

  const row = Array.first(result.rows);

  return toCollection(row);
}

export async function createCollection(
  db: DB,
  collectionID: string,
  name: string,
  spaceID: string,
): Promise<Collection> {
  const result = await db.query<CollectionRow>(
    'INSERT INTO collections (collection_id, name, space_id) VALUES($1, $2, $3) RETURNING *',
    [collectionID, name, spaceID],
  );

  const row = Array.first(result.rows);

  return toCollection(row);
}

export async function updateCollectionName(
  db: DB,
  collectionID: string,
  name: string,
): Promise<Collection> {
  const result = await db.query<CollectionRow>(
    'UPDATE collections SET name=$2 WHERE collection_id=$1 RETURNING *',
    [collectionID, name],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('collection', collectionID);
  }

  const row = Array.first(result.rows);

  return toCollection(row);
}

export async function deleteCollection(
  db: DB,
  collectionID: string,
): Promise<void> {
  const result = await db.query<CollectionRow>(
    'DELETE FROM collections where collection_id=$1',
    [collectionID],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('collection', collectionID);
  }
}
//#endregion Collection

//#region Record
interface RecordRow {
  record_id: string;
  name: string;
  collection_id: string;
  created_at: Date;
  updated_at: Date;
}

interface RecordFieldValueRow {
  record_id: string;
  value: string;
  field_id: string;
  created_at: Date;
  updated_at: Date;
}

interface RecordFieldValueRow {
  record_id: string;
  value: string;
  field_id: string;
  created_at: Date;
  updated_at: Date;
}

function toRecord(data: RecordRow): Record {
  return {
    id: data.record_id,
    collectionID: data.collection_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function getRecordByID(db: DB, recordID: string): Promise<Record> {
  const result = await db.query<RecordRow>(
    'SELECT * FROM records WHERE record_id=$1',
    [recordID],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('collection', recordID);
  }

  const row = Array.first(result.rows);

  return toRecord(row);
}

export async function createRecord(
  db: DB,
  recordID: string,
  collectionID: string,
): Promise<Record> {
  const result = await db.query<RecordRow>(
    'INSERT INTO records (record_id, collection_id) VALUES($1, $2) RETURNING *',
    [recordID, collectionID],
  );

  const row = Array.first(result.rows);

  return toRecord(row);
}

export async function updateRecordFieldValue(
  db: DB,
  recordID: string,
  fieldID: string,
  value: string,
): Promise<Record> {
  const result = await db.query<RecordRow>(
    'INSERT INTO record_field_values (value, record_id, field_id) VALUES($1, $2, $3) RETURNING *',
    [value, recordID, fieldID],
  );

  const row = Array.first(result.rows);

  return toRecord(row);
}

export async function fullUpdateRecord(
  db: DB,
  recordID: string,
): Promise<Record> {
  const result = await db.query<RecordRow>(
    'UPDATE records SET WHERE record_id=$1 RETURNING *',
    [recordID],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('record', recordID);
  }

  const row = Array.first(result.rows);

  return toRecord(row);
}

export async function partialUpdateRecord(
  db: DB,
  recordID: string,
): Promise<Record> {
  const result = await db.query<RecordRow>(
    'SELECT * FROM records WHERE record_id=$1',
    [recordID],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('record', recordID);
  }

  const row = Array.first(result.rows);

  return toRecord(row);
}

export async function deleteRecord(db: DB, recordID: string): Promise<void> {
  const result = await db.query<RecordRow>(
    'DELETE FROM records where record_id=$1',
    [recordID],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('record', recordID);
  }
}
//#endregion Record

//#region View
interface ViewRow {
  view_id: string;
  name: string;
  type: ViewType;
  collection_id: string;
  created_at: Date;
  updated_at: Date;
}

function toView(data: ViewRow): View {
  return {
    id: data.view_id,
    name: data.name,
    type: data.type,
    collectionID: data.collection_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function getViewByID(db: DB, viewID: string): Promise<View> {
  const result = await db.query<ViewRow>(
    'SELECT * FROM views WHERE view_id=$1',
    [viewID],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('view', viewID);
  }

  const row = Array.first(result.rows);

  return toView(row);
}

export async function createView(
  db: DB,
  viewID: string,
  name: string,
  type: ViewType,
  collectionID: string,
): Promise<View> {
  const result = await db.query<ViewRow>(
    'INSERT INTO views (view_id, name, type, collection_id) VALUES($1, $2, $3, $4) RETURNING *',
    [viewID, name, type, collectionID],
  );

  const row = Array.first(result.rows);

  return toView(row);
}

export async function updateViewName(
  db: DB,
  viewID: string,
  name: string,
): Promise<View> {
  const result = await db.query<ViewRow>(
    'UPDATE views SET name=$2 WHERE view_id=$1 RETURNING *',
    [viewID, name],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('view', viewID);
  }

  const row = Array.first(result.rows);

  return toView(row);
}

export async function deleteView(db: DB, viewID: string): Promise<void> {
  const result = await db.query<ViewRow>('DELETE FROM views where view_id=$1', [
    viewID,
  ]);

  if (result.rowCount === 0) {
    throw new NotFoundError('view', viewID);
  }
}
//#endregion View

//#region Field
interface FieldRow {
  field_id: string;
  name: string;
  description: string;
  type: FieldType;
  collection_id: string;
  created_at: Date;
  updated_at: Date;
}

function toField(data: FieldRow): Field {
  return {
    id: data.field_id,
    name: data.name,
    type: data.type,
    description: data.description,
    collectionID: data.collection_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function getFieldByID(db: DB, fieldID: string): Promise<Field> {
  const result = await db.query<FieldRow>(
    'SELECT * FROM fields WHERE field_id=$1',
    [fieldID],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('field', fieldID);
  }

  const row = Array.first(result.rows);

  return toField(row);
}

export async function createField(
  db: DB,
  fieldID: string,
  name: string,
  type: FieldType,
  collectionID: string,
): Promise<Field> {
  const result = await db.query<FieldRow>(
    'INSERT INTO fields (field_id, name, type, collection_id) VALUES($1, $2, $3, $4) RETURNING *',
    [fieldID, name, type, collectionID],
  );

  const row = Array.first(result.rows);

  return toField(row);
}

export async function duplicateField(
  db: DB,
  fieldID: string,
  fromFieldID: string,
  duplicateRecordFieldValues: boolean,
): Promise<Field> {
  const result = await db.query<FieldRow>(
    'INSERT INTO fields (field_id, name, type, description, collection_id) SELECT $1, name, type, description, collection_id FROM fields WHERE field_id=$2 RETURNING *',
    [fieldID, fromFieldID],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('field', fromFieldID);
  }

  const row = Array.first(result.rows);
  const field = toField(row);

  if (duplicateRecordFieldValues === true) {
    await db.query<FieldRow>(
      'INSERT INTO record_field_values (value, field_id, record_id) SELECT value, $1, record_id FROM record_field_values WHERE field_id=$2 RETURNING *',
      [field.id, fromFieldID],
    );
  }

  return field;
}

export async function updateFieldName(
  db: DB,
  fieldID: string,
  name: string,
): Promise<Field> {
  const result = await db.query<FieldRow>(
    'UPDATE fields SET name=$2 WHERE field_id=$1 RETURNING *',
    [fieldID, name],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('field', fieldID);
  }

  const row = Array.first(result.rows);

  return toField(row);
}

export async function deleteField(db: DB, fieldID: string): Promise<void> {
  const result = await db.query<FieldRow>(
    'DELETE FROM fields where field_id=$1',
    [fieldID],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('field', fieldID);
  }
}
//#endregion Field

//#region Template
interface TemplateRow {
  template_id: string;
  name: string;
  description: string;
  space_id: string;
  created_at: Date;
  updated_at: Date;
}

function toTemplate(data: TemplateRow): Template {
  return {
    id: data.template_id,
    name: data.name,
    description: data.description,
    spaceID: data.space_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function getTemplateByID(
  db: DB,
  templateID: string,
): Promise<Template> {
  const result = await db.query<TemplateRow>(
    'SELECT * FROM templates WHERE template_id=$1',
    [templateID],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('template', templateID);
  }

  const row = Array.first(result.rows);

  return toTemplate(row);
}

export async function createTemplate(
  db: DB,
  templateID: string,
  name: string,
  collectionID: string,
): Promise<Template> {
  const result = await db.query<TemplateRow>(
    'INSERT INTO templates (template_id, name, collection_id) VALUES($1, $2, $3) RETURNING *',
    [templateID, name, collectionID],
  );

  const row = Array.first(result.rows);

  return toTemplate(row);
}

export async function updateTemplateName(
  db: DB,
  templateID: string,
  name: string,
): Promise<Template> {
  const result = await db.query<TemplateRow>(
    'UPDATE templates SET name=$2 WHERE template_id=$1 RETURNING *',
    [templateID, name],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('template', templateID);
  }

  const row = Array.first(result.rows);

  return toTemplate(row);
}

export async function deleteTemplate(
  db: DB,
  templateID: string,
): Promise<void> {
  const result = await db.query<TemplateRow>(
    'DELETE FROM templates where template_id=$1',
    [templateID],
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('template', templateID);
  }
}
//#endregion Template
