/*
 * 复制目录、子目录，及其中的文件
 * @param src {String} 要复制的目录
 * @param dist {String} 复制到目标目录
 * @param callback {function} 失败的回调
 */

const path = require('path')
const fs = require('fs')
const { green, red } = require('chalk')
const mkdirp = require('mkdirp') // 可以创建多级目录

const copyDir = (
  src,
  dist,
  callback = error => {
    console.error(red(error))
  }
) => {
  // 复制文件
  const copy = (err, src, dist, callback) => {
    if (err) return callback(err)

    // 读取文件夹
    fs.readdir(src, (err, filePaths) => {
      if (err) return callback(err)

      // 遍历路径，文件则写到制定目录取，否则继续遍历文件夹
      filePaths.forEach(filePath => {
        let _src = `${src}/${filePath}`
        let _dist = `${dist}/${filePath}`

        fs.stat(_src, (err, stat) => {
          if (err) return callback(err)

          // 判断是文件还是目录,文件则复制一份，目录则继续递归
          if (stat.isFile()) {
            fs.copyFileSync(_src, _dist)

            console.log(green(`create ${path.relative(path.resolve(process.cwd()), _dist)}`))
          } else if (stat.isDirectory()) {
            copyDir(_src, _dist, callback)
          }
        })
      })
    })
  }

  fs.access(dist, err => {
    // 目录不存在，则创建
    if (err) mkdirp.sync(dist)
    copy(null, src, dist, callback)
  })
}

module.exports = copyDir
