/**
 * 注意，如果把静态资源上传到CDN，则这里需要过滤掉上传到 CDN 的操作
 */
const webpack = require('webpack')
const { yellow, red } = require('chalk')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const webpackConfig = require('../config/webpack.prod.config')

webpackConfig.plugins.push(new BundleAnalyzerPlugin())

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
