/**
 * 根据命令生成页面
 */
const fs = require('fs')
const { red } = require('chalk')
const copyDir = require('../utils/copyDir')
const { resolveOwn } = require('../config/paths')

const generatorPage = async () => {
  let [type, pageName] = process.argv.slice(2)

  switch (type) {
    case 'page':
      // 如果页面已经存在，则不创建
      if (fs.existsSync(pageName)) {
        console.log(red(`[ERROR]: Directory "${pageName}" already exists, please change pageName...`))
        return
      }
      copyDir(resolveOwn('template/page/simple'), resolveOwn(pageName))
      break
    default:
      // 待实现其他
      console.log(red(`Sorry, "gaara generator" command Currently only supported "page"`))
      break
  }
}

generatorPage()
