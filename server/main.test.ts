import { Server } from 'http';
import request from 'supertest';
import { runServer } from './main';
import { CreateWorkspaceInput } from './db';
import { Workspace } from '../app/data/workspace';

let server: Server;

beforeAll(async () => {
  server = await runServer();
});

afterAll(async () => {
  server.close();
});

describe('/workspace', () => {
  describe('POST /', () => {
    test('without ID', async () => {
      const input: CreateWorkspaceInput = {
        name: 'Hello',
      };

      const expected: Workspace = {
        id: '',
        name: input.name,
      };

      const res = await request(server).post('/v0/workspace').send(input);

      expect(res.status).toEqual(200);
      expect(res.body.name).toBe(expected.name);
      expect(res.body.id).toBeTruthy();
    });
  });
});
