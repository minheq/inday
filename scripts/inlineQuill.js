const fs = require('fs');
const path = require('path');

async function run() {
  const filePath = path.resolve(
    __dirname,
    '../node_modules/quill/dist/quill.core.css',
  );

  const js = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  });
  const json = 'module.exports = ' + JSON.stringify(js) + ';';

  const destinationPath = path.resolve(
    __dirname,
    '../app/modules/editor/quill.css.js',
  );

  fs.writeFileSync(destinationPath, json);
}

run();
