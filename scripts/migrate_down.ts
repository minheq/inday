import Postgrator from 'postgrator';
import path from 'path';
import { env } from '../server/env';

const postgrator = new Postgrator({
  migrationDirectory: path.resolve(__dirname, '../migrations'),
  driver: 'pg',
  host: env.database.host,
  port: env.database.port,
  database: env.database.name,
  username: env.database.username,
  password: env.database.password,
  schemaTable: 'migrations',
});

async function runScript() {
  const version = await postgrator.getDatabaseVersion();
  return postgrator.migrate(`${version - 1}`);
}

runScript()
  .then((result) => {
    console.log(result);
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
