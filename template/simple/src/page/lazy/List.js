import React from 'react'

let data = []
for (let i = 0; i < 10000; i++) {
  data.push(i)
}

export default () => {
  return (
    <div>
      <h1>This is a lazy list</h1>
      <ul>
        {data.map((item, index) => {
          return <li key={index}>List Index:{item}</li>
        })}
      </ul>
    </div>
  )
}
