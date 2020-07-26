import fastify from 'fastify';

import {
  handleCreateWorkspace,
  handleFullUpdateWorkspace,
  handlePartialUpdateWorkspace,
  handleGetWorkspace,
  handleDeleteWorkspace,
} from './handlers';

export function createApp() {
  const app = fastify();

  app.post('/v0/workspaces', handleCreateWorkspace);
  app.put('/v0/workspaces/:id', handleFullUpdateWorkspace);
  app.patch('/v0/workspaces/:id', handlePartialUpdateWorkspace);
  app.get('/v0/workspaces/:id', handleGetWorkspace);
  app.delete('/v0/workspaces/:id', handleDeleteWorkspace);

  return app;
}
