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
import {
  ValidationError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  AuthenticationError,
} from './errors';

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

  app.setErrorHandler((err, req, res) => {
    if (err instanceof ValidationError) {
      res.status(400).send({
        message: 'invalid input',
        fields: err.fields,
      });
    } else if (err instanceof NotFoundError) {
      res.status(404).send({
        message: err.message,
      });
    } else if (err instanceof BadRequestError) {
      res.status(400).send({
        message: err.message,
      });
    } else if (err instanceof UnauthorizedError) {
      res.status(403).send({
        message: err.message,
      });
    } else if (err instanceof AuthenticationError) {
      res.status(401).send({
        message: err.message,
      });
    } else {
      res.status(500).send({
        message: err.message,
      });
    }
  });

  return app;
}
