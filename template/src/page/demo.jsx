import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class Demo extends Component {
  render() {
    return (
      <div>
        <h3>This ia a Demo Page!</h3>
        <p>
          多页面引用开发，需要确定 同一个目录下需要有一个 <code>同名的pug和jsx文件</code>
        </p>
        <p>比如 demo.pug 和 demo.jsx 文件哈哈</p>
        <p>热更新不能用呀，这个就尴尬了123123</p>
      </div>
    )
  }
}

ReactDOM.render(<Demo />, document.getElementById('app'))
