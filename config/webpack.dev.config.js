/**
 * 开发环境的webpack 配置
 * 1. 增加了热刷新
 * 2. 设置 devServer 代理
 */
const webpack = require('webpack')
const merge = require('webpack-merge')

const getWebpackBaseConfig = require('./webpack.base.config')
const CONFIG = require('./config')
const paths = require('./paths')

module.exports = inputPath => {
  return merge(getWebpackBaseConfig(true, inputPath), {
    mode: 'development',
    devtool: '#cheap-module-eval-source-map',
    output: {
      publicPath: '/',
      filename: '[name].js',
      chunkFilename: '[name].js'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
        ...CONFIG.environments
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
      contentBase: paths.resolveApp(CONFIG.outputPath),
      port: CONFIG.port,
      host: '0.0.0.0',
      watchContentBase: true,
      hot: true,
      inline: true,
      publicPath: '/',
      stats: 'errors-only',
      compress: true,
      proxy: CONFIG.proxy,
      historyApiFallback: { disableDotRule: true },
      disableHostCheck: false
    }
  })
}
