const path = require('path');
const BASE_JS = './src/client/js/';

module.exports = {
  entry: {
    main: BASE_JS + 'main.js',
  },
  mode: 'development',
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'assets'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
    ],
  },
};
