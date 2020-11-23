const { build } = require('esbuild');

const nodeEnv = process.env.NODE_ENV || 'development';

const options = {
  entryPoints: ['index.web.ts'],
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
  minify: nodeEnv === 'production',
  sourcemap: true,
  define: {
    ['process.env.NODE_ENV']: `"${nodeEnv}"`,
    ['global']: 'window',
  },
  loader: { '.png': 'file' },
};

build(options).catch((error) => {
  console.error(`Failed to build: ${error.message}`);
  process.exit(1);
});

module.exports.options = options;
