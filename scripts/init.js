const fs = require('fs')
const path = require('path')
const prompts = require('prompts')
const { green, red } = require('chalk')
const copyDir = require('../utils/copyDir')

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
    copyDir(path.join(__dirname, '../template/simple'), name, error => {
      console.error(red('create directory error'), error)
    })
    console.log(green('create project success !'))
  } catch (error) {
    console.error(red('create directory error'), error)
  }
}

init()
