/**
 * 2019-04-07 13:29:48
 * webpack 的一些 公共配置
 * 需要重新组织一下代码
 * 部分优化，参考：http://louiszhai.github.io/2019/01/04/webpack4/
 */
const path = require("path");
const glob = require("glob");
const os = require("os");
const HappyPack = require("happypack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");
const WebpackBar = require("webpackbar");
const deasyncPromise = require("deasync-promise");
// 用户与命令行交互的工具
const inquirer = require("inquirer");

const CONFIG = require("./config");
const paths = require("./paths");

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
inquirer.registerPrompt(
  "checkbox-plus",
  require("inquirer-checkbox-plus-prompt")
);

/**
 * 根据匹配规则输出指定后缀得文件
 * @param {String}  pattern 匹配规则
 * @param {Boolean} hotReload 是否需要热更新
 */
const getEntries = (pattern, hotReload) => {
  let fileList = glob.sync(pattern);
  return fileList.reduce((previous, current) => {
    let filePath = path.parse(path.relative(paths.resolveApp(""), current));

    let withoutSuffix = path.join(filePath.dir, filePath.name);

    if (hotReload) {
      // 多页面，需要对每个入口添加 热更新的配置
      previous[withoutSuffix] = [
        require.resolve("react-dev-utils/webpackHotDevClient"), // 这个是 create-react-app 优化过的热更新功能
        paths.resolveApp(current)
      ];
    } else {
      previous[withoutSuffix] = paths.resolveApp(current);
    }

    return previous;
  }, {});
};

/**
 * 获取 postcss 的配置
 * 可以配置是否使用 rem
 *
 * QUESTION: postcssConfig 写在 webpack 的方式，不支持 happyPack
 * TypeError: Cannot read property 'postcss' of null
 * 还没有找到解决办法，因此css/less 不使用 happypack
 */
const getPostcssConfig = () => {
  let plugins = [
    require("postcss-import")(),
    require("postcss-preset-env")({
      browsers: [
        "last 2 versions",
        "Firefox ESR",
        "> 1%",
        "ie >= 8",
        "iOS >= 8",
        "Android >= 4"
      ]
    }),
    require("cssnano")()
  ];
  if (CONFIG.usePx2Rem) {
    plugins.push(
      require("postcss-pxtorem")({
        rootValue: CONFIG.basePixel,
        propWhiteList: []
      })
    );
  }
  return {
    ident: "postcss",
    plugins: plugins
  };
};

/**
 * @param {boolean} isDev 是否为测试环境，测试环境由热刷新
 * @param {string} isSelectPage 是否选择指定入口页
 */
module.exports = (isDev, isSelectPage) => {
  // 指定某个路径的话，则只构建某个目录下的页面
  const jsRegx = `${CONFIG.inputPath}/**/*.jsx`;
  const htmlRegx = `${CONFIG.inputPath}/**/*.pug`;

  let jsEntrys = CONFIG.isLocal && getEntries(jsRegx, isDev);
  let htmlEntrys = getEntries(htmlRegx);

  // 本地开发，只启动部分页面
  if (isSelectPage) {
    // 在选择部分页面的时候，Ctrl+C 关闭控制台，node 进程不会被关闭
    // 选择完页面后，再 Ctrl+C 退出，则不会有问题
    console.warn(
      `[注意，注意，注意] 如需 Ctrl+C 退出，请先选择完入口在退出，否则会造成 Node 进程无法自动关闭，占用内存!!`
    );
    console.log();

    const htmlKeys = Object.keys(htmlEntrys);
    const selectedKeys = deasyncPromise(
      inquirer.prompt([
        {
          type: "checkbox-plus",
          message: "Please select your entry pages [support filter]：",
          name: "pages",
          highlight: true,
          searchable: true,
          choices: htmlKeys.map(v => ({
            name: v
          })),
          validate: v => {
            return v.length >= 1 || "Please choose at least one";
          },
          source: function(answersSoFar, input) {
            return new Promise(resolve => {
              let currentEntry = htmlKeys.filter(
                item => item.toLowerCase().indexOf(input || "") !== -1
              );
              resolve(currentEntry);
            });
          },
          pageSize: 18
        }
      ])
    );

    // 过滤掉不打包的部分
    for (const key in htmlEntrys) {
      if (htmlEntrys.hasOwnProperty(key)) {
        if (selectedKeys.pages && selectedKeys.pages.indexOf(key) === -1) {
          delete htmlEntrys[key];
          if (jsEntrys[key]) {
            delete jsEntrys[key];
          }
        }
      }
    }
  }

  // 生成 HTML 文件
  let htmlPlugins = [];
  for (let htmlKey in htmlEntrys) {
    const config = {
      filename: htmlKey + ".html",
      template: htmlEntrys[htmlKey],
      // 注入公共模块 ,就是 splitChunks 里面的 default模块
      chunks: ["default"],
      inject: true,
      hash: CONFIG.isLocal,
      cache: true,
      chunksSortMode: "manual",
      minify: {
        removeComments: true,
        collapseWhitespace: false
      }
    };

    // 注入公共库
    for (let key in CONFIG.chunks) {
      config.chunks.push(key);
    }

    // 遍历判断注入
    for (let jsEntry in jsEntrys) {
      if (CONFIG.injectCheck(htmlKey, jsEntry)) {
        config.chunks.push(jsEntry);
      }
    }

    htmlPlugins.push(new HtmlWebpackPlugin(config));
  }

  // 开发环境，如果没有找到 index.html ，则展示 __index.html(页面列表清单) 当首页
  if (isDev) {
    let filename = "index.html";
    if (Object.keys(htmlEntrys).includes("index")) {
      filename = "__index.html";
    }

    htmlPlugins.push(
      new HtmlWebpackPlugin({
        template: require.resolve("./templates/entryList.pug"),
        entries: Object.keys(htmlEntrys),
        filename,
        inject: false
      })
    );
  }

  const babelOptions = {
    cacheDirectory: true,
    plugins: [
      [
        "@babel/plugin-transform-runtime",
        {
          absoluteRuntime: false,
          corejs: false,
          helpers: true,
          regenerator: true,
          useESModules: false
        }
      ],
      require.resolve("@babel/plugin-transform-react-jsx"),
      require.resolve("@babel/plugin-syntax-dynamic-import"),
      require.resolve("@babel/plugin-proposal-class-properties"),
      require.resolve("styled-jsx/babel"),
      ["import", { libraryName: "antd-mobile", style: "css" }]
    ],
    presets: [
      require.resolve("@babel/preset-env"),
      require.resolve("@babel/preset-react")
    ]
  };

  // 插件配置
  let plugins = [
    new HappyPack({
      id: "pug",
      threadPool: happyThreadPool,
      loaders: ["pug-loader"]
    }),
    new HappyPack({
      id: "json",
      threadPool: happyThreadPool,
      loaders: ["json-loader"]
    }),
    new HappyPack({
      id: "jsx",
      threadPool: happyThreadPool,
      loaders: [
        {
          loader: "babel-loader",
          options: babelOptions
        }
      ]
    }),
    ...htmlPlugins,
    new WebpackBar()
  ];

  // 非本地环境，则抽离CSS，本地使用 style-loader 注入页面， 支持 HMR
  if (CONFIG.isProd) {
    plugins.push(
      new MiniCssExtractPlugin({
        filename: "[name]-[contenthash].css"
      })
    );
  }

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
      ...jsEntrys
    },
    output: {
      // 静态资源文件的本机输出目录
      path: paths.resolveApp(CONFIG.outputPath),
      // 静态资源服务器发布目录
      publicPath: "/",
      // 入口文件名称配置
      filename: "[name].js",
      chunkFilename: "[name].js"
    },
    optimization: {
      // 多进程压缩代码
      minimizer: [
        new ParallelUglifyPlugin({
          cacheDir: ".cache/",
          uglifyJS: {
            output: {
              comments: false,
              beautify: false
            },
            compress: {
              drop_console: true,
              collapse_vars: true,
              reduce_vars: true
            }
          }
        })
      ],
      // 代码分割
      splitChunks: {
        cacheGroups: {
          default: {
            test: /(react|react-dom)/,
            name: `${CONFIG.inputPath}/chunks/vendor`,
            chunks: "all",
            priority: 10
          },
          vendors: false
        }
      }
    },
    resolve: {
      extensions: [".js", ".jsx", "json"],
      alias: CONFIG.alias
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          use: "happypack/loader?id=pug",
          exclude: /node_modules/
        },
        {
          test: /\.jsx?$/,
          use: "happypack/loader?id=jsx",
          exclude: /node_modules/
        },
        // postcss 配置信息放在 webpack.config.js 里面， 则不支持使用 happypack
        {
          test: /\.css$/,
          use: [
            CONFIG.isLocal ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: getPostcssConfig()
            }
          ]
        },
        {
          test: /\.less$/,
          use: [
            CONFIG.isLocal ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: getPostcssConfig()
            },
            "less-loader"
          ]
        },
        {
          test: /\.json$/,
          use: "happypack/loader?id=json",
          exclude: /node_modules/
        },
        {
          test: /\.(jpg|png|gif|svg|ico)$/,
          use: {
            loader: "url-loader",
            options: {
              limit: 1024 * 8,
              outputPath: `${CONFIG.inputPath}/assets/images`,
              name: "[name]-[hash].[ext]",
              fallback: "file-loader"
            }
          },
          exclude: /node_modules/
        },
        {
          test: /.(eot|woff|woff2|ttf|doc|docx|ppt|pptx|xls|xlsx|pdf|txt|zip|mp3|mp4)$/,
          use: {
            loader: "file-loader",
            options: {
              outputPath: `${CONFIG.inputPath}/assets/file`,
              name: "[name]-[hash].[ext]"
            }
          },
          exclude: /node_modules/
        }
      ]
    },
    plugins: plugins
  };
};
