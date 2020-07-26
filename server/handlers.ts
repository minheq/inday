import { Request, Response } from 'express';
import { createContext } from './context';
import { createWorkspace, wrapInTx, CreateWorkspaceInput } from './db';

function validateCreateWorkspaceInput(requestBody: any): CreateWorkspaceInput {
  return requestBody;
}

export async function handleCreateWorkspace(req: Request, res: Response) {
  const ctx = createContext(req);
  const input = validateCreateWorkspaceInput(req.body);

  const workspace = await wrapInTx(async () => {
    return createWorkspace(input);
  });

  res.json(workspace);
}
