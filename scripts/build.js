const webpack = require('webpack')
const { yellow, red } = require('chalk')
const webpackConfig = require('../config/webpack.prod.config')

webpack(webpackConfig, (err, stats) => {
  if (err) {
    console.error(red(err.stack || err))
    if (err.details) {
      console.error(red(err.details))
    }
    process.exit(1)
  }

  const info = stats.toJson()

  if (stats.hasErrors()) {
    info.errors.forEach(error => {
      console.error(red(error))
    })
    process.exit(1)
  }

  if (stats.hasWarnings()) {
    info.warnings.forEach(warning => {
      console.warn(yellow(warning))
    })
  }

  // 输出构建信息， 只输出构建时间和模块包
  console.log(
    stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      moduleTrace: false,
      publicPath: false,
      assets: true,
      entrypoints: false,
      warnings: false,
      performance: true
    })
  )
})
