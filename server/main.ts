import express from 'express';
import bodyParser from 'body-parser';

import { connectDatabase } from './db';
import { handleCreateWorkspace } from './handlers';
import { env } from './env';

async function main() {
  const app = express();

  await connectDatabase();

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
    next();
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const routerV0 = express.Router();

  routerV0.post('/workspace', handleCreateWorkspace);

  app.use('/v0', routerV0);

  app.listen(env.port, () =>
    console.log(`Server listening at http://localhost:${env.port}`),
  );
}

main();
