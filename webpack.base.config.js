const os = require('os')
const path = require('path')
const webpack = require('webpack')
const glob = require('glob')
const HappyPack = require('happypack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackBar = require('webpackbar')

const CONFIG = require('./config')

// 根据匹配规则输出正确的文件路径
const getEntries = (pattern, hotReload) => {
  var fileList = glob.sync(pattern)
  return fileList.reduce((previous, current) => {
    var filePath = path.parse(path.relative(path.resolve(__dirname, './template/src'), current))
    var withoutSuffix = path.join(filePath.dir, filePath.name)
    // previous[withoutSuffix] = path.resolve(__dirname, current)
    if (hotReload) {
      // 多页面，需要对每个入口添加 热更新的配置
      previous[withoutSuffix] = [
        path.resolve(__dirname, current),
        require.resolve('react-dev-utils/webpackHotDevClient')
      ]
    } else {
      previous[withoutSuffix] = path.resolve(__dirname, current)
    }

    return previous
  }, {})
}

const jsRegx = `template/src/${CONFIG.inputPath}/**/*.jsx`
const htmlRegx = `template/src/${CONFIG.inputPath}/**/*.pug`
const jsEntries = CONFIG.isLocal && CONFIG.useOnly ? CONFIG.only : getEntries(jsRegx, true)
const htmlEntries = getEntries(htmlRegx)

let htmlPlugins = []
for (htmlEntry in htmlEntries) {
  const config = {
    filename: htmlEntry + '.html',
    template: htmlEntries[htmlEntry],
    chunks: [],
    inject: true,
    hash: CONFIG.isLocal,
    cache: true,
    chunksSortMode: 'manual',
    minify: {
      removeComments: true,
      collapseWhitespace: false
    }
  }
  // 注入公共库
  for (key in CONFIG.chunks) {
    config.chunks.push(key)
  }
  // 遍历判断注入
  for (jsEntry in jsEntries) {
    if (CONFIG.injectCheck(htmlEntry, jsEntry)) {
      config.chunks.push(jsEntry)
    }
  }
  htmlPlugins.push(new HtmlWebpackPlugin(config))
}

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

// 插件配置
let plugins = [
  new HappyPack({
    id: 'pug',
    threadPool: happyThreadPool,
    loaders: ['pug-loader']
  }),
  new HappyPack({
    id: 'json',
    threadPool: happyThreadPool,
    loaders: ['json-loader']
  }),
  new HappyPack({
    id: 'jsx',
    threadPool: happyThreadPool,
    loaders: ['babel-loader?cacheDirectory']
  }),
  new HappyPack({
    id: 'css',
    threadPool: happyThreadPool,
    loaders: ['css-loader', 'postcss-loader']
  }),
  new HappyPack({
    id: 'less',
    threadPool: happyThreadPool,
    loaders: [
      'css-loader',
      'postcss-loader',
      {
        loader: 'less-loader',
        options: CONFIG.lessOption
      }
    ]
  }),
  ...htmlPlugins,
  new MiniCssExtractPlugin({
    filename: CONFIG.isLocal ? '[name].css' : '[name]-[contenthash].css'
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      ...CONFIG.environments
    }
  }),
  new WebpackBar()
]

module.exports = {
  entry: {
    ...CONFIG.chunks,
    ...jsEntries
  },
  output: {
    // 静态资源文件的本机输出目录
    path: path.resolve(__dirname, CONFIG.outputPath),
    // 静态资源服务器发布目录
    publicPath: '/',
    // 入口文件名称配置
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       default: {
  //         test: /(react|react-dom)/,
  //         name: `${CONFIG.inputPath}/chunks/vendor`,
  //         chunks: 'all'
  //       },
  //       vendors: false
  //     }
  //   }
  // },
  resolve: {
    extensions: ['.js', '.jsx', 'json'],
    alias: CONFIG.alias
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: 'happypack/loader?id=pug'
      },
      {
        test: /\.json$/,
        use: 'happypack/loader?id=json'
      },
      {
        test: /\.jsx?$/,
        use: 'happypack/loader?id=jsx',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'happypack/loader?id=css']
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'happypack/loader?id=less']
      },
      {
        test: /\.(jpg|png|gif|svg|ico)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024 * 8,
              outputPath: `${CONFIG.inputPath}/assets/images`,
              name: '[name]-[hash].[ext]',
              fallback: 'file-loader'
            }
          }
        ]
      },
      {
        test: /.(eot|woff|woff2|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: `${CONFIG.inputPath}/assets/fonts`,
              name: '[name]-[hash].[ext]'
            }
          }
        ]
      },
      {
        test: /.(doc|docx|ppt|pptx|xls|xlsx|pdf|txt|zip|mp3|mp4)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: `${CONFIG.inputPath}/assets/files`,
              name: '[name]-[hash].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: plugins
}
