const fs = require('fs')
const path = require('path')
const prompts = require('prompts')
const chalk = require('chalk')

const { green, red } = chalk

const init = async () => {
  const response = await prompts({
    type: 'text',
    name: 'name',
    message: 'What is project name?',
    validate: value => {
      let exists = fs.existsSync(value)
      return !exists || `directory : ${value} is existed`
    }
  })

  const { name } = response
  try {
    copyDir(path.join(__dirname, '../template'), name, error => {
      console.error(red('create directory error'), error)
    })
    console.log(green('create project success !'))
  } catch (error) {
    console.error(red('create directory error'), error)
  }
}

init()

/*
 * 复制目录、子目录，及其中的文件
 * @param src {String} 要复制的目录
 * @param dist {String} 复制到目标目录
 * @param callback {function} 失败的回调
 */
function copyDir(src, dist, callback = () => {}) {
  fs.access(dist, err => {
    if (err) fs.mkdirSync(dist)
    _copy(null, src, dist)
  })

  // 复制文件
  function _copy(err, src, dist) {
    if (err) return callback(err)

    // 读取文件夹
    fs.readdir(src, (err, paths) => {
      if (err) return callback(err)

      // 遍历路径，文件则写到制定目录取，否则继续遍历文件夹
      paths.forEach(path => {
        let _src = `${src}/${path}`
        let _dist = `${dist}/${path}`

        fs.stat(_src, (err, stat) => {
          if (err) return callback(err)

          // 判断是文件还是目录,文件则复制一份，目录则继续递归
          if (stat.isFile()) {
            console.log(green(_src))
            fs.writeFileSync(_dist, fs.readFileSync(_src))
          } else if (stat.isDirectory()) {
            copyDir(_src, _dist, callback)
          }
        })
      })
    })
  }
}
