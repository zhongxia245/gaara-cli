const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackConfig = require('../config/webpack.dev.config')

const compiler = webpack(webpackConfig)
const devServer = new WebpackDevServer(compiler, webpackConfig.devServer)

try {
  devServer.listen(webpackConfig.devServer.port, webpackConfig.devServer.host, err => {
    if (err) {
      return console.log(err)
    }
    console.log(
      chalk.cyan(
        `Starting the development server...\n address: http://${webpackConfig.devServer.host}:${
          webpackConfig.devServer.port
        }`
      )
    )
  })
} catch (error) {
  devServer.close()
  process.exit()
}
