const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(require.main.filename, '/dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                modules: 'commonjs' // 将ES6模块转换为CommonJS模块
              }]
            ]
          }
        }
      }
    ]
  },
  externals: [nodeExternals()],
  optimization: {
    minimize: false,
    minimizer: [],
  },
};