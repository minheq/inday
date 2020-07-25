import { Context } from '../context';
import { Database } from '../db';
import { Workspace } from '../../app/data/workspace';

export interface CreateWorkspaceInput {
  id?: string;
  name: string;
}

export async function createWorkspace(
  ctx: Context,
  input: CreateWorkspaceInput,
  _db: Database,
): Promise<Workspace> {
  const { name } = input;

  return { id: '', name };
}
