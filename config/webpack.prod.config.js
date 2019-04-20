/**
 * 线上环境的 webpack 配置
 * 再环境变量配置 CDN 的参数，然后把静态资源添加到 CDN 上
 */
const merge = require('webpack-merge')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const AliyunPlugin = require('./cdn/webpack.aliyun')
const QiniuPlugin = require('./cdn/webpack.qiniu')
const CONFIG = require('./config')

const getWebpackBaseConfig = require('./webpack.base.config')

module.exports = needUploadCdn => {
  let publicPath = '/'

  if (needUploadCdn) {
    publicPath = process.env.PUBLIC_PATH

    // 是否配置了阿里云 CDN 的参数
    const isUploadAliyun =
      process.env.ALIYUN_AK && process.env.ALIYUN_SK && process.env.ALIYUN_BUCKET && process.env.ALIYUN_REGION
    // 是否配置了 七牛 CDN 的参数
    const isUploadQiniu = process.env.QINIU_AK && process.env.QINIU_SK && process.env.QINIU_BUCKET

    if (isUploadAliyun) {
      webpackProdConfig.plugins.push(
        new AliyunPlugin({
          accessKeyId: process.env.ALIYUN_AK,
          accessKeySecret: process.env.ALIYUN_SK,
          bucket: process.env.ALIYUN_BUCKET,
          region: process.env.ALIYUN_REGION,
          exclude: /\.html$/
        })
      )
    }

    if (isUploadQiniu) {
      webpackProdConfig.plugins.push(
        new QiniuPlugin({
          accessKey: process.env.QINIU_AK,
          secretKey: process.env.QINIU_SK,
          bucket: process.env.QINIU_BUCKET,
          path: '',
          exclude: /\.html$/
        })
      )
    }
  }

  let webpackProdConfig = {
    mode: 'production',
    output: {
      publicPath: publicPath,
      filename: '[name]-[contenthash].js',
      chunkFilename: '[name]-[contenthash].js'
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
        ...CONFIG.environments
      }),
      new OptimizeCssAssetsPlugin()
    ]
  }

  return merge(getWebpackBaseConfig(false), webpackProdConfig)
}
