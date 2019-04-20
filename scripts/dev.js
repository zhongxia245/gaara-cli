/**
 * 启动 webdevserver
 * 1. 端口占用则换一个端口
 * 2. 自动打开浏览器
 */
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const { green, red } = require('chalk')
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils')
const openBrowser = require('react-dev-utils/openBrowser')
const getWebpackDevConfig = require('../config/webpack.dev.config')

// 指定运行某个模块
let inputPath = process.argv.slice(2)[0]
const webpackConfig = getWebpackDevConfig(inputPath)

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
      console.log(green(`Starting the development server...\naddress: http://${HOST}:${currentPort}`))
    })
  } catch (error) {
    console.log(red(error))
    devServer.close()
    process.exit()
  }
})
