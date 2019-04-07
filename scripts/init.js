const fs = require('fs')
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
    copyDir('template', name)
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
 */
function copyDir(src, dist, callback) {
  fs.access(dist, function(err) {
    if (err) {
      // 目录不存在时创建目录
      fs.mkdirSync(dist)
    }
    _copy(null, src, dist)
  })

  function _copy(err, src, dist) {
    if (err) {
      callback(err)
    } else {
      fs.readdir(src, function(err, paths) {
        if (err) {
          callback(err)
        } else {
          paths.forEach(function(path) {
            var _src = src + '/' + path
            var _dist = dist + '/' + path
            fs.stat(_src, function(err, stat) {
              if (err) {
                callback(err)
              } else {
                // 判断是文件还是目录
                if (stat.isFile()) {
                  fs.writeFileSync(_dist, fs.readFileSync(_src))
                } else if (stat.isDirectory()) {
                  // 当是目录是，递归复制
                  copyDir(_src, _dist, callback)
                }
              }
            })
          })
        }
      })
    }
  }
}
