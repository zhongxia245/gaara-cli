/**
 * 启动 webdevserver
 * 1. 端口占用则换一个端口
 * 2. 自动打开浏览器
 */
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const { cyan, red } = require('chalk')
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils')
const openBrowser = require('react-dev-utils/openBrowser')
const webpackConfig = require('../config/webpack.dev.config')

let HOST = webpackConfig.devServer.host
let currentPort = webpackConfig.devServer.port

choosePort(HOST, currentPort).then(port => {
  if (port == null) {
    return
  }
  currentPort = port
  webpackConfig.devServer.port = port

  const compiler = webpack(webpackConfig)
  const devServer = new WebpackDevServer(compiler, webpackConfig.devServer)

  try {
    devServer.listen(currentPort, HOST, err => {
      if (err) {
        return console.log(err)
      }
      openBrowser(`http://${HOST}:${currentPort}`)
      console.log(cyan(`Starting the development server...\n address: http://${HOST}:${currentPort}`))
    })
  } catch (error) {
    console.log(red(error))
    devServer.close()
    process.exit()
  }
})
