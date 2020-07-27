import fastify from 'fastify';

import {
  addContext,
  handleCreateWorkspace,
  handleUpdateWorkspaceName,
  handleGetWorkspace,
  handleDeleteWorkspace,
  ensureAuthenticated,
  handleCreateSpace,
  handleUpdateSpaceName,
  handleGetSpace,
  handleDeleteSpace,
  handleCreateCollection,
  handleUpdateCollectionName,
  handleGetCollection,
  handleDeleteCollection,
  handleCreateView,
  handleUpdateViewName,
  handleGetView,
  handleDeleteView,
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
  api.post(
    '/v0/workspaces/:id/updateName',
    addContext(ensureAuthenticated(handleUpdateWorkspaceName)),
  );
  api.get(
    '/v0/workspaces/:id',
    addContext(ensureAuthenticated(handleGetWorkspace)),
  );
  api.delete(
    '/v0/workspaces/:id',
    addContext(ensureAuthenticated(handleDeleteWorkspace)),
  );

  api.post('/v0/spaces', addContext(ensureAuthenticated(handleCreateSpace)));
  api.post(
    '/v0/spaces/:id/updateName',
    addContext(ensureAuthenticated(handleUpdateSpaceName)),
  );
  api.get('/v0/spaces/:id', addContext(ensureAuthenticated(handleGetSpace)));
  api.delete(
    '/v0/spaces/:id',
    addContext(ensureAuthenticated(handleDeleteSpace)),
  );

  api.post(
    '/v0/collections',
    addContext(ensureAuthenticated(handleCreateCollection)),
  );
  api.post(
    '/v0/collections/:id/updateName',
    addContext(ensureAuthenticated(handleUpdateCollectionName)),
  );
  api.get(
    '/v0/collections/:id',
    addContext(ensureAuthenticated(handleGetCollection)),
  );
  api.delete(
    '/v0/collections/:id',
    addContext(ensureAuthenticated(handleDeleteCollection)),
  );

  api.post('/v0/views', addContext(ensureAuthenticated(handleCreateView)));
  api.post(
    '/v0/views/:id/updateName',
    addContext(ensureAuthenticated(handleUpdateViewName)),
  );
  api.get('/v0/views/:id', addContext(ensureAuthenticated(handleGetView)));
  api.delete(
    '/v0/views/:id',
    addContext(ensureAuthenticated(handleDeleteView)),
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
