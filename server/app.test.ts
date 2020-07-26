import { FastifyInstance } from 'fastify';
import { createApp } from './app';

import { Workspace } from '../app/data/workspace';
import { closeDB, createWorkspace } from './db';
import { v4 } from 'uuid';
import { CreateWorkspaceInput, FullUpdateWorkspaceInput } from './handlers';

let app: FastifyInstance;

beforeAll(async () => {
  app = createApp();
});

afterAll(async () => {
  await closeDB();
});

describe('POST /v0/workspaces', () => {
  test('happy path', async () => {
    const input: CreateWorkspaceInput = {
      name: 'Hello',
    };

    const res = await app.inject({
      url: '/v0/workspaces',
      method: 'POST',
      payload: input,
    });
    const result = res.json() as Workspace;

    expect(res.statusCode).toEqual(200);
    expect(result.name).toBe(input.name);
    expect(result.id).toBeTruthy();
  });
});

describe('PUT /v0/workspaces/:id', () => {
  test('happy path', async () => {
    const workspace = await createWorkspace(v4(), 'Previous name', '1');
    const input: FullUpdateWorkspaceInput = {
      name: 'Next name',
    };

    const res = await app.inject({
      url: `/v0/workspaces/${workspace.id}`,
      method: 'PUT',
      payload: input,
    });
    const result = res.json() as Workspace;

    expect(res.statusCode).toEqual(200);
    expect(result.name).toBe(input.name);
    expect(result.id).toBeTruthy();
  });
});
