import { FastifyInstance } from 'fastify';
import { createAPI } from './api';

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
  createField,
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
  CreateFieldInput,
  UpdateFieldNameInput,
  DuplicateFieldInput,
} from './handlers';
import { Space } from '../app/data/spaces';
import { Collection } from '../app/data/collections';
import { View } from '../app/data/views';
import { Field } from '../app/data/fields';
import { generateID } from '../lib/id/id';

let api: FastifyInstance;
let db: DB;
const userID = '1';

beforeAll(async () => {
  await cleanDB();
  api = createAPI();
  db = await getDB();
});

afterAll(async () => {
  await closeDB(db);
});

describe('Workspaces', () => {
  describe('create', () => {
    test('happy path', async () => {
      const input: CreateWorkspaceInput = {
        name: 'test1',
      };

      const res = await api.inject({
        url: `/v0/workspaces/${generateID()}/create`,
        method: 'POST',
        payload: input,
      });
      const result = res.json() as Workspace;

      expect(res.statusCode).toEqual(200);
      expect(result.name).toBe(input.name);
      expect(result.id).toBeTruthy();
    });
  });

  describe('updateName', () => {
    test('happy path', async () => {
      const workspace = await createWorkspace(
        db,
        generateID(),
        'test2',
        userID,
      );
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

  describe('delete', () => {
    test('happy path', async () => {
      const workspace = await createWorkspace(
        db,
        generateID(),
        'test6',
        userID,
      );

      const res = await api.inject({
        url: `/v0/workspaces/${workspace.id}/delete`,
        method: 'POST',
      });
      const result = res.json();

      expect(res.statusCode).toEqual(200);
      expect(result.id).toBe(workspace.id);
      expect(result.deleted).toBeTruthy();
    });
  });

  describe('get', () => {
    test('happy path', async () => {
      const workspace = await createWorkspace(
        db,
        generateID(),
        'test6',
        userID,
      );

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
    workspace = await createWorkspace(db, generateID(), 'spaces', userID);
  });

  describe('create', () => {
    test('happy path', async () => {
      const input: CreateSpaceInput = {
        name: 'test1',
        workspaceID: workspace.id,
      };

      const res = await api.inject({
        url: `/v0/spaces/${generateID()}/create`,
        method: 'POST',
        payload: input,
      });
      const result = res.json() as Space;

      expect(res.statusCode).toEqual(200);
      expect(result.name).toBe(input.name);
      expect(result.id).toBeTruthy();
    });
  });

  describe('updateName', () => {
    test('happy path', async () => {
      const space = await createSpace(db, generateID(), 'test2', workspace.id);
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

  describe('delete', () => {
    test('happy path', async () => {
      const space = await createSpace(db, generateID(), 'test6', workspace.id);

      const res = await api.inject({
        url: `/v0/spaces/${space.id}/delete`,
        method: 'POST',
      });
      const result = res.json();

      expect(res.statusCode).toEqual(200);
      expect(result.id).toBe(space.id);
      expect(result.deleted).toBeTruthy();
    });
  });

  describe('get', () => {
    test('happy path', async () => {
      const space = await createSpace(db, generateID(), 'test6', workspace.id);

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
    workspace = await createWorkspace(db, generateID(), 'collections', userID);
    space = await createSpace(db, generateID(), 'collections', workspace.id);
  });

  describe('create', () => {
    test('happy path', async () => {
      const input: CreateCollectionInput = {
        name: 'test1',
        spaceID: space.id,
      };

      const res = await api.inject({
        url: `/v0/collections/${generateID()}/create`,
        method: 'POST',
        payload: input,
      });
      const result = res.json() as Collection;

      expect(res.statusCode).toEqual(200);
      expect(result.name).toBe(input.name);
      expect(result.id).toBeTruthy();
    });
  });

  describe('updateName', () => {
    test('happy path', async () => {
      const collection = await createCollection(
        db,
        generateID(),
        'test2',
        space.id,
      );
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

  describe('delete', () => {
    test('happy path', async () => {
      const collection = await createCollection(
        db,
        generateID(),
        'test6',
        space.id,
      );

      const res = await api.inject({
        url: `/v0/collections/${collection.id}/delete`,
        method: 'POST',
      });
      const result = res.json();

      expect(res.statusCode).toEqual(200);
      expect(result.id).toBe(collection.id);
      expect(result.deleted).toBeTruthy();
    });
  });

  describe('get', () => {
    test('happy path', async () => {
      const collection = await createCollection(
        db,
        generateID(),
        'test6',
        space.id,
      );

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
    workspace = await createWorkspace(db, generateID(), 'views', userID);
    space = await createSpace(db, generateID(), 'views', workspace.id);
    collection = await createCollection(db, generateID(), 'views', space.id);
  });

  describe('create', () => {
    test('happy path', async () => {
      const input: CreateViewInput = {
        name: 'test1',
        type: 'list',
        collectionID: collection.id,
      };

      const res = await api.inject({
        url: `/v0/views/${generateID()}/create`,
        method: 'POST',
        payload: input,
      });
      const result = res.json() as View;

      expect(res.statusCode).toEqual(200);
      expect(result.name).toBe(input.name);
      expect(result.id).toBeTruthy();
    });
  });

  describe('updateName', () => {
    test('happy path', async () => {
      const view = await createView(
        db,
        generateID(),
        'test2',
        'list',
        collection.id,
      );
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

  describe('delete', () => {
    test('happy path', async () => {
      const view = await createView(
        db,
        generateID(),
        'test6',
        'list',
        collection.id,
      );

      const res = await api.inject({
        url: `/v0/views/${view.id}/delete`,
        method: 'POST',
      });
      const result = res.json();

      expect(res.statusCode).toEqual(200);
      expect(result.id).toBe(view.id);
      expect(result.deleted).toBeTruthy();
    });
  });

  describe('get', () => {
    test('happy path', async () => {
      const view = await createView(
        db,
        generateID(),
        'test6',
        'list',
        collection.id,
      );

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

describe('Fields', () => {
  let workspace: Workspace;
  let space: Space;
  let collection: Collection;

  beforeAll(async () => {
    workspace = await createWorkspace(db, generateID(), 'fields', userID);
    space = await createSpace(db, generateID(), 'fields', workspace.id);
    collection = await createCollection(db, generateID(), 'fields', space.id);
  });

  describe('create', () => {
    test('happy path', async () => {
      const input: CreateFieldInput = {
        name: 'test1',
        type: 'singleLineText',
        collectionID: collection.id,
      };

      const res = await api.inject({
        url: `/v0/fields/${generateID()}/create`,
        method: 'POST',
        payload: input,
      });
      const result = res.json() as Field;

      expect(res.statusCode).toEqual(200);
      expect(result.name).toBe(input.name);
      expect(result.id).toBeTruthy();
    });
  });

  describe('duplicate', () => {
    test('happy path', async () => {
      const field = await createField(
        db,
        generateID(),
        'test2',
        'singleLineText',
        collection.id,
      );

      const input: DuplicateFieldInput = {
        fromFieldID: field.id,
        duplicateDocumentFieldValues: false,
      };

      const res = await api.inject({
        url: `/v0/fields/${generateID()}/duplicate`,
        method: 'POST',
        payload: input,
      });
      const result = res.json() as Field;

      expect(res.statusCode).toEqual(200);
      expect(result.name).toBe(field.name);
      expect(result.id).toBeTruthy();
    });
  });

  describe('updateName', () => {
    test('happy path', async () => {
      const field = await createField(
        db,
        generateID(),
        'test2',
        'singleLineText',
        collection.id,
      );
      const input: UpdateFieldNameInput = {
        name: 'test3',
      };

      const res = await api.inject({
        url: `/v0/fields/${field.id}/updateName`,
        method: 'POST',
        payload: input,
      });
      const result = res.json() as Field;

      expect(res.statusCode).toEqual(200);
      expect(result.name).toBe(input.name);
      expect(result.id).toBeTruthy();
    });
  });

  describe('delete', () => {
    test('happy path', async () => {
      const field = await createField(
        db,
        generateID(),
        'test6',
        'singleLineText',
        collection.id,
      );

      const res = await api.inject({
        url: `/v0/fields/${field.id}/delete`,
        method: 'POST',
      });
      const result = res.json();

      expect(res.statusCode).toEqual(200);
      expect(result.id).toBe(field.id);
      expect(result.deleted).toBeTruthy();
    });
  });

  describe('get', () => {
    test('happy path', async () => {
      const field = await createField(
        db,
        generateID(),
        'test6',
        'singleLineText',
        collection.id,
      );

      const res = await api.inject({
        url: `/v0/fields/${field.id}`,
        method: 'GET',
      });
      const result = res.json() as Field;

      expect(res.statusCode).toEqual(200);
      expect(result.name).toBe(field.name);
    });
  });
});
