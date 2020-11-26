const { build } = require('esbuild');

const nodeEnv = process.env.NODE_ENV || 'development';

const options = {
  entryPoints: ['server.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'server.js',
  sourcemap: true,
  define: {
    ['process.env.NODE_ENV']: `"${nodeEnv}"`,
  },
  external: ['pg-native'],
};

build(options).catch((error) => {
  console.error(`Failed to build: ${error.message}`);
  process.exit(1);
});
