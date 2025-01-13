export default {
  input: 'src/index.js', // 入口文件
  output: {
    file: 'dist/index.js', // 导出文件路径
    format: 'esm', // 导出格式，可以是'iife'、'amd'、'cjs'、'esm'等
  }
};