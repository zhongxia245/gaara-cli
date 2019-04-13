# 多页面脚手架

快速构建一个多页面的脚手架，封装了 webpack 的内部配置，直接提供一个 dev ， build 环境的构建配置。

- 支持快速构建项目
- 支持开发环境热更新
- 支持每个页面使用自己的 html 模板

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
