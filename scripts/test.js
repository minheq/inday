const util = require('util');
const child_process = require('child_process');
const os = require('os');
const glob = util.promisify(require('glob'));
const Parser = require('tap-parser');
const { mapConcurrent } = require('./utils');

const numCPUs = os.cpus().length;
const testFile = process.argv[2];

async function main() {
  const testFiles = await glob('test/**/*.test.js');

  console.time('measure');
  const results = await mapConcurrent(testFiles, test, {
    concurrency: numCPUs,
  });
  console.log(results, 'results');
  console.timeEnd('measure');
}

function test(file) {
  return new Promise((resolve, reject) => {
    const p = new Parser((results) => {
      if (results.ok) {
        resolve(file + 'passed');
      } else {
        reject(file + 'failed');
      }
    });

    const child = child_process.fork(file, { stdio: 'pipe' });

    child.stdout.pipe(p);
  });
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
