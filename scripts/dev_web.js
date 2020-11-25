const http = require('http');
const fs = require('fs');
const path = require('path');
const { serve } = require('esbuild');
const { options } = require('./web_config');

const BUILD_SERVER_PORT = 8000;
const STATIC_SERVER_PORT = 8080;

let html = '';

fs.readFile(path.resolve(__dirname, '../index.html'), (err, contents) => {
  if (err !== null) {
    process.exit(1);
  }

  html = contents.toString();
  html = html.replace('/public', `http://localhost:${BUILD_SERVER_PORT}`);
  html = html.replace(
    '<div id="dev"></div>',
    `<script>fetch('http://localhost:${STATIC_SERVER_PORT}/check').then(() => window.location.reload())</script>`,
  );

  serve({ port: BUILD_SERVER_PORT }, options)
    .then(() => {
      console.log(
        `Build server is running on http://localhost:${BUILD_SERVER_PORT}`,
      );

      const server = http.createServer((req, res) => {
        if (req.method === 'GET' && req.url === '/check') {
          const watcher = fs.watch(
            path.resolve(__dirname, '../app'),
            { recursive: true },
            () => {
              watcher.close();
              res.writeHead(200);
              res.end();
            },
          );
          return;
        }

        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(html);
      });

      server.listen(STATIC_SERVER_PORT, 'localhost', () => {
        console.log(
          `Static server is running on http://localhost:${STATIC_SERVER_PORT}`,
        );
      });
    })
    .catch(() => process.exit(1));
});
