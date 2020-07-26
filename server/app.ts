import fastify from 'fastify';

import {
  addContext,
  handleCreateWorkspace,
  handleFullUpdateWorkspace,
  handlePartialUpdateWorkspace,
  handleGetWorkspace,
  handleDeleteWorkspace,
  ensureAuthenticated,
} from './handlers';

export function createApp() {
  const app = fastify();

  app.post(
    '/v0/workspaces',
    addContext(ensureAuthenticated(handleCreateWorkspace)),
  );
  app.put(
    '/v0/workspaces/:id',
    addContext(ensureAuthenticated(handleFullUpdateWorkspace)),
  );
  app.patch(
    '/v0/workspaces/:id',
    addContext(ensureAuthenticated(handlePartialUpdateWorkspace)),
  );
  app.get(
    '/v0/workspaces/:id',
    addContext(ensureAuthenticated(handleGetWorkspace)),
  );
  app.delete(
    '/v0/workspaces/:id',
    addContext(ensureAuthenticated(handleDeleteWorkspace)),
  );

  return app;
}
