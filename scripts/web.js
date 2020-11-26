const http = require('http');
const fs = require('fs');
const path = require('path');
const { serve } = require('esbuild');

const options = {
  entryPoints: ['index.web.tsx'],
  bundle: true,
  outdir: 'public',
  resolveExtensions: [
    '.web.tsx',
    '.web.ts',
    '.tsx',
    '.ts',
    '.web.jsx',
    '.web.js',
    '.jsx',
    '.js',
    '.json',
  ],
  sourcemap: true,
  define: {
    ['process.env.NODE_ENV']: `"development"`,
    ['global']: 'window',
  },
};

const BUILD_PORT = 8000;
const WEB_PORT = 8080;

fs.readFile(path.resolve(__dirname, '../index.html'), (err, contents) => {
  if (err !== null) {
    process.exit(1);
  }

  const html = contents
    .toString()
    .replace('/public', `http://localhost:${BUILD_PORT}`);

  serve({ port: BUILD_PORT }, options)
    .then(() => {
      const server = http.createServer((_req, res) => {
        res.writeHead(200);
        res.end(html);
      });

      server.listen(WEB_PORT, 'localhost', () => {
        console.log(`Web is running on http://localhost:${WEB_PORT}`);
      });
    })
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
});
