const path = require('path')
const qiniu = require('qiniu')
const ora = require('ora')
const is = require('is_js')

// 上传进度
const progress = (uploaded, total) => {
  return `Uploading to Qiniu: ${uploaded}/${total} files uploaded`
}

module.exports = class QiniuPlugin {
  constructor(options) {
    this.options = Object.assign({}, options)
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap('after-emit', compilation => {
      let assets = compilation.assets
      let hash = compilation.hash
      let uploadPath = this.options.path
      let exclude = is.regexp(this.options.exclude) && this.options.exclude
      let include = is.regexp(this.options.include) && this.options.include
      let batch = this.options.batch || 20
      let mac = new qiniu.auth.digest.Mac(this.options.accessKey, this.options.secretKey)
      let qiniuConfig = new qiniu.conf.Config()
      let bucket = this.options.bucket
      let zone = qiniu.zone[this.options.zone]
      if (zone) {
        qiniuConfig.zone = zone
      }
      let filesNames = Object.keys(assets)
      let totalFiles = 0
      let uploadedFiles = 0

      // 结束提示
      let finish = err => {
        spinner.succeed()
        console.log('\n')
      }

      // 筛选需要上传的文件
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

      // 上传至七牛
      const performUpload = function(fileName) {
        let file = assets[fileName] || {}
        let key = path.posix.join(uploadPath, fileName)
        let putPolicy = new qiniu.rs.PutPolicy({ scope: bucket + ':' + key })
        let uploadToken = putPolicy.uploadToken(mac)
        let formUploader = new qiniu.form_up.FormUploader(qiniuConfig)
        let putExtra = new qiniu.form_up.PutExtra()

        return new Promise((resolve, reject) => {
          let begin = Date.now()
          formUploader.putFile(uploadToken, key, file.existsAt, putExtra, function(err, body) {
            uploadedFiles++
            spinner.text = progress(uploadedFiles, totalFiles)

            if (err) {
              return reject(err)
            }
            body.duration = Date.now() - begin
            resolve(body)
          })
        })
      }

      // 设置并发上传数量
      const execStack = function(err) {
        if (err) {
          console.log('\n')
          return Promise.reject(err)
        }

        // 提取20个文件
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
