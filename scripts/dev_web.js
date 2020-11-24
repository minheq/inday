const http = require('http');
const fs = require('fs');
const path = require('path');
const { serve } = require('esbuild');
const { options } = require('./web_config');

const BUILD_SERVER_PORT = 8000;
const STATIC_SERVER_PORT = 8080;

let html = '';

const server = http.createServer((_req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200);
  res.end(html);
});

fs.readFile(path.resolve(__dirname, '../index.html'), (err, contents) => {
  if (err !== null) {
    console.error(`Could not read index.html file: ${err.message}`);
    process.exit(1);
  }

  html = contents
    .toString()
    .replace('/public', `http://localhost:${BUILD_SERVER_PORT}`);

  startStaticServer();
  startBuildServer();
});

function startStaticServer() {
  server.listen(STATIC_SERVER_PORT, 'localhost', () => {
    console.log(
      `Static server is running on http://localhost:${STATIC_SERVER_PORT}`,
    );
  });
}

function startBuildServer() {
  serve({ port: BUILD_SERVER_PORT }, options)
    .then(() => {
      console.log(
        `Build server is running on http://localhost:${BUILD_SERVER_PORT}`,
      );
    })
    .catch(() => process.exit(1));
}
