import { FastifyReply, FastifyRequest } from 'fastify';
import { v4 } from 'uuid';
import * as yup from 'yup';

import {
  createWorkspace,
  fullUpdateWorkspace,
  partialUpdateWorkspace,
  getWorkspace,
  deleteWorkspace,
} from './db';
import { AuthenticationError, UnauthorizedError } from './errors';

type Request = FastifyRequest;
type Response = FastifyReply;

interface AuthenticatedContext {
  userID: string;
}

interface UnauthenticatedContext {
  userID: undefined;
}

type Context = AuthenticatedContext | UnauthenticatedContext;

async function createContext(_req: Request): Promise<Context> {
  return {
    userID: '1',
  };
}

function ensureAuthenticated(
  ctx: Context,
): asserts ctx is AuthenticatedContext {
  if (ctx.userID === undefined) {
    throw new AuthenticationError();
  }
}

function getCurrentUserID(ctx: Context): string {
  ensureAuthenticated(ctx);

  return ctx.userID;
}

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

export async function handleCreateWorkspace(req: Request, res: Response) {
  await createWorkspaceInputSchema.validate(req.body);
  const ctx = await createContext(req);
  const currentUserID = getCurrentUserID(ctx);

  const { id, name } = req.body as CreateWorkspaceInput;

  const workspace = await createWorkspace(id ?? v4(), name, currentUserID);

  res.send(workspace);
}

export interface FullUpdateWorkspaceInput {
  name: string;
}

const fullUpdateWorkspaceInputSchema = yup
  .object<CreateWorkspaceInput>({
    name: yup.string().required(),
  })
  .required();

export async function handleFullUpdateWorkspace(req: Request, res: Response) {
  await fullUpdateWorkspaceInputSchema.validate(req.body);
  const ctx = await createContext(req);
  ensureAuthenticated(ctx);

  const { id } = req.params as { id: string };
  const { name } = req.body as FullUpdateWorkspaceInput;

  const workspace = await fullUpdateWorkspace(id, name);

  res.send(workspace);
}

export interface PartialUpdateWorkspaceInput {
  name?: string;
}

const partialUpdateWorkspaceInputSchema = yup
  .object<CreateWorkspaceInput>({
    name: yup.string().required(),
  })
  .required();

export async function handlePartialUpdateWorkspace(
  req: Request,
  res: Response,
) {
  await partialUpdateWorkspaceInputSchema.validate(req.body);
  const ctx = await createContext(req);
  ensureAuthenticated(ctx);

  const { id } = req.params as { id: string };
  const { name } = req.body as PartialUpdateWorkspaceInput;

  const workspace = await partialUpdateWorkspace(id, name);

  res.send(workspace);
}

export async function handleGetWorkspace(req: Request, res: Response) {
  const ctx = await createContext(req);
  ensureAuthenticated(ctx);

  const { id } = req.params as { id: string };
  const workspace = await getWorkspace(id);

  res.send(workspace);
}

export async function handleDeleteWorkspace(req: Request, res: Response) {
  const ctx = await createContext(req);
  const currentUserID = getCurrentUserID(ctx);

  const { id } = req.params as { id: string };

  const workspace = await getWorkspace(id);

  if (workspace.ownerID !== currentUserID) {
    throw new UnauthorizedError();
  }

  await deleteWorkspace(id);

  res.send({ id, deleted: true });
}
