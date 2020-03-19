#!/usr/bin/env node
const program = require("commander");
const { red } = require("chalk");
const spawn = require("react-dev-utils/crossSpawn");
const packageJson = require("../package.json");

function runScript(script, args) {
  const nodeArgs = [];
  const result = spawn.sync(
    "node",
    nodeArgs
      .concat(require.resolve("../scripts/" + script))
      .concat(args.slice(1)),
    {
      stdio: "inherit"
    }
  );
  process.exit(result.status);
}

program.version(packageJson.version).description(packageJson.description);

// 运行本地环境
// 添加只构建某个页面
program
  .command("dev")
  .description("start a webpack dev server")
  .option("-S", "select some page to start webpack dev server")
  .action(() => {
    runScript("dev", process.argv.slice(2));
  });

// 构建代码包
program
  .command("build")
  .description("build project assets and upload cdn")
  .option("-N", "not upload assets to CDN")
  .action(() => {
    runScript("build", process.argv.slice(2));
  });

// 分析构建文件大小
program
  .command("analyze")
  .description("analyze webpack bundle file size")
  .action(() => {
    runScript("analyze", process.argv.slice(2));
  });

// 初始化一个多页项目
program
  .command("init <dir>")
  .description("Generate a new multiple page project")
  .action(() => {
    runScript("init", process.argv.slice(2));
  });

// 新增页面
program
  .command("generator <type> <pageName>")
  .alias("g")
  .description("add new page, eg: gaara add page demo/test")
  .action(() => {
    runScript("generator", process.argv.slice(2));
  });

program.on("command:*", function(env) {
  console.error(
    red(
      `Invalid command: gaara ${env[0]} \nSee --help for a list of available commands.`
    )
  );
  process.exit(1);
});

program.parse(process.argv);

// 如果没有传递命令，则默认展示提示信息
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
