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
  metafile: 'meta.json',
  target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  define: {
    ['process.env.NODE_ENV']: `"${nodeEnv}"`,
    ['global']: 'window',
  },
  loader: { '.png': 'file' },
};

module.exports.options = options;
