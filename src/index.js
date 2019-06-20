import React from 'react'
import ReactDOM from 'react-dom'
import App from './containers/App'

const rootEl = document.getElementById('root')

ReactDOM.render(<App />, rootEl)

if (module.hot) {
  console.log('Hot fire 🔥🔥🔥')
  module.hot.accept('./containers/App', () => {
    const NextApp = require('./containers/App').default
    ReactDOM.render(<NextApp />, rootEl)
  })
}
