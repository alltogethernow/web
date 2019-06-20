import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import client from '../modules/apollo'
import Routes from './Routes'
import Theme from '../components/Theme'

const App = () => (
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <Theme>
        <Routes />
      </Theme>
    </ApolloHooksProvider>
  </ApolloProvider>
)

export default App
