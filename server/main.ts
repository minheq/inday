import { env } from './env';
import { createAPI } from './api';

async function main() {
  const api = createAPI();

  api.listen(env.port, () =>
    console.log(`Server listening at http://localhost:${env.port}`),
  );
}

main();
