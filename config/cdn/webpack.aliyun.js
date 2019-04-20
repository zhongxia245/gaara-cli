const OSS = require('ali-oss')
const ora = require('ora')
const is = require('is_js')

// 上传进度
const progress = (uploaded, total) => {
  return `Uploading to Aliyun: ${uploaded}/${total} files uploaded`
}

module.exports = class AliyunPlugin {
  constructor(options) {
    this.options = Object.assign({}, options)
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap('after-emit', compilation => {
      let assets = compilation.assets
      let exclude = is.regexp(this.options.exclude) && this.options.exclude
      let include = is.regexp(this.options.include) && this.options.include
      // 并发上传数量
      let batch = this.options.batch || 20
      let filesNames = Object.keys(assets)
      let totalFiles = 0
      let uploadedFiles = 0

      // 上传实例
      let client = new OSS({
        region: this.options.region,
        accessKeyId: this.options.accessKeyId,
        accessKeySecret: this.options.accessKeySecret,
        bucket: this.options.bucket
      })

      // 结束提示
      let finish = error => {
        spinner.succeed()
        console.log('\n')
      }

      // 筛选文件
      filesNames = filesNames.filter(fileName => {
        let file = assets[fileName] || {}

        if (!file.emitted) {
          return false
        }
        if (exclude && exclude.test(fileName)) {
          return false
        }
        if (include) {
          return include.test(fileName)
        }
        return true
      })

      totalFiles = filesNames.length

      let spinner = ora({
        text: progress(0, totalFiles),
        color: 'green'
      }).start()

      // 上传至阿里云
      const performUpload = function(fileName) {
        let file = assets[fileName] || {}

        return new Promise(async (resolve, reject) => {
          let begin = Date.now()
          try {
            await client.put(fileName, file.existsAt)
            uploadedFiles++
            spinner.text = progress(uploadedFiles, totalFiles)
            const payload = { duration: Date.now() - begin }
            resolve(payload)
          } catch (error) {
            reject(error)
          }
        })
      }

      // 设置并发上传数量
      const execStack = function(error) {
        if (error) {
          console.log('\n')
          console.log(error)
          return Promise.reject(error)
        }
        let files = filesNames.splice(0, batch)
        if (files.length) {
          return Promise.all(files.map(performUpload)).then(() => execStack(), execStack)
        } else {
          return Promise.resolve()
        }
      }

      execStack().then(() => finish(), finish)
    })
  }
}
