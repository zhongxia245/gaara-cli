module.exports = {
  // 代理配置
  proxy: {},
  // 入口目录,默认 src 下的所有jsx
  inputPath: "src",
  // 构建目录
  outputPath: "dist",
  // 文件引用路径别名
  alias: {},
  // 外部引用
  externals: {},
  // px 自动转成 rem
  usePx2Rem: true,
  // rem 转换基准
  basePixel: 16,
  // 公共模块
  chunks: {},
  // 编译地图开关
  sourceMap: false,
  // js 选择性注入判断函数
  injectCheck: (html, js) => {
    return html === js
  }
}
