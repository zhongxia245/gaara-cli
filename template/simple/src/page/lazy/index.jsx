import React, { Component, lazy, Suspense } from 'react'
import ReactDOM from 'react-dom'

const List = lazy(() => import(/* webpackChunkName: "page/lazy/chunk-list" */ './List.js'))

class Demo extends Component {
  render() {
    return (
      <div>
        <h3>This is a Lazy Component Demo !</h3>
        <Suspense fallback={<div>Loading...</div>}>
          <List />
        </Suspense>
      </div>
    )
  }
}

ReactDOM.render(<Demo />, document.getElementById('app'))
