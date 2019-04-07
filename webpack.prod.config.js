const merge = require('webpack-merge')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const webpackBaseConfig = require('./webpack.base.config')

module.exports = merge(webpackBaseConfig, {
  mode: 'production',
  output: {
    publicPath: process.env.PUBLIC_PATH,
    filename: '[name]-[contenthash].js',
    chunkFilename: '[name]-[contenthash].js'
  },
  plugins: [
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
    })
    // new AliyunPlugin({
    //   accessKeyId: process.env.ALIYUN_AK,
    //   accessKeySecret: process.env.ALIYUN_SK,
    //   bucket: process.env.ALIYUN_BUCKET,
    //   region: process.env.ALIYUN_REGION,
    //   exclude: /\.html$/
    // })
  ]
})
