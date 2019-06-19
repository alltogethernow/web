import { useState, useEffect } from 'react'
import { useQuery, useSubscription } from 'react-apollo-hooks'
import useCurrentChannel from './use-current-channel'
import { GET_TIMELINE, TIMELINE_SUBSCRIPTION } from '../queries'

export default function() {
  // Get selected channel
  const channel = useCurrentChannel()

  // Get the initial timeline
  const query = useQuery(GET_TIMELINE, {
    variables: { channel: channel.uid },
    notifyOnNetworkStatusChange: true,
  })

  // Save the before value in state using the initial timeline
  const [before, setBefore] = useState(
    query.data.timeline ? query.data.timeline.before : null
  )

  // Reset the before value timeline result changes
  useEffect(() => {
    if (query.data.timeline && query.data.timeline.before !== before) {
      setBefore(query.data.timeline.before)
    }
  }, [query.data.timeline])

  // Refetch the timeline if going back to a cached channel timeline
  useEffect(() => {
    if (query.refetch && channel.uid && !query.loading) {
      setTimeout(query.refetch, 200)
    }
  }, [channel.uid])

  // Also subscribe to the timeline to get updates via websocket
  useSubscription(TIMELINE_SUBSCRIPTION, {
    variables: {
      before,
      channel: channel.uid,
    },
    onSubscriptionData: ({
      client,
      subscriptionData: {
        data: { timelineSubscription: timeline },
      },
    }) => {
      // When websocket data received we need to update the cache
      if (timeline.before && timeline.before !== before) {
        // Update the before state with the new one
        setBefore(timeline.before)
        if (timeline.items.length) {
          // Get the currently cached timeline
          const cache = client.readQuery({
            query: GET_TIMELINE,
            variables: { channel: timeline.channel },
          })
          // Update cached before
          cache.timeline.before = timeline.before
          // Add any new items to the start of the cache
          cache.timeline.items = [...timeline.items, ...cache.timeline.items]
          // Store the cache again
          client.writeQuery({
            query: GET_TIMELINE,
            variables: { channel: timeline.channel },
            data: cache,
          })
        }
      }
    },
  })

  const fetchMore = () => {
    if (
      query.networkStatus === 7 &&
      query.data.timeline &&
      query.data.timeline.after
    ) {
      query.fetchMore({
        query: GET_TIMELINE,
        variables: { channel: channel.uid, after: query.data.timeline.after },
        updateQuery: (previousResult, { fetchMoreResult }) => ({
          timeline: {
            channel: fetchMoreResult.timeline.channel,
            after: fetchMoreResult.timeline.after,
            before: previousResult.timeline.before,
            items: [
              ...previousResult.timeline.items,
              ...fetchMoreResult.timeline.items,
            ],
            __typename: previousResult.timeline.__typename,
          },
        }),
      })
    }
  }

  return Object.assign({}, query, { fetchMore })
}
