import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import client from './modules/apollo'
import App from './containers/App'
import Theme from './components/Theme'
import * as serviceWorker from './service-worker'

ReactDOM.render(
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <Theme>
        <App />
      </Theme>
    </ApolloHooksProvider>
  </ApolloProvider>,
  document.getElementById('root')
)

serviceWorker.register()
