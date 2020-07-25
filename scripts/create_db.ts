import { Client } from 'pg';
import { env } from '../server/env';

export const dbClient = new Client({
  user: env.database.username,
  host: env.database.host,
  port: env.database.port,
  password: env.database.password,
  database: env.database.name,
});

async function main() {
  return dbClient.query(`CREATE DATABASE ${env.database.name};`);
}

main()
  .then((result) => {
    console.log(result);
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
