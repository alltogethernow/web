import { useCallback } from 'react'
import { useMutation } from '@apollo/client'
import { MARK_POST_READ, GET_CHANNELS } from '../queries'

export default function () {
  const [markRead] = useMutation(MARK_POST_READ)

  return useCallback(
    (channel, post) =>
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
        update: (cache, _) => {
          // Read the data from our cache for this query.
          const data = cache.readQuery({
            query: GET_CHANNELS,
          })

          const update = { ...data }

          // Decrement unread count on selected channel
          update.channels = update.channels.map((c) => {
            let cUpdate = { ...c }
            if (
              c.uid === channel &&
              c.unread &&
              Number.isInteger(c.unread) &&
              c.unread > 0
            ) {
              cUpdate.unread = c.unread - 1
            }
            return cUpdate
          })
          // Write our data back to the cache.
          cache.writeQuery({ query: GET_CHANNELS, data: update })
        },
      }),
    [markRead]
  )
}
