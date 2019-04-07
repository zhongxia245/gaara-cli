import React, { Component, lazy, Suspense } from 'react'
import ReactDOM from 'react-dom'

const List = lazy(() => import('./List.js'))

class Demo extends Component {
  render() {
    return (
      <div>
        <h3>This ia a Demo Page!</h3>
        <p>5555555123123123123123123123123123123123123</p>
        <Suspense fallback={<div>Loading...</div>}>
          <List />
        </Suspense>
      </div>
    )
  }
}

ReactDOM.render(<Demo />, document.getElementById('app'))
