import ApolloClient from 'apollo-client'
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { onError } from 'apollo-link-error'
import { getMainDefinition } from 'apollo-utilities'
import gql from 'graphql-tag'
import { getTheme } from './windows-functions'
import { version } from '../../package.json'
import { GET_CHANNELS } from '../queries'

// Create an http link:
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_SERVER || 'http://localhost:4000',
  includeExtensions: true,
  headers: {
    authorization: localStorage.getItem('token'),
    'client-name': 'Together [web]',
    'client-version': version,
  },
})

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri:
    process.env.REACT_APP_SUBSCRIPTION_SERVER || 'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
    timeout: 30000,
    connectionParams: {
      authToken: localStorage.getItem('token'),
    },
  },
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

const logoutLink = onError(({ networkError, graphQLErrors }) => {
  const handleAuthError = () => {
    if (window.localStorage.getItem('token')) {
      window.localStorage.removeItem('token')
      window.location.href = '/login'
    }
  }
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions.code === 'UNAUTHENTICATED') {
        return handleAuthError()
      }
    }
  }
  if (networkError && networkError.statusCode === 401) {
    return handleAuthError()
  }
})

const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      channel: (_, args, { getCacheKey }) =>
        getCacheKey({ __typename: 'Channel', uid: args.uid }),
    },
  },
  dataIdFromObject: object => {
    switch (object.__typename) {
      case 'Channel':
        // Channel always have a unique uid identifier
        return object.uid
      case 'Post':
        // Posts should have an _id but not always (refs etc...)
        if (object._id) {
          return object._id
        }
        // Url is the second most unique thing
        if (object.url) {
          return object.url
        }
        // Not so unique
        return defaultDataIdFromObject(object)
      case 'PostAuthor':
        // Authors should have an url but not always
        if (object.url) {
          return object.url
        }
        // Not so unique
        return defaultDataIdFromObject(object)
      default: {
        // Probably don't need anything for this type
        // console.log('no dataid handler for ', object.__typename, object)
        return defaultDataIdFromObject(object)
      }
    }
  },
})

const typeDefs = gql`
  extend type Query {
    currentChannel: Channel!
  }
`

const client = new ApolloClient({
  cache,
  typeDefs,
  link: logoutLink.concat(link),
  connectToDevTools: true,
  resolvers: {},
})

const initialAppState = () => ({
  channelsMenuOpen: false,
  focusedComponent: 'channels',
  shortcutHelpOpen: false,
  token: localStorage.getItem('token'),
  theme: localStorage.getItem('together-theme') || getTheme() || 'light',
})

cache.writeData({ data: initialAppState() })

client.onResetStore(() => {
  console.log('resetting store', cache)
  cache.writeData({ data: initialAppState() })
  cache.writeQuery({ query: GET_CHANNELS, data: { channels: [] } })
})

export default client
