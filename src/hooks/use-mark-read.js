import { useMutation } from 'react-apollo-hooks'
import { MARK_POST_READ, GET_CHANNELS } from '../queries'

export default function() {
  const markRead = useMutation(MARK_POST_READ)
  return (channel, post) =>
    markRead({
      variables: { channel, post },
      optimisticResponse: {
        __typename: 'Mutation',
        markPostRead: {
          _id: post,
          _is_read: true,
          __typename: 'Post',
        },
      },
      update: (proxy, _) => {
        // Read the data from our cache for this query.
        const data = proxy.readQuery({
          query: GET_CHANNELS,
        })
        // Decrement unread count on selected channel
        data.channels = data.channels.map(c => {
          if (c.uid === channel && c.unread && Number.isInteger(c.unread)) {
            c.unread--
          }
          return c
        })
        // Write our data back to the cache.
        proxy.writeQuery({ query: GET_CHANNELS, data })
      },
    })
}
