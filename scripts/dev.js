const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const webpackConfig = require('../webpack.dev.config')

// webpackConfig.entry.main = ['webpack-dev-server/client?http://0.0.0.0:3000/']

const compiler = webpack(webpackConfig)
const devServer = new WebpackDevServer(compiler, webpackConfig.devServer)

try {
  devServer.listen(webpackConfig.devServer.port, webpackConfig.devServer.host, err => {
    if (err) {
      return console.log(err)
    }
    console.log(chalk.cyan('Starting the development server...\n'))
  })
} catch (error) {
  devServer.close()
  process.exit()
}
