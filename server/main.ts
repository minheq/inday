import express from 'express';
import bodyParser from 'body-parser';

import { connectDatabase } from './db';

import { env } from './env';
import { cors } from './middlewares';
import { routesV0 } from './routes';

export async function runServer() {
  const app = express();

  await connectDatabase();

  app.use(cors());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/v0', routesV0());

  const server = app.listen(env.port, () =>
    console.log(`Server listening at http://localhost:${env.port}`),
  );

  return server;
}
