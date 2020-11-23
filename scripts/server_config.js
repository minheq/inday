const nodeEnv = process.env.NODE_ENV || 'development';

const options = {
  entryPoints: ['server/main.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'server.js',
  minify: nodeEnv === 'production',
  sourcemap: true,
  define: {
    ['process.env.NODE_ENV']: `"${nodeEnv}"`,
  },
  external: ['pg-native'],
};

module.exports.options = options;
