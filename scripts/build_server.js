const { build } = require('esbuild');
const { options } = require('./server_config');

build(options).catch((error) => {
  console.error(`Failed to build: ${error.message}`);
  process.exit(1);
});
