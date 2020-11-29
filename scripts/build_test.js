const { build } = require('esbuild');
const glob = require('./glob');

(async function () {
  let libEntryPoints = await glob('lib/**/*.test.ts');
  let appEntryPoints = await glob('app/**/*.test.ts');
  let apiEntryPoints = await glob('api/**/*.test.ts');

  const entryPoints = libEntryPoints
    .concat(appEntryPoints)
    .concat(apiEntryPoints);

  const options = {
    entryPoints,
    bundle: true,
    outdir: 'test',
    sourcemap: true,
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
    platform: 'node',
    target: ['node12.19.0'],
    define: {
      ['process.env.NODE_ENV']: `"production"`,
      ['global']: 'window',
    },
  };

  await build(options);
})();
