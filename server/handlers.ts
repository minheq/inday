import { FastifyReply, FastifyRequest } from 'fastify';
import { v4 } from 'uuid';
import * as yup from 'yup';

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
  createDocument,
  fullUpdateDocument,
  partialUpdateDocument,
  getDocumentByID,
  deleteDocument,
  createView,
  deleteView,
  updateViewName,
  getViewByID,
  createField,
  updateFieldName,
  getFieldByID,
  deleteField,
} from './db';
import {
  AuthenticationError,
  UnauthorizedError,
  ValidationErrorField,
  ValidationError,
} from './errors';
import { ViewType } from '../app/data/views';
import { FieldType } from '../app/data/fields';

//#region Helpers
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

function validateInput<T extends object>(
  schema: yup.ObjectSchema<T>,
  input: unknown,
): asserts input is T {
  try {
    schema.validateSync(input, { abortEarly: false });
  } catch (error) {
    const fields: ValidationErrorField[] = (error as yup.ValidationError).inner.map(
      (validationError: yup.ValidationError) => ({
        field: validationError.path,
        message: validationError.message,
      }),
    );

    throw new ValidationError(fields);
  }
}

function validateParams<T extends object>(
  schema: yup.ObjectSchema<T>,
  params: unknown,
): asserts params is T {
  try {
    schema.validateSync(params);
  } catch (error) {
    throw new Error(
      `Invalid params. ${(error as yup.ValidationError).message}`,
    );
  }
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

interface IDParams {
  id: string;
}

const idParamsSchema = yup
  .object<IDParams>({
    id: yup.string().required(),
  })
  .required();
//#endregion Helpers

//#region Workspace
export interface CreateWorkspaceInput {
  id?: string;
  name: string;
}

const createWorkspaceInputSchema = yup
  .object<CreateWorkspaceInput>({
    id: yup.string(),
    name: yup.string().required(),
  })
  .required();

export const handleCreateWorkspace: AH = async (ctx, req, res) => {
  validateInput(createWorkspaceInputSchema, req.body);
  const currentUserID = getCurrentUserID(ctx);

  const { id, name } = req.body;

  const workspace = await createWorkspace(
    ctx.db,
    id ?? v4(),
    name,
    currentUserID,
  );

  res.send(workspace);
};

export interface UpdateWorkspaceNameInput {
  name: string;
}

const updateWorkspaceNameInputSchema = yup
  .object<UpdateWorkspaceNameInput>({
    name: yup.string().required(),
  })
  .required();

export const handleUpdateWorkspaceName: AH = async (ctx, req, res) => {
  validateInput(updateWorkspaceNameInputSchema, req.body);
  validateParams(idParamsSchema, req.params);

  const { id } = req.params;
  const { name } = req.body;

  const workspace = await updateWorkspaceName(ctx.db, id, name);

  res.send(workspace);
};

export const handleGetWorkspace: AH = async (ctx, req, res) => {
  validateParams(idParamsSchema, req.params);

  const { id } = req.params;
  const workspace = await getWorkspaceByID(ctx.db, id);

  res.send(workspace);
};

export const handleDeleteWorkspace: AH = async (ctx, req, res) => {
  validateParams(idParamsSchema, req.params);
  const currentUserID = getCurrentUserID(ctx);
  const { id } = req.params;

  const workspace = await getWorkspaceByID(ctx.db, id);

  if (workspace.ownerID !== currentUserID) {
    throw new UnauthorizedError();
  }

  await deleteWorkspace(ctx.db, id);

  res.send({ id: id, deleted: true });
};

//#endregion Workspace

//#region Space
export interface CreateSpaceInput {
  id?: string;
  name: string;
  workspaceID: string;
}

const createSpaceInputSchema = yup
  .object<CreateSpaceInput>({
    id: yup.string(),
    name: yup.string().required(),
    workspaceID: yup.string().required(),
  })
  .required();

export const handleCreateSpace: AH = async (ctx, req, res) => {
  validateInput(createSpaceInputSchema, req.body);

  const { id, name, workspaceID } = req.body;

  const space = await createSpace(ctx.db, id ?? v4(), name, workspaceID);

  res.send(space);
};

export interface UpdateSpaceNameInput {
  name: string;
}

const updateSpaceNameInputSchema = yup
  .object<UpdateSpaceNameInput>({
    name: yup.string().required(),
  })
  .required();

export const handleUpdateSpaceName: AH = async (ctx, req, res) => {
  validateInput(updateSpaceNameInputSchema, req.body);
  validateParams(idParamsSchema, req.params);

  const { id } = req.params;
  const { name } = req.body;

  const space = await updateSpaceName(ctx.db, id, name);

  res.send(space);
};

export const handleGetSpace: AH = async (ctx, req, res) => {
  validateParams(idParamsSchema, req.params);

  const { id } = req.params;
  const space = await getSpaceByID(ctx.db, id);

  res.send(space);
};

export const handleDeleteSpace: AH = async (ctx, req, res) => {
  validateParams(idParamsSchema, req.params);
  const { id } = req.params;

  await deleteSpace(ctx.db, id);

  res.send({ id: id, deleted: true });
};

//#endregion Space

//#region Collection
export interface CreateCollectionInput {
  id?: string;
  name: string;
  spaceID: string;
}

const createCollectionInputSchema = yup
  .object<CreateCollectionInput>({
    id: yup.string(),
    name: yup.string().required(),
    spaceID: yup.string().required(),
  })
  .required();

export const handleCreateCollection: AH = async (ctx, req, res) => {
  validateInput(createCollectionInputSchema, req.body);

  const { id, name, spaceID } = req.body;

  const collection = await createCollection(ctx.db, id ?? v4(), name, spaceID);

  res.send(collection);
};

export interface UpdateCollectionNameInput {
  name: string;
}

const updateCollectionNameInputSchema = yup
  .object<UpdateCollectionNameInput>({
    name: yup.string().required(),
  })
  .required();

export const handleUpdateCollectionName: AH = async (ctx, req, res) => {
  validateInput(updateCollectionNameInputSchema, req.body);
  validateParams(idParamsSchema, req.params);

  const { id } = req.params;
  const { name } = req.body;

  const collection = await updateCollectionName(ctx.db, id, name);

  res.send(collection);
};

export const handleGetCollection: AH = async (ctx, req, res) => {
  validateParams(idParamsSchema, req.params);

  const { id } = req.params;
  const collection = await getCollectionByID(ctx.db, id);

  res.send(collection);
};

export const handleDeleteCollection: AH = async (ctx, req, res) => {
  validateParams(idParamsSchema, req.params);
  const { id } = req.params;

  await deleteCollection(ctx.db, id);

  res.send({ id: id, deleted: true });
};

//#endregion Collection

//#region Document
export interface CreateDocumentInput {
  id?: string;
  collectionID: string;
}

const createDocumentInputSchema = yup
  .object<CreateDocumentInput>({
    id: yup.string(),

    collectionID: yup.string().required(),
  })
  .required();

export const handleCreateDocument: AH = async (ctx, req, res) => {
  validateInput(createDocumentInputSchema, req.body);

  const { id, collectionID } = req.body;

  const collection = await createDocument(ctx.db, id ?? v4(), collectionID);

  res.send(collection);
};

export interface FullUpdateDocumentInput {}

const fullUpdateDocumentInputSchema = yup
  .object<FullUpdateDocumentInput>({})
  .required();

export const handleFullUpdateDocument: AH = async (ctx, req, res) => {
  validateInput(fullUpdateDocumentInputSchema, req.body);
  validateParams(idParamsSchema, req.params);

  const { id } = req.params;

  const collection = await fullUpdateDocument(ctx.db, id);

  res.send(collection);
};

export interface PartialUpdateDocumentInput {}

const partialUpdateDocumentInputSchema = yup
  .object<PartialUpdateDocumentInput>({})
  .required();

export const handlePartialUpdateDocument: AH = async (ctx, req, res) => {
  validateInput(partialUpdateDocumentInputSchema, req.body);
  validateParams(idParamsSchema, req.params);

  const { id } = req.params;

  const collection = await partialUpdateDocument(ctx.db, id);

  res.send(collection);
};

export const handleGetDocument: AH = async (ctx, req, res) => {
  validateParams(idParamsSchema, req.params);

  const { id } = req.params;
  const collection = await getDocumentByID(ctx.db, id);

  res.send(collection);
};

export const handleDeleteDocument: AH = async (ctx, req, res) => {
  validateParams(idParamsSchema, req.params);
  const { id } = req.params;

  await deleteDocument(ctx.db, id);

  res.send({ id: id, deleted: true });
};

//#endregion Document

//#region View
export interface CreateViewInput {
  id?: string;
  name: string;
  type: ViewType;
  collectionID: string;
}

const viewTypes: ViewType[] = ['list', 'board'];
const createViewInputSchema = yup
  .object<CreateViewInput>({
    id: yup.string(),
    name: yup.string().required(),
    type: yup.mixed().oneOf(viewTypes).required() as yup.MixedSchema<ViewType>,
    collectionID: yup.string().required(),
  })
  .required();

export const handleCreateView: AH = async (ctx, req, res) => {
  validateInput(createViewInputSchema, req.body);

  const { id, name, type, collectionID } = req.body;

  const view = await createView(ctx.db, id ?? v4(), name, type, collectionID);

  res.send(view);
};

export interface UpdateViewNameInput {
  name: string;
}

const updateViewNameInputSchema = yup
  .object<UpdateViewNameInput>({
    name: yup.string().required(),
  })
  .required();

export const handleUpdateViewName: AH = async (ctx, req, res) => {
  validateInput(updateViewNameInputSchema, req.body);
  validateParams(idParamsSchema, req.params);

  const { id } = req.params;
  const { name } = req.body;

  const view = await updateViewName(ctx.db, id, name);

  res.send(view);
};

export const handleGetView: AH = async (ctx, req, res) => {
  validateParams(idParamsSchema, req.params);

  const { id } = req.params;
  const view = await getViewByID(ctx.db, id);

  res.send(view);
};

export const handleDeleteView: AH = async (ctx, req, res) => {
  validateParams(idParamsSchema, req.params);
  const { id } = req.params;

  await deleteView(ctx.db, id);

  res.send({ id: id, deleted: true });
};

//#endregion View

//#region Field
export interface CreateFieldInput {
  id?: string;
  name: string;
  type: FieldType;
  collectionID: string;
}

const fieldTypes: FieldType[] = [
  'singleLineText',
  'multiLineText',
  'singleSelect',
  'multiSelect',
  'singleCollaborator',
  'multiCollaborator',
  'singleDocumentLink',
  'multiDocumentLink',
  'date',
  'phoneNumber',
  'email',
  'url',
  'number',
  'currency',
  'checkbox',
];

const createFieldInputSchema = yup
  .object<CreateFieldInput>({
    id: yup.string(),
    name: yup.string().required(),
    type: yup.mixed().oneOf(fieldTypes).required() as yup.MixedSchema<
      FieldType
    >,
    collectionID: yup.string().required(),
  })
  .required();

export const handleCreateField: AH = async (ctx, req, res) => {
  validateInput(createFieldInputSchema, req.body);

  const { id, name, type, collectionID } = req.body;

  const view = await createField(ctx.db, id ?? v4(), name, type, collectionID);

  res.send(view);
};

export interface UpdateFieldNameInput {
  name: string;
}

const updateFieldNameInputSchema = yup
  .object<UpdateFieldNameInput>({
    name: yup.string().required(),
  })
  .required();

export const handleUpdateFieldName: AH = async (ctx, req, res) => {
  validateInput(updateFieldNameInputSchema, req.body);
  validateParams(idParamsSchema, req.params);

  const { id } = req.params;
  const { name } = req.body;

  const view = await updateFieldName(ctx.db, id, name);

  res.send(view);
};

export const handleGetField: AH = async (ctx, req, res) => {
  validateParams(idParamsSchema, req.params);

  const { id } = req.params;
  const view = await getFieldByID(ctx.db, id);

  res.send(view);
};

export const handleDeleteField: AH = async (ctx, req, res) => {
  validateParams(idParamsSchema, req.params);
  const { id } = req.params;

  await deleteField(ctx.db, id);

  res.send({ id: id, deleted: true });
};

//#endregion Field
