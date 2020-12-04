import { FastifyReply, FastifyRequest } from 'fastify';

import {
  DB,
  wrapInTx,
  createWorkspace,
  updateWorkspaceName,
  getWorkspaceByID,
  deleteWorkspace,
  createSpace,
  updateSpaceName,
  getSpaceByID,
  deleteSpace,
  createCollection,
  updateCollectionName,
  getCollectionByID,
  deleteCollection,
  createRecord,
  fullUpdateRecord,
  partialUpdateRecord,
  getRecordByID,
  deleteRecord,
  createView,
  deleteView,
  updateViewName,
  getViewByID,
  createField,
  updateFieldName,
  getFieldByID,
  deleteField,
  duplicateField,
} from './db';
import { AuthenticationError, UnauthorizedError } from './errors';
import { ViewType } from '../app/data/views';
import { FieldType } from '../app/data/fields';
import { validateID } from '../lib/id';

type Request = FastifyRequest;
type Response = FastifyReply;

interface BaseContext {
  /** Database client used for transaction of all queries within single request */
  db: DB;
}

interface AuthenticatedContext extends BaseContext {
  userID: string;
}

interface UnauthenticatedContext extends BaseContext {
  userID: undefined;
}

/** Context of the request. */
type Context = AuthenticatedContext | UnauthenticatedContext;

/** Generic Handler */
type H = (ctx: Context, req: Request, res: Response) => Promise<void>;

/** Authenticated Handler */
type AH = (
  ctx: AuthenticatedContext,
  req: Request,
  res: Response,
) => Promise<void>;

export function addContext(handler: H) {
  return async (req: Request, res: Response) => {
    await wrapInTx(async (db) => {
      const ctx: Context = {
        userID: '1',
        db,
      };

      return handler(ctx, req, res);
    });
  };
}

function assertAuthenticated(
  ctx: Context,
): asserts ctx is AuthenticatedContext {
  if (ctx.userID === undefined) {
    throw new AuthenticationError();
  }
}

export function ensureAuthenticated(handler: AH) {
  return (ctx: Context, req: Request, res: Response) => {
    assertAuthenticated(ctx);

    return handler(ctx, req, res);
  };
}

function getCurrentUserID(ctx: AuthenticatedContext): string {
  return ctx.userID;
}

interface WorkspaceIDParams {
  workspaceID: string;
}

export interface CreateWorkspaceInput {
  name: string;
}

export const handleCreateWorkspace: AH = async (ctx, req, res) => {
  validateID(req.params.workspaceID);

  const currentUserID = getCurrentUserID(ctx);
  const { workspaceID } = req.params;
  const { name } = req.body;

  const workspace = await createWorkspace(
    ctx.db,
    workspaceID,
    name,
    currentUserID,
  );

  res.send(workspace);
};

export interface UpdateWorkspaceNameInput {
  name: string;
}

export const handleUpdateWorkspaceName: AH = async (ctx, req, res) => {
  const { workspaceID } = req.params;
  const { name } = req.body;

  const workspace = await updateWorkspaceName(ctx.db, workspaceID, name);

  res.send(workspace);
};

export const handleGetWorkspace: AH = async (ctx, req, res) => {
  const { workspaceID } = req.params;
  const workspace = await getWorkspaceByID(ctx.db, workspaceID);

  res.send(workspace);
};

export const handleDeleteWorkspace: AH = async (ctx, req, res) => {
  const currentUserID = getCurrentUserID(ctx);
  const { workspaceID } = req.params;

  const workspace = await getWorkspaceByID(ctx.db, workspaceID);

  if (workspace.ownerID !== currentUserID) {
    throw new UnauthorizedError();
  }

  await deleteWorkspace(ctx.db, workspaceID);

  res.send({ id: workspaceID, deleted: true });
};

interface SpaceIDParams {
  spaceID: string;
}

export interface CreateSpaceInput {
  name: string;
  workspaceID: string;
}

export const handleCreateSpace: AH = async (ctx, req, res) => {
  validateID(req.params.spaceID);

  const { spaceID } = req.params;
  const { name, workspaceID } = req.body;

  const space = await createSpace(ctx.db, spaceID, name, workspaceID);

  res.send(space);
};

export interface UpdateSpaceNameInput {
  name: string;
}

export const handleUpdateSpaceName: AH = async (ctx, req, res) => {
  const { spaceID } = req.params;
  const { name } = req.body;

  const space = await updateSpaceName(ctx.db, spaceID, name);

  res.send(space);
};

export const handleGetSpace: AH = async (ctx, req, res) => {
  const { spaceID } = req.params;
  const space = await getSpaceByID(ctx.db, spaceID);

  res.send(space);
};

export const handleDeleteSpace: AH = async (ctx, req, res) => {
  const { spaceID } = req.params;

  await deleteSpace(ctx.db, spaceID);

  res.send({ id: spaceID, deleted: true });
};

interface CollectionIDParams {
  collectionID: string;
}

export interface CreateCollectionInput {
  name: string;
  spaceID: string;
}

export const handleCreateCollection: AH = async (ctx, req, res) => {
  validateID(req.params.collectionID);

  const { collectionID } = req.params;
  const { name, spaceID } = req.body;

  const collection = await createCollection(
    ctx.db,
    collectionID,
    name,
    spaceID,
  );

  res.send(collection);
};

export interface UpdateCollectionNameInput {
  name: string;
}

export const handleUpdateCollectionName: AH = async (ctx, req, res) => {
  const { collectionID } = req.params;
  const { name } = req.body;

  const collection = await updateCollectionName(ctx.db, collectionID, name);

  res.send(collection);
};

export const handleGetCollection: AH = async (ctx, req, res) => {
  const { collectionID } = req.params;
  const collection = await getCollectionByID(ctx.db, collectionID);

  res.send(collection);
};

export const handleDeleteCollection: AH = async (ctx, req, res) => {
  const { collectionID } = req.params;

  await deleteCollection(ctx.db, collectionID);

  res.send({ id: collectionID, deleted: true });
};

interface RecordIDParams {
  recordID: string;
}

export interface CreateRecordInput {
  collectionID: string;
}

export const handleCreateRecord: AH = async (ctx, req, res) => {
  validateID(req.params.recordID);

  const { recordID } = req.params;
  const { collectionID } = req.body;

  const record = await createRecord(ctx.db, recordID, collectionID);

  res.send(record);
};

export interface FullUpdateRecordInput {}

export const handleFullUpdateRecord: AH = async (ctx, req, res) => {
  const { recordID } = req.params;

  const record = await fullUpdateRecord(ctx.db, recordID);

  res.send(record);
};

export interface PartialUpdateRecordInput {}

export const handlePartialUpdateRecord: AH = async (ctx, req, res) => {
  const { recordID } = req.params;

  const record = await partialUpdateRecord(ctx.db, recordID);

  res.send(record);
};

export const handleGetRecord: AH = async (ctx, req, res) => {
  const { recordID } = req.params;
  const record = await getRecordByID(ctx.db, recordID);

  res.send(record);
};

export const handleDeleteRecord: AH = async (ctx, req, res) => {
  const { recordID } = req.params;

  await deleteRecord(ctx.db, recordID);

  res.send({ id: recordID, deleted: true });
};

interface ViewIDParams {
  viewID: string;
}

export interface CreateViewInput {
  name: string;
  type: ViewType;
  collectionID: string;
}

const viewTypes: ViewType[] = ['list', 'board'];

export const handleCreateView: AH = async (ctx, req, res) => {
  validateID(req.params.viewID);

  const { viewID } = req.params;
  const { name, type, collectionID } = req.body;
  const view = await createView(ctx.db, viewID, name, type, collectionID);

  res.send(view);
};

export interface UpdateViewNameInput {
  name: string;
}

export const handleUpdateViewName: AH = async (ctx, req, res) => {
  const { viewID } = req.params;
  const { name } = req.body;

  const view = await updateViewName(ctx.db, viewID, name);

  res.send(view);
};

export const handleGetView: AH = async (ctx, req, res) => {
  const { viewID } = req.params;
  const view = await getViewByID(ctx.db, viewID);

  res.send(view);
};

export const handleDeleteView: AH = async (ctx, req, res) => {
  const { viewID } = req.params;

  await deleteView(ctx.db, viewID);

  res.send({ id: viewID, deleted: true });
};

const fieldTypes: FieldType[] = [
  'singleLineText',
  'multiLineText',
  'singleSelect',
  'multiSelect',
  'singleCollaborator',
  'multiCollaborator',
  'singleRecordLink',
  'multiRecordLink',
  'date',
  'phoneNumber',
  'email',
  'url',
  'number',
  'currency',
  'checkbox',
];

interface FieldIDParams {
  fieldID: string;
}

export interface CreateFieldInput {
  name: string;
  type: FieldType;
  collectionID: string;
}

export const handleCreateField: AH = async (ctx, req, res) => {
  validateID(req.params.fieldID);

  const { fieldID } = req.params;
  const { name, type, collectionID } = req.body;

  const field = await createField(ctx.db, fieldID, name, type, collectionID);

  res.send(field);
};

export interface DuplicateFieldInput {
  fromFieldID: string;
  duplicateRecordFieldValues: boolean;
}

export const handleDuplicateField: AH = async (ctx, req, res) => {
  const { fieldID } = req.params;
  const { fromFieldID, duplicateRecordFieldValues } = req.body;

  const field = await duplicateField(
    ctx.db,
    fieldID,
    fromFieldID,
    duplicateRecordFieldValues,
  );

  res.send(field);
};

export interface UpdateFieldNameInput {
  name: string;
}

export const handleUpdateFieldName: AH = async (ctx, req, res) => {
  const { fieldID } = req.params;
  const { name } = req.body;

  const field = await updateFieldName(ctx.db, fieldID, name);

  res.send(field);
};

export const handleGetField: AH = async (ctx, req, res) => {
  const { fieldID } = req.params;
  const field = await getFieldByID(ctx.db, fieldID);

  res.send(field);
};

export const handleDeleteField: AH = async (ctx, req, res) => {
  const { fieldID } = req.params;

  await deleteField(ctx.db, fieldID);

  res.send({ id: fieldID, deleted: true });
};
