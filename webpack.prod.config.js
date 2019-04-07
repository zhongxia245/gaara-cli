/**
 * 线上环境的 webpack 配置
 * 1. 清理了之前构建的静态文件
 * 2. 引入 js 前注册了 onerror 事件
 */
const merge = require('webpack-merge')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const CONFIG = require('./config')

const webpackBaseConfig = require('./webpack.base.config')

module.exports = merge(webpackBaseConfig(false), {
  mode: 'production',
  output: {
    publicPath: process.env.PUBLIC_PATH || '/',
    filename: '[name]-[contenthash].js',
    chunkFilename: '[name]-[contenthash].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      ...CONFIG.environments
    }),
    new OptimizeCssAssetsPlugin(),
    new ScriptExtHtmlWebpackPlugin({
      custom: [
        {
          test: /\.jsx?$/,
          attribute: 'crossorigin',
          value: 'anonymous'
        },
        {
          test: /\.jsx?$/,
          attribute: 'onerror',
          value: 'handleError(event)'
        }
      ]
    }),
    new CleanWebpackPlugin()
    // new AliyunPlugin({
    //   accessKeyId: process.env.ALIYUN_AK,
    //   accessKeySecret: process.env.ALIYUN_SK,
    //   bucket: process.env.ALIYUN_BUCKET,
    //   region: process.env.ALIYUN_REGION,
    //   exclude: /\.html$/
    // })
  ]
})
