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
  handleCreateField,
  handleUpdateFieldName,
  handleGetField,
  handleDeleteField,
  handleDuplicateField,
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
    '/v0/workspaces/:workspaceID/create',
    addContext(ensureAuthenticated(handleCreateWorkspace)),
  );
  api.post(
    '/v0/workspaces/:workspaceID/updateName',
    addContext(ensureAuthenticated(handleUpdateWorkspaceName)),
  );
  api.post(
    '/v0/workspaces/:workspaceID/delete',
    addContext(ensureAuthenticated(handleDeleteWorkspace)),
  );
  api.get(
    '/v0/workspaces/:workspaceID',
    addContext(ensureAuthenticated(handleGetWorkspace)),
  );

  api.post(
    '/v0/spaces/:spaceID/create',
    addContext(ensureAuthenticated(handleCreateSpace)),
  );
  api.post(
    '/v0/spaces/:spaceID/updateName',
    addContext(ensureAuthenticated(handleUpdateSpaceName)),
  );
  api.post(
    '/v0/spaces/:spaceID/delete',
    addContext(ensureAuthenticated(handleDeleteSpace)),
  );
  api.get(
    '/v0/spaces/:spaceID',
    addContext(ensureAuthenticated(handleGetSpace)),
  );

  api.post(
    '/v0/collections/:collectionID/create',
    addContext(ensureAuthenticated(handleCreateCollection)),
  );
  api.post(
    '/v0/collections/:collectionID/updateName',
    addContext(ensureAuthenticated(handleUpdateCollectionName)),
  );
  api.post(
    '/v0/collections/:collectionID/delete',
    addContext(ensureAuthenticated(handleDeleteCollection)),
  );
  api.get(
    '/v0/collections/:collectionID',
    addContext(ensureAuthenticated(handleGetCollection)),
  );

  api.post(
    '/v0/views/:viewID/create',
    addContext(ensureAuthenticated(handleCreateView)),
  );
  api.post(
    '/v0/views/:viewID/updateName',
    addContext(ensureAuthenticated(handleUpdateViewName)),
  );
  api.get('/v0/views/:viewID', addContext(ensureAuthenticated(handleGetView)));
  api.post(
    '/v0/views/:viewID/delete',
    addContext(ensureAuthenticated(handleDeleteView)),
  );

  api.post(
    '/v0/fields/:fieldID/create',
    addContext(ensureAuthenticated(handleCreateField)),
  );
  api.post(
    '/v0/fields/:fieldID/duplicate',
    addContext(ensureAuthenticated(handleDuplicateField)),
  );
  api.post(
    '/v0/fields/:fieldID/updateName',
    addContext(ensureAuthenticated(handleUpdateFieldName)),
  );
  api.get(
    '/v0/fields/:fieldID',
    addContext(ensureAuthenticated(handleGetField)),
  );
  api.post(
    '/v0/fields/:fieldID/delete',
    addContext(ensureAuthenticated(handleDeleteField)),
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
