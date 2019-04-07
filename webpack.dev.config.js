const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

const webpackBaseConfig = require('./webpack.base.config')
const CONFIG = require('./config')

module.exports = merge(webpackBaseConfig, {
  stats: 'errors-only',
  mode: 'development',
  devtool: '#cheap-module-eval-source-map',
  output: {
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  plugins: [new webpack.optimize.OccurrenceOrderPlugin(), new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: path.resolve(__dirname, CONFIG.outputPath),
    port: CONFIG.port,
    host: '0.0.0.0',
    watchContentBase: true,
    hot: true,
    inline: true,
    publicPath: '/',
    quiet: true,
    compress: true,
    proxy: CONFIG.proxy,
    historyApiFallback: { disableDotRule: true },
    disableHostCheck: false
  }
})
