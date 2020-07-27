import { FastifyInstance } from 'fastify';
import { createAPI } from './api';
import { v4 } from 'uuid';

import { Workspace } from '../app/data/workspace';
import { DB, closeDB, getDB, createWorkspace, cleanDB } from './db';
import { CreateWorkspaceInput, FullUpdateWorkspaceInput } from './handlers';

let api: FastifyInstance;
let db: DB;

beforeAll(async () => {
  await cleanDB();
  api = createAPI();
  db = await getDB();
});

afterAll(async () => {
  await closeDB(db);
});

describe('POST /v0/workspaces', () => {
  test('happy path', async () => {
    const input: CreateWorkspaceInput = {
      name: 'test1',
    };

    const res = await api.inject({
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

describe('PUT /v0/workspaces/:workspaceID', () => {
  test('happy path', async () => {
    const workspace = await createWorkspace(db, v4(), 'test2', '1');
    const input: FullUpdateWorkspaceInput = {
      name: 'test3',
    };

    const res = await api.inject({
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

describe('PATCH /v0/workspaces/:workspaceID', () => {
  test('happy path', async () => {
    const workspace = await createWorkspace(db, v4(), 'test4', '1');
    const input: FullUpdateWorkspaceInput = {
      name: 'test5',
    };

    const res = await api.inject({
      url: `/v0/workspaces/${workspace.id}`,
      method: 'PATCH',
      payload: input,
    });
    const result = res.json() as Workspace;

    expect(res.statusCode).toEqual(200);
    expect(result.name).toBe(input.name);
    expect(result.id).toBeTruthy();
  });
});

describe('DELETE /v0/workspaces/:workspaceID', () => {
  test('happy path', async () => {
    const workspace = await createWorkspace(db, v4(), 'test6', '1');

    const res = await api.inject({
      url: `/v0/workspaces/${workspace.id}`,
      method: 'DELETE',
    });
    const result = res.json();

    expect(res.statusCode).toEqual(200);
    expect(result.id).toBe(workspace.id);
    expect(result.deleted).toBeTruthy();
  });
});

describe('GET /v0/workspaces/:workspaceID', () => {
  test('happy path', async () => {
    const workspace = await createWorkspace(db, v4(), 'test6', '1');

    const res = await api.inject({
      url: `/v0/workspaces/${workspace.id}`,
      method: 'GET',
    });
    const result = res.json() as Workspace;

    expect(res.statusCode).toEqual(200);
    expect(result.name).toBe(workspace.name);
  });
});
