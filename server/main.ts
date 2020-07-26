import { env } from './env';
import { createApp } from './app';

async function main() {
  const app = createApp();

  app.listen(env.port, () =>
    console.log(`Server listening at http://localhost:${env.port}`),
  );
}

main();
