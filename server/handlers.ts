import { Request, Response } from 'express';
import { createContext } from './context';
import { createWorkspace, CreateWorkspaceInput } from './workspace/mutations';
import { db } from './db';

function validateCreateWorkspaceInput(requestBody: any): CreateWorkspaceInput {
  return requestBody;
}

export async function handleCreateWorkspace(req: Request, res: Response) {
  const ctx = createContext(req);
  const input = validateCreateWorkspaceInput(req.body);

  const workspace = await createWorkspace(ctx, input, db);

  res.json(workspace);
}
