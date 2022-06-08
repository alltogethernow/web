import React from 'react'
import { ApolloProvider } from '@apollo/client'
import client from '../modules/apollo'
import Routes from './Routes'
import Theme from '../components/Theme'

const App = () => (
  <ApolloProvider client={client}>
    <Theme>
      <Routes />
    </Theme>
  </ApolloProvider>
)

export default App
