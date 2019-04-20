/**
 * 2019-04-07 13:29:48
 * webpack 的一些 公共配置
 */
const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackBar = require('webpackbar')
const CONFIG = require('./config')
const paths = require('./paths')

/**
 * 根据匹配规则输出指定后缀得文件
 *
 * @param {String}  pattern 匹配规则
 * @param {Boolean} hotReload 是否需要热更新
 */
const getEntries = (pattern, hotReload) => {
  let fileList = glob.sync(pattern)
  return fileList.reduce((previous, current) => {
    let filePath = path.parse(path.relative(paths.resolveApp(''), current))

    let withoutSuffix = path.join(filePath.dir, filePath.name)

    if (hotReload) {
      // 多页面，需要对每个入口添加 热更新的配置
      previous[withoutSuffix] = [
        require.resolve('react-dev-utils/webpackHotDevClient'), // 这个是 create-react-app 优化过的热更新功能
        paths.resolveApp(current)
      ]
    } else {
      previous[withoutSuffix] = paths.resolveApp(current)
    }

    return previous
  }, {})
}

// postcss 的配置
const postCssConfig = {
  ident: 'postcss',
  plugins: [
    require('postcss-import')(),
    require('postcss-preset-env')({
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
    })
  ]
}

if (CONFIG.usePx2Rem) {
  postCssConfig.plugins.push(
    require('postcss-pxtorem')({
      rootValue: CONFIG.basePixel,
      propWhiteList: []
    })
  )
}

module.exports = function(isDev) {
  const jsRegx = `${CONFIG.inputPath}/**/*.jsx`
  const htmlRegx = `${CONFIG.inputPath}/**/*.pug`
  const jsEntries = CONFIG.isLocal && getEntries(jsRegx, isDev)
  const htmlEntries = getEntries(htmlRegx)

  let htmlPlugins = []

  for (htmlEntry in htmlEntries) {
    const config = {
      filename: htmlEntry + '.html',
      template: htmlEntries[htmlEntry],
      // 注入公共模块 ,就是 splitChunks 里面的 default模块
      chunks: ['default'],
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

  // 插件配置
  let plugins = [
    ...htmlPlugins,
    new MiniCssExtractPlugin({
      filename: CONFIG.isLocal ? '[name].css' : '[name]-[contenthash].css'
    }),
    new WebpackBar()
  ]

  return {
    // 构建后，只输出构建时间信息和错误信息
    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      moduleTrace: false,
      publicPath: false,
      assets: true,
      entrypoints: false,
      warnings: false,
      performance: true
    },
    entry: {
      ...CONFIG.chunks,
      ...jsEntries
    },
    output: {
      // 静态资源文件的本机输出目录
      path: paths.resolveApp(CONFIG.outputPath),
      // 静态资源服务器发布目录
      publicPath: '/',
      // 入口文件名称配置
      filename: '[name].js',
      chunkFilename: '[name].js'
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          default: {
            test: /(react|react-dom)/,
            name: `${CONFIG.inputPath}/chunks/vendor`,
            chunks: 'all',
            priority: 10
          },
          vendors: false
        }
      }
    },
    resolve: {
      extensions: ['.js', '.jsx', 'json'],
      alias: CONFIG.alias
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          use: 'pug-loader'
        },
        {
          test: /\.json$/,
          use: 'json-loader'
        },
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                plugins: [
                  [
                    '@babel/plugin-transform-runtime',
                    {
                      absoluteRuntime: false,
                      corejs: false,
                      helpers: true,
                      regenerator: true,
                      useESModules: false
                    }
                  ],
                  require.resolve('@babel/plugin-transform-react-jsx'),
                  require.resolve('@babel/plugin-syntax-dynamic-import'),
                  require.resolve('@babel/plugin-proposal-class-properties'),
                  require.resolve('styled-jsx/babel'),
                  ['import', { libraryName: 'antd-mobile', style: 'css' }]
                ],
                presets: [require.resolve('@babel/preset-env'), require.resolve('@babel/preset-react')]
              }
            }
          ],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: postCssConfig
            }
          ]
        },
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: postCssConfig
            },
            {
              loader: 'less-loader',
              options: CONFIG.lessOption
            }
          ]
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
}
