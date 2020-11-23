const fs = require('fs');
const path = require('path');
const { build } = require('esbuild');
const { fork } = require('child_process');
const { options } = require('./server_config');

build({ ...options, incremental: true })
  .then((result) => {
    let server = startServer();

    fs.watch(path.resolve(__dirname, '../server'), { recursive: true }, () => {
      result.rebuild().then(() => {
        server.kill();
        server = startServer();
      });
    });
  })
  .catch((error) => {
    console.error(`Failed to build: ${error.message}`);
    process.exit(1);
  });

function startServer() {
  const server = fork(path.resolve(__dirname, '../server.js'));

  server.on('error', (err) => {
    throw err;
  });

  process.on('exit', () => {
    server.kill();
  });

  return server;
}
