const fs = require('fs')
const paths = require('./paths')

const isProd = process.env.NODE_ENV === 'production'

// 加载项目自定义配置
const loadConfig = () => {
  const configPath = paths.resolveApp('config.js')
  let config = {}
  if (fs.existsSync(configPath)) {
    config = require(configPath)
  }
  return config
}

const defaultConfig = {
  // 前端注入环境变量
  environments: {},
  // 是否为本地环境
  isLocal: !isProd,
  // 是否为生产环境
  isProd: isProd,
  // 运行端口
  port: 3000,
  // 代理配置
  proxy: {},
  // 入口目录(这里指向模板项目)
  inputPath: 'template/src',
  // 输出目录
  outputPath: 'dist',
  // 文件引用路径别名
  alias: {},
  // rem 转换基准
  basePixel: 16,
  // 公共模块
  chunks: {},
  // less 打包配置
  lessOption: {},
  // js 选择性注入判断函数
  injectCheck: (html, js) => {
    return html === js
  }
}

const projectConfig = loadConfig()
const CONFIG = { ...defaultConfig, ...projectConfig }

const tools = {
  // [`${CONFIG.inputPath}/packages/tools/common`]: path.resolve(__dirname, './packages/tools/common.js')
}
CONFIG.chunks = { ...tools, ...CONFIG.chunks }

module.exports = CONFIG
