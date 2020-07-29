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
  return postgrator.migrate('0000');
}

runScript()
  .then((result) => {
    console.log(`Successfully applied ${result.length} downward migrations.`);
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
