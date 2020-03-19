# Node 命令行工具如何进行开发

开发 Node 命令行需要了解一下几个问题。

1. 如何进行开发命令行
2. 如何本地调式命令行工具

## 一、如何进行开发命令行

这几篇随便找一篇看看，就可以了。

- [《阮一峰 - Node.js 命令行程序开发教程》](https://www.ruanyifeng.com/blog/2015/05/command-line-with-node.html)
- [《aotu.io - 跟着老司机玩转 Node 命令行》](https://aotu.io/notes/2016/08/09/command-line-development/index.html)
- [《从 1 到完美，用 node 写一个命令行工具》](https://segmentfault.com/a/1190000016555129)

## 三、如何本地调式命令行工具

进入项目，然后执行 `yarn link`，就会把当前项目的 cli 命令，注册到系统中，此时就可以直接执行开发的 cli 命令。

```bash
cd /path/project

# 这里最好使用 yarn link， 如果使用 npm link ，经常会卡住，不明所以
yarn link

# 直接执行命令
gaara
```

### 3.1、可能存在问题

在执行 `yarn link` 的时候，可能告诉你已经注册过了。 可能在你系统的另外一个目录下，还存在这个项目，并且你已经 `yarn link` 过了。因此才报这个错误。

> 最可能是的是早期你开发在一个目录下，后面你从 github 又下载下来，然后在 link，就报错。
> 删掉去掉一个项目，重新 `yarn link` ，或者直接去上一个项目开发即可。
