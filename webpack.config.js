const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // 入口文件
  output: {
    filename: 'bundle.js', // 输出文件名
    path: path.resolve(__dirname, 'dist') // 输出路径
  },
  module: {
    rules: [
      {
        test: /\.njk$/,
        use: 'nunjucks-loader'
      }
    ]
  },
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     template: './public/index.html',
  //     filename: './index.html'
  //   })
  // ],
  devServer: {
    hot: true,
    devMiddleware: {
      index: true,
      mimeTypes: { phtml: 'text/html' },
      publicPath: '/publicPathForDevServe',
      serverSideRender: true,
      // writeToDisk: true
    }
  }
};