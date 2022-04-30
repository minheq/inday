const util = require("util");
const child_process = require("child_process");
const os = require("os");
const glob = util.promisify(require("glob"));
const { mapConcurrent } = require("./utils");

const numCPUs = os.cpus().length;

async function main() {
  const start = new Date();
  const testFiles = await glob("test/**/*.test.js");
  const results = await mapConcurrent(testFiles, test, {
    concurrency: numCPUs,
  });

  let failed = false;

  for (const result of results) {
    if (result.ok) {
      console.log(
        "\x1b[42m\x1b[30m",
        "PASS",
        "\x1b[0m",
        result.file,
        `\x1b[0m\x1b[33m${result.time}ms`
      );
    } else {
      failed = true;
      console.log(
        "\x1b[41m\x1b[30m",
        "FAIL",
        "\x1b[0m",
        result.file,
        `\x1b[0m\x1b[33m${result.time}ms`
      );
    }
  }

  const end = new Date() - start;

  console.log(`\x1b[0mDone in \x1b[33m${end}ms`);
  if (failed) {
    throw new Error("");
  }
}

function test(file) {
  return new Promise((resolve) => {
    const start = new Date();

    const child = child_process.fork(file);

    child.on("close", (code) => {
      const end = new Date() - start;

      resolve({
        ok: code === 0,
        file,
        time: end,
      });
    });
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
