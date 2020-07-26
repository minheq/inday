import fastify from 'fastify';

import { handleCreateWorkspace } from './handlers';

export function createApp() {
  const app = fastify();

  // routes
  app.post('/v0/workspace', handleCreateWorkspace);

  return app;
}
