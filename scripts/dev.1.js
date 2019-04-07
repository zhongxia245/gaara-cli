/**
 * browserSync 目前无法实现热更新,因此先放弃
 */
const minimist = require('minimist')
const webpack = require('webpack')
const devMiddleWare = require('webpack-dev-middleware')
const hotMiddleWare = require('webpack-hot-middleware')
const browserSync = require('browser-sync')

const webpackConfig = require('../webpack.dev.config')

console.log(webpackConfig.entry)

// 获取命令行参数
const argv = minimist(process.argv.slice(2))

// 编译器对象
const compiler = webpack(webpackConfig)

browserSync.init({
  server: {
    baseDir: webpackConfig.output.path // 静态服务器基路径，可以访问项目所有文件
  },
  startPath: '/index.html', // 开启服务器窗口时的默认地址
  middleware: [
    devMiddleWare(compiler, {
      publicPath: webpackConfig.output.publicPath,
      stats: 'errors-only'
    }),
    hotMiddleWare(compiler)
  ]
})
