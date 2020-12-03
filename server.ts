import { env } from './api/env';
import { createAPI } from './api/api';

const api = createAPI();

api.listen(env.port, () =>
  console.log(`Server listening at http://localhost:${env.port}`),
);
