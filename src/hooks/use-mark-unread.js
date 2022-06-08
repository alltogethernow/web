import { useMutation } from '@apollo/client'
import { MARK_POST_UNREAD, GET_CHANNELS } from '../queries'

export default function () {
  const [markRead] = useMutation(MARK_POST_UNREAD)
  return (channel, post) =>
    markRead({
      variables: { channel, post },
      optimisticResponse: {
        __typename: 'Mutation',
        markPostUnread: {
          _id: post,
          _is_read: false,
          __typename: 'Post',
        },
      },
      update: (cache, _) => {
        // Read the data from our cache for this query.
        const data = cache.readQuery({
          query: GET_CHANNELS,
        })
        const update = { ...data }
        // Increment channel unread count
        update.channels = update.channels.map((c) => {
          if (c.uid === channel && Number.isInteger(c.unread)) {
            c.unread++
          }
          return c
        })
        // Write our data back to the cache.
        cache.writeQuery({ query: GET_CHANNELS, data: update })
      },
    })
}
