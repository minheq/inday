import { Router } from 'express';
import { handleCreateWorkspace } from './handlers';

export function routesV0() {
  const router = Router();

  router.post('/workspace', handleCreateWorkspace);

  return router;
}
