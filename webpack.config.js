const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/index.js', // 入口文件
  output: {
    filename: 'index.js', // 输出文件名
    path: path.resolve(__dirname, 'dist') // 输出路径
  },
  module: {
    // rules: [
    //   {
    //     test: /\.njk$/,
    //     use: 'nunjucks-loader'
    //   }
    // ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    // new BundleAnalyzerPlugin()
  ],
  devServer: {
    port: 9000,
    compress: false,
    hot: true,
    static: {
      directory: path.join(__dirname, 'public')
    }
    // devMiddleware: {
    //   index: true,
    //   mimeTypes: { phtml: 'text/html' },
    //   publicPath: '/publicPathForDevServe',
    //   serverSideRender: true,
    //   writeToDisk: true
    // }
  }
};