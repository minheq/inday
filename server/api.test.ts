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
  createView,
} from './db';
import {
  CreateWorkspaceInput,
  UpdateWorkspaceNameInput,
  CreateSpaceInput,
  UpdateSpaceNameInput,
  CreateCollectionInput,
  UpdateCollectionNameInput,
  CreateViewInput,
  UpdateViewNameInput,
} from './handlers';
import { Space } from '../app/data/spaces';
import { Collection } from '../app/data/collections';
import { View } from '../app/data/views';

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

  describe('POST /v0/workspaces/:id/updateName', () => {
    test('happy path', async () => {
      const workspace = await createWorkspace(db, v4(), 'test2', '1');
      const input: UpdateWorkspaceNameInput = {
        name: 'test3',
      };

      const res = await api.inject({
        url: `/v0/workspaces/${workspace.id}/updateName`,
        method: 'POST',
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

  describe('POST /v0/spaces/:id', () => {
    test('happy path', async () => {
      const space = await createSpace(db, v4(), 'test2', workspace.id);
      const input: UpdateSpaceNameInput = {
        name: 'test3',
      };

      const res = await api.inject({
        url: `/v0/spaces/${space.id}/updateName`,
        method: 'POST',
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

describe('Collections', () => {
  let workspace: Workspace;
  let space: Space;

  beforeAll(async () => {
    workspace = await createWorkspace(db, v4(), 'collections', '1');
    space = await createSpace(db, v4(), 'collections', workspace.id);
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

  describe('POST /v0/collections/:id/updateName', () => {
    test('happy path', async () => {
      const collection = await createCollection(db, v4(), 'test2', space.id);
      const input: UpdateCollectionNameInput = {
        name: 'test3',
      };

      const res = await api.inject({
        url: `/v0/collections/${collection.id}/updateName`,
        method: 'POST',
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
      const collection = await createCollection(db, v4(), 'test6', space.id);

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
      const collection = await createCollection(db, v4(), 'test6', space.id);

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

describe('Views', () => {
  let workspace: Workspace;
  let space: Space;
  let collection: Collection;

  beforeAll(async () => {
    workspace = await createWorkspace(db, v4(), 'views', '1');
    space = await createSpace(db, v4(), 'views', workspace.id);
    collection = await createCollection(db, v4(), 'views', space.id);
  });

  describe('POST /v0/views', () => {
    test('happy path', async () => {
      const input: CreateViewInput = {
        name: 'test1',
        type: 'list',
        collectionID: collection.id,
      };

      const res = await api.inject({
        url: '/v0/views',
        method: 'POST',
        payload: input,
      });
      const result = res.json() as View;

      expect(res.statusCode).toEqual(200);
      expect(result.name).toBe(input.name);
      expect(result.id).toBeTruthy();
    });
  });

  describe('POST /v0/views/:id/updateName', () => {
    test('happy path', async () => {
      const view = await createView(db, v4(), 'test2', 'list', collection.id);
      const input: UpdateViewNameInput = {
        name: 'test3',
      };

      const res = await api.inject({
        url: `/v0/views/${view.id}/updateName`,
        method: 'POST',
        payload: input,
      });
      const result = res.json() as View;

      expect(res.statusCode).toEqual(200);
      expect(result.name).toBe(input.name);
      expect(result.id).toBeTruthy();
    });
  });

  describe('DELETE /v0/views/:id', () => {
    test('happy path', async () => {
      const view = await createView(db, v4(), 'test6', 'list', collection.id);

      const res = await api.inject({
        url: `/v0/views/${view.id}`,
        method: 'DELETE',
      });
      const result = res.json();

      expect(res.statusCode).toEqual(200);
      expect(result.id).toBe(view.id);
      expect(result.deleted).toBeTruthy();
    });
  });

  describe('GET /v0/views/:id', () => {
    test('happy path', async () => {
      const view = await createView(db, v4(), 'test6', 'list', collection.id);

      const res = await api.inject({
        url: `/v0/views/${view.id}`,
        method: 'GET',
      });
      const result = res.json() as View;

      expect(res.statusCode).toEqual(200);
      expect(result.name).toBe(view.name);
    });
  });
});
