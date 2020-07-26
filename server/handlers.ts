import { FastifyReply, FastifyRequest } from 'fastify';
import { v4 } from 'uuid';
import * as yup from 'yup';

import {
  DB,
  wrapInTx,
  createWorkspace,
  fullUpdateWorkspace,
  partialUpdateWorkspace,
  getWorkspace,
  deleteWorkspace,
} from './db';
import {
  AuthenticationError,
  UnauthorizedError,
  ValidationErrorField,
  ValidationError,
} from './errors';

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

function validate<T extends object>(
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

function matchParams<T extends object>(
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

//#region Handlers
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
  validate(createWorkspaceInputSchema, req.body);
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

export interface FullUpdateWorkspaceInput {
  name: string;
}

const fullUpdateWorkspaceInputSchema = yup
  .object<CreateWorkspaceInput>({
    name: yup.string().required(),
  })
  .required();

export const handleFullUpdateWorkspace: AH = async (ctx, req, res) => {
  validate(fullUpdateWorkspaceInputSchema, req.body);
  matchParams(idParamsSchema, req.params);

  const { id } = req.params;
  const { name } = req.body;

  const workspace = await fullUpdateWorkspace(ctx.db, id, name);

  res.send(workspace);
};

export interface PartialUpdateWorkspaceInput {
  name?: string;
}

const partialUpdateWorkspaceInputSchema = yup
  .object<CreateWorkspaceInput>({
    name: yup.string().required(),
  })
  .required();

export const handlePartialUpdateWorkspace: AH = async (ctx, req, res) => {
  validate(partialUpdateWorkspaceInputSchema, req.body);
  matchParams(idParamsSchema, req.params);

  const { id } = req.params;
  const { name } = req.body;

  const workspace = await partialUpdateWorkspace(ctx.db, id, name);

  res.send(workspace);
};

export const handleGetWorkspace: AH = async (ctx, req, res) => {
  matchParams(idParamsSchema, req.params);

  const { id } = req.params;
  const workspace = await getWorkspace(ctx.db, id);

  res.send(workspace);
};

export const handleDeleteWorkspace: AH = async (ctx, req, res) => {
  matchParams(idParamsSchema, req.params);
  const currentUserID = getCurrentUserID(ctx);
  const { id } = req.params;

  const workspace = await getWorkspace(ctx.db, id);

  if (workspace.ownerID !== currentUserID) {
    throw new UnauthorizedError();
  }

  await deleteWorkspace(ctx.db, id);

  res.send({ id: id, deleted: true });
};

//#endregion Handlers
