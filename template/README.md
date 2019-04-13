# Gaara-cli Demo Project

该项目由 `create-react-app` 和 自定义的 `gaara-cli` npm 包生成的脚手架项目。

## 如何使用?

```bash
# 运行
npm run dev
# 构建
npm run build
```

## 如何新增文件？

1. 在 `src` 下新建一个 `demo` 目录

2. 然后新建一个同名的 `pug` 和 `jsx` 文件

3. `src/demo/index.pug` `src/demo/index.jsx`

4. 重新运行项目即可看到页面

## 构建出来的静态文件如何上传七牛？

在 `gitlab`  的 `Settings => CI / CD => Variables` 里面设置以下的环境变量

```bash
# 七牛 CDN 地址前缀
PUBLIC_PATH

## 这些配置信息，登录七牛帐号查看
# 七牛 AK
process.env.QINIU_AK

# 七牛 SK
process.env.QINIU_SK

# 七牛BUCKET
process.env.QINIU_BUCKET
```

## 如何部署？

本项目默认采用 docker 部署，`dev`,`pre` 分支自动部署

线上环境需要打 `tag` 进行部署

eg: 打一个 `0.0.1` 这种格式的 tag，则会自动构建，打包 docker， 部署则需要手动部署。
