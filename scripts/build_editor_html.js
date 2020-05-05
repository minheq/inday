const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const entryPath = path.join(
  __dirname,
  '../app/modules/editor/webview/script.ts',
);
const outputPath = path.join(__dirname, '../app/modules/editor/webview/temp/');
const bundleFilename = 'bundle.js';
const bundleFile = outputPath + bundleFilename;
const htmlFile = path.join(
  __dirname,
  '../app/modules/editor/webview/index.html',
);

const destinationFile = path.join(
  __dirname,
  '../app/modules/editor/webview/index.bundle.html',
);

const compiler = webpack({
  entry: entryPath,
  output: {
    path: outputPath,
    filename: bundleFilename,
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
          plugins: ['@babel/plugin-proposal-class-properties'],
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
});

compiler.run(async (err, stats) => {
  if (err) {
    console.log(err);
    return;
  }

  const script = fs.readFileSync(bundleFile, {
    encoding: 'utf-8',
  });
  const html = fs.readFileSync(htmlFile, {
    encoding: 'utf-8',
  });

  let newHTML = html.replace('__REPLACED__BY__SCRIPT__', script);

  fs.writeFileSync(destinationFile, newHTML);
});
