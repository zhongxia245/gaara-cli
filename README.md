# webpack 多页面 命令行工具

webpack 多页面的一个脚手架命令行工具，内部封装了 webpack 配置，可以让我们更专注于业务逻辑的编写。

内置功能如下

- React , webpack4 , less
- 热更新（因为是多页面，因此是改完代码，页面会刷新）
- 用命令行快速生成脚手架，生成页面功能

## 为什么是 Gaara ？

在写这个 node 命令的时候，突然想起了火影里面的我爱罗，so...

## 如何使用？

```bash
npm install -g gaara-cli

# 初始化基础脚手架
gaara init

# 进入项目目录，比如叫 gaara-demo
cd gaara-demo

npm install

npm run dev

npm run build
```

## 如何升级脚手架

在应用项目里面，修改 `gaara-cli` 的版本号即可， 此项目升级会兼容老版本。

## 更新日志

[CHANGELOG](./CHANGELOG.md)
