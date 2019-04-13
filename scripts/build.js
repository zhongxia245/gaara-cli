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

  console.log(
    stats.toString({
      chunks: false, // 使构建过程更静默无输出
      colors: true // 在控制台展示颜色
    })
  )
})
