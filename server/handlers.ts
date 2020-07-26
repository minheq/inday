import { FastifyReply, FastifyRequest } from 'fastify';
import { v4 } from 'uuid';
import * as yup from 'yup';

import { createContext } from './context';
import {
  createWorkspace,
  fullUpdateWorkspace,
  partialUpdateWorkspace,
  getWorkspace,
  deleteWorkspace,
} from './db';

type Request = FastifyRequest;
type Response = FastifyReply;

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
  const { id, name } = req.body as CreateWorkspaceInput;

  const workspace = await createWorkspace(id ?? v4(), name, ctx.userID);

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
  const { id } = req.params as { id: string };
  const { name } = req.body as PartialUpdateWorkspaceInput;

  const workspace = await partialUpdateWorkspace(id, name);

  res.send(workspace);
}

export async function handleGetWorkspace(req: Request, res: Response) {
  const { id } = req.params as { id: string };

  const workspace = await getWorkspace(id);

  res.send(workspace);
}

export async function handleDeleteWorkspace(req: Request, res: Response) {
  const { id } = req.params as { id: string };

  const workspace = await deleteWorkspace(id);

  res.send(workspace);
}
