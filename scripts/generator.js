/**
 * 根据命令生成页面
 */
const fs = require('fs')
const path = require('path')
const { red } = require('chalk')
const copyDir = require('../utils/copyDir')
const { resolveOwn, resolveApp } = require('../config/paths')

const generatorPage = async () => {
  let [type, pageName] = process.argv.slice(2)

  // 当前目录下，加目录名
  pageName = path.join(process.cwd(), pageName)

  switch (type) {
    case 'page':
      // 如果页面已经存在，则不创建
      if (fs.existsSync(pageName)) {
        console.log(red(`[ERROR]: Directory "${pageName}" already exists, please change pageName...`))
        return
      }
      copyDir(resolveOwn('template/page/simple'), resolveApp(pageName))
      break
    default:
      // 待实现其他
      console.log(red(`Sorry, "gaara generator" command Currently only supported "page"`))
      break
  }
}

generatorPage()
