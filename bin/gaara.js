#!/usr/bin/env node
const commander = require('commander')
const chalk = require('chalk')
const spawn = require('react-dev-utils/crossSpawn')

const { red } = chalk

function runScript(script, args) {
  const nodeArgs = []
  const result = spawn.sync('node', nodeArgs.concat(require.resolve('../scripts/' + script)).concat(args.slice(1)), {
    stdio: 'inherit'
  })
  process.exit(result.status)
}

commander
  .version('0.0.1')
  .description('A Multiple Page Webpack cli application')
  .action(function(cmd, env) {
    cmdValue = cmd
    envValue = env
  })

commander.on('--help', function() {
  console.log('')
  console.log('Examples:')
  console.log(`  $ gaara dev     : Run webpack dev server`)
  console.log(`  $ gaara build   : Build assets`)
  console.log(`  $ gaara init    : Generate a new project`)
  console.log(`  $ gaara analyze : Analyze assets info`)
})

// 运行本地环境
commander
  .command('dev')
  .option('-P, --post', 'set run port [default:3000]')
  .option('-I, --inputPath', 'set inputPath [default: src]')
  .action(() => {
    runScript('dev', process.argv.slice(2))
  })

// 构建线上代码包
commander.command('build').action(() => {
  runScript('build', process.argv.slice(2))
})

// 分析构建文件大小
commander.command('analyze').action(() => {
  runScript('analyze', process.argv.slice(2))
})

// 分析构建文件大小
commander.command('init').action(env => {
  runScript('init', process.argv.slice(2))
  console.log(env, process.argv.slice(2))
})

commander.on('command:*', function(env) {
  console.error(red(`Invalid command: ${env[0]} \nSee --help for a list of available commands.`))
  process.exit(1)
})

commander.parse(process.argv)
