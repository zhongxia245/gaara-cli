const minimist = require('minimist')
const webpack = require('webpack')
const chalk = require('chalk')
const webpackConfig = require('../webpack.prod.config')

const { yellow, red } = chalk

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
})
