const util = require("util");
const { build } = require("esbuild");
const glob = util.promisify(require("glob"));

(async function main() {
  const file = process.argv[2];
  let entryPoints = [];
  let outdir = "test";

  if (file !== undefined && file.endsWith("test.ts")) {
    // Single test file location
    const relativeFileDirName = file.substr(0, file.lastIndexOf("/"));
    outdir = `test/${relativeFileDirName}`;
    entryPoints.push(file);
  } else {
    // All test file locations
    let libEntryPoints = await glob("lib/**/*.test.ts");
    let appEntryPoints = await glob("app/**/*.test.ts");
    let apiEntryPoints = await glob("api/**/*.test.ts");

    entryPoints = libEntryPoints.concat(appEntryPoints).concat(apiEntryPoints);
  }

  const options = {
    entryPoints,
    bundle: true,
    outdir,
    sourcemap: true,
    resolveExtensions: [
      ".web.tsx",
      ".web.ts",
      ".tsx",
      ".ts",
      ".web.jsx",
      ".web.js",
      ".jsx",
      ".js",
      ".json",
    ],
    platform: "node",
    target: ["node12.19.0"],
    define: {
      ["process.env.NODE_ENV"]: `"production"`,
      ["global"]: "window",
    },
  };

  console.time("build time");
  await build(options);
  console.timeEnd("build time");
})();
