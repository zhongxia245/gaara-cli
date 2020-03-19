const fs = require("fs")
const path = require("path")

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)
const resolveOwn = relativePath => path.resolve(__dirname, "..", relativePath)

module.exports = {
  resolveApp: resolveApp,
  resolveOwn: resolveOwn,
  // 应用项目路径
  appPath: resolveApp("."),
  // 应用项目的配置
  appConfigPath: resolveApp("config.js"),
  appInputPath: resolveApp("config.js"),
  // 当前 cli 项目路径
  ownPath: resolveOwn("."),
  //  当前 cli 项目的配置
  ownConfigPath: resolveOwn("config.js")
}
