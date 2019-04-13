import './index.less'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class Page extends Component {
  render() {
    return <div>This is a page ~</div>
  }
}

ReactDOM.render(<Page />, document.getElementById('app'))
