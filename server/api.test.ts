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
  createCollection,
} from './db';
import {
  CreateWorkspaceInput,
  FullUpdateWorkspaceInput,
  CreateSpaceInput,
  FullUpdateSpaceInput,
  PartialUpdateSpaceInput,
  CreateCollectionInput,
  FullUpdateCollectionInput,
  PartialUpdateCollectionInput,
} from './handlers';
import { Space } from '../app/data/spaces';
import { Collection } from '../app/data/collections';

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
      const workspace = await createWorkspace(db, {
        id: v4(),
        name: 'test2',
        userID: '1',
      });
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
      const workspace = await createWorkspace(db, {
        id: v4(),
        name: 'test4',
        userID: '1',
      });
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
      const workspace = await createWorkspace(db, {
        id: v4(),
        name: 'test6',
        userID: '1',
      });

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
      const workspace = await createWorkspace(db, {
        id: v4(),
        name: 'test6',
        userID: '1',
      });

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
    workspace = await createWorkspace(db, {
      id: v4(),
      name: 'spaces',
      userID: '1',
    });
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
      const space = await createSpace(db, {
        id: v4(),
        name: 'test2',
        workspaceID: workspace.id,
      });
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
      const space = await createSpace(db, {
        id: v4(),
        name: 'test4',
        workspaceID: workspace.id,
      });
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
      const space = await createSpace(db, {
        id: v4(),
        name: 'test6',
        workspaceID: workspace.id,
      });

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
      const space = await createSpace(db, {
        id: v4(),
        name: 'test6',
        workspaceID: workspace.id,
      });

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

describe('Collections', () => {
  let workspace: Workspace;
  let space: Space;

  beforeAll(async () => {
    workspace = await createWorkspace(db, {
      id: v4(),
      name: 'collections',
      userID: '1',
    });
    space = await createSpace(db, {
      id: v4(),
      name: 'collections',
      workspaceID: workspace.id,
    });
  });

  describe('POST /v0/collections', () => {
    test('happy path', async () => {
      const input: CreateCollectionInput = {
        name: 'test1',
        spaceID: space.id,
      };

      const res = await api.inject({
        url: '/v0/collections',
        method: 'POST',
        payload: input,
      });
      const result = res.json() as Collection;

      expect(res.statusCode).toEqual(200);
      expect(result.name).toBe(input.name);
      expect(result.id).toBeTruthy();
    });
  });

  describe('PUT /v0/collections/:id', () => {
    test('happy path', async () => {
      const collection = await createCollection(db, {
        id: v4(),
        name: 'test2',
        spaceID: space.id,
      });
      const input: FullUpdateCollectionInput = {
        name: 'test3',
      };

      const res = await api.inject({
        url: `/v0/collections/${collection.id}`,
        method: 'PUT',
        payload: input,
      });
      const result = res.json() as Collection;

      expect(res.statusCode).toEqual(200);
      expect(result.name).toBe(input.name);
      expect(result.id).toBeTruthy();
    });
  });

  describe('PATCH /v0/collections/:id', () => {
    test('happy path', async () => {
      const collection = await createCollection(db, {
        id: v4(),
        name: 'test4',
        spaceID: space.id,
      });
      const input: PartialUpdateCollectionInput = {
        name: 'test5',
      };

      const res = await api.inject({
        url: `/v0/collections/${collection.id}`,
        method: 'PATCH',
        payload: input,
      });
      const result = res.json() as Collection;

      expect(res.statusCode).toEqual(200);
      expect(result.name).toBe(input.name);
      expect(result.id).toBeTruthy();
    });
  });

  describe('DELETE /v0/collections/:id', () => {
    test('happy path', async () => {
      const collection = await createCollection(db, {
        id: v4(),
        name: 'test6',
        spaceID: space.id,
      });

      const res = await api.inject({
        url: `/v0/collections/${collection.id}`,
        method: 'DELETE',
      });
      const result = res.json();

      expect(res.statusCode).toEqual(200);
      expect(result.id).toBe(collection.id);
      expect(result.deleted).toBeTruthy();
    });
  });

  describe('GET /v0/collections/:id', () => {
    test('happy path', async () => {
      const collection = await createCollection(db, {
        id: v4(),
        name: 'test6',
        spaceID: space.id,
      });

      const res = await api.inject({
        url: `/v0/collections/${collection.id}`,
        method: 'GET',
      });
      const result = res.json() as Collection;

      expect(res.statusCode).toEqual(200);
      expect(result.name).toBe(collection.name);
    });
  });
});
