import { FastifyInstance } from 'fastify';
import { createAPI } from './api';
import { v4 } from 'uuid';

import { Workspace } from '../app/data/workspace';
import {
  DB,
  closeDB,
  getDB,
  createWorkspace,
  cleanDB,
  createSpace,
} from './db';
import {
  CreateWorkspaceInput,
  FullUpdateWorkspaceInput,
  CreateSpaceInput,
  FullUpdateSpaceInput,
  PartialUpdateSpaceInput,
} from './handlers';
import { Space } from '../app/data/spaces';

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

describe('Workspaces', () => {
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

  describe('PUT /v0/workspaces/:id', () => {
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

  describe('PATCH /v0/workspaces/:id', () => {
    test('happy path', async () => {
      const workspace = await createWorkspace(db, v4(), 'test4', '1');
      const input: PartialUpdateSpaceInput = {
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

  describe('DELETE /v0/workspaces/:id', () => {
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

  describe('GET /v0/workspaces/:id', () => {
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
});

describe('Spaces', () => {
  let workspace: Workspace;

  beforeAll(async () => {
    workspace = await createWorkspace(db, v4(), 'spaces', '1');
  });

  describe('POST /v0/spaces', () => {
    test('happy path', async () => {
      const input: CreateSpaceInput = {
        name: 'test1',
        workspaceID: workspace.id,
      };

      const res = await api.inject({
        url: '/v0/spaces',
        method: 'POST',
        payload: input,
      });
      const result = res.json() as Space;

      expect(res.statusCode).toEqual(200);
      expect(result.name).toBe(input.name);
      expect(result.id).toBeTruthy();
    });
  });

  describe('PUT /v0/spaces/:id', () => {
    test('happy path', async () => {
      const space = await createSpace(db, v4(), 'test2', workspace.id);
      const input: FullUpdateSpaceInput = {
        name: 'test3',
      };

      const res = await api.inject({
        url: `/v0/spaces/${space.id}`,
        method: 'PUT',
        payload: input,
      });
      const result = res.json() as Space;

      expect(res.statusCode).toEqual(200);
      expect(result.name).toBe(input.name);
      expect(result.id).toBeTruthy();
    });
  });

  describe('PATCH /v0/spaces/:id', () => {
    test('happy path', async () => {
      const space = await createSpace(db, v4(), 'test4', workspace.id);
      const input: PartialUpdateSpaceInput = {
        name: 'test5',
      };

      const res = await api.inject({
        url: `/v0/spaces/${space.id}`,
        method: 'PATCH',
        payload: input,
      });
      const result = res.json() as Space;

      expect(res.statusCode).toEqual(200);
      expect(result.name).toBe(input.name);
      expect(result.id).toBeTruthy();
    });
  });

  describe('DELETE /v0/spaces/:id', () => {
    test('happy path', async () => {
      const space = await createSpace(db, v4(), 'test6', workspace.id);

      const res = await api.inject({
        url: `/v0/spaces/${space.id}`,
        method: 'DELETE',
      });
      const result = res.json();

      expect(res.statusCode).toEqual(200);
      expect(result.id).toBe(space.id);
      expect(result.deleted).toBeTruthy();
    });
  });

  describe('GET /v0/spaces/:id', () => {
    test('happy path', async () => {
      const space = await createSpace(db, v4(), 'test6', workspace.id);

      const res = await api.inject({
        url: `/v0/spaces/${space.id}`,
        method: 'GET',
      });
      const result = res.json() as Space;

      expect(res.statusCode).toEqual(200);
      expect(result.name).toBe(space.name);
    });
  });
});
