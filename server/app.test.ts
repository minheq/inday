import { FastifyInstance } from 'fastify';
import { createApp } from './app';

import { Workspace } from '../app/data/workspace';
import { closeDB } from './db';

let app: FastifyInstance;

beforeAll(async () => {
  app = createApp();
});

afterAll(async () => {
  await closeDB();
});

describe('/workspace', () => {
  describe('POST /', () => {
    test('without ID', async () => {
      const input = {
        name: 'Hello',
      };

      const expected: Workspace = {
        id: '',
        name: input.name,
      };

      const res = await app.inject({
        url: '/v0/workspace',
        method: 'POST',
        payload: input,
      });
      const result = res.json();

      expect(res.statusCode).toEqual(200);
      expect(result.name).toBe(expected.name);
      expect(result.id).toBeTruthy();
    });
  });
});
