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

export function createAPI() {
  const api = fastify();

  api.post(
    '/v0/workspaces',
    addContext(ensureAuthenticated(handleCreateWorkspace)),
  );
  api.put(
    '/v0/workspaces/:id',
    addContext(ensureAuthenticated(handleFullUpdateWorkspace)),
  );
  api.patch(
    '/v0/workspaces/:id',
    addContext(ensureAuthenticated(handlePartialUpdateWorkspace)),
  );
  api.get(
    '/v0/workspaces/:id',
    addContext(ensureAuthenticated(handleGetWorkspace)),
  );
  api.delete(
    '/v0/workspaces/:id',
    addContext(ensureAuthenticated(handleDeleteWorkspace)),
  );

  api.setErrorHandler((err, req, res) => {
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

  return api;
}
