const { build } = require('esbuild');

const nodeEnv = process.env.NODE_ENV || 'development';

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
  minify: nodeEnv === 'production',
  sourcemap: true,
  target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  define: {
    ['process.env.NODE_ENV']: `"${nodeEnv}"`,
    ['global']: 'window',
  },
};

console.time('build time');
build(options)
  .then(() => {
    console.timeEnd('build time');
    process.exit(0);
  })
  .catch((error) => {
    console.error(`Failed to build: ${error.message}`);
    process.exit(1);
  });
