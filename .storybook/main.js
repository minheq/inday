module.exports = {
  stories: ['../stories/**/*.stories.(ts|tsx)'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: async (config) => {
    // do mutation to the config

    config.module.rules.push(
      ...[
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
    );

    config.resolve.extensions.push(
      ...['.web.tsx', '.web.ts', '.tsx', '.ts', '.jsx', '.js', '.json'],
    );

    config.resolve.alias = {
      'react-native$': 'react-native-web',
    };

    return config;
  },
};
