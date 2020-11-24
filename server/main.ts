import { env } from './env';
import { createAPI } from './api';

const api = createAPI();

api.listen(env.port, () =>
  console.log(`Server listening at http://localhost:${env.port}`),
);
