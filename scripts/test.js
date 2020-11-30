const util = require('util');
const child_process = require('child_process');
const os = require('os');
const glob = util.promisify(require('glob'));
const Parser = require('tap-parser');
const { mapConcurrent } = require('./utils');

const numCPUs = os.cpus().length;

async function main() {
  const start = new Date();
  const testFiles = await glob('test/**/*.test.js');
  const results = await mapConcurrent(testFiles, test, {
    concurrency: numCPUs,
  });

  let failed = false;

  for (const result of results) {
    if (result.ok) {
      console.log(
        '\x1b[42m\x1b[30m',
        'PASS',
        '\x1b[0m',
        result.file,
        `\x1b[2m${result.count}`,
        `\x1b[0m\x1b[33m${result.time}ms`,
      );
    } else {
      failed = true;
      console.log(
        '\x1b[41m\x1b[30m',
        'FAIL',
        '\x1b[0m',
        result.file,
        `\x1b[31m${result.fail} failed`,
        `\x1b[0m\x1b[2mof ${result.count}`,
        `\x1b[0m\x1b[33m${result.time}ms`,
      );

      for (const failure of result.failures) {
        console.log(`\x1b[0m\x1b[31m${failure.id} ${failure.name}`);
        console.log(
          `\x1b[0mexpected\n${JSON.stringify(
            failure.diag.expected,
            null,
            2,
          )}\n`,
        );
        console.log(`got\n${JSON.stringify(failure.diag.actual, null, 2)}`);
        console.log('\n');
        console.log('\n');
      }
    }
  }

  const end = new Date() - start;

  console.log(`\x1b[0mDone in \x1b[33m${end}ms`);
  if (failed) {
    throw new Error('');
  }
}

function test(file) {
  return new Promise((resolve) => {
    const start = new Date();

    const p = new Parser((results) => {
      const end = new Date() - start;
      resolve({
        ...results,
        file,
        time: end,
      });
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
