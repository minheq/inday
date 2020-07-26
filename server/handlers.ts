import { FastifyReply, FastifyRequest } from 'fastify';
import { v4 } from 'uuid';

import { createContext } from './context';
import { wrapInTx, createWorkspace } from './db';

type Request = FastifyRequest;
type Response = FastifyReply;

export interface CreateWorkspaceInput {
  id?: string;
  name: string;
}

function validateCreateWorkspaceInput(requestBody: any): CreateWorkspaceInput {
  return requestBody;
}

export async function handleCreateWorkspace(req: Request, res: Response) {
  const ctx = await createContext(req);
  const input = validateCreateWorkspaceInput(req.body);

  const { id, name } = input;

  const workspace = await wrapInTx(async () => {
    return createWorkspace(id ?? v4(), name, ctx.userID);
  });

  res.send(workspace);
}
