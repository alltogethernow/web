import { useMutation, useApolloClient } from '@apollo/client'
import { MARK_CHANNEL_READ, GET_CHANNELS, GET_TIMELINE } from '../queries'

export default function () {
  const client = useApolloClient()
  const [markRead] = useMutation(MARK_CHANNEL_READ)

  return (channel) => {
    // Get the most recent post id in the timeline
    let post = null
    const {
      timeline: { items },
    } = client.readQuery({
      query: GET_TIMELINE,
      variables: { channel },
    })
    post = items[0]._id

    markRead({
      variables: { channel, post },
      optimisticResponse: {
        __typename: 'Mutation',
        markChannelRead: {
          uid: channel,
          unread: 0,
          __typename: 'Channel',
        },
      },
      update: (cache, _) => {
        const timelineRes = cache.readQuery({
          query: GET_TIMELINE,
          variables: { channel },
        })

        const timelineData = { ...timelineRes }
        // Update all cached posts to be marked read
        if (timelineData.timeline && timelineData.timeline.items) {
          timelineData.timeline.items = timelineData.timeline.items.map(
            (item) => {
              item._is_read = true
              return item
            }
          )
        }
        // Write our data back to the cache.
        cache.writeQuery({
          query: GET_TIMELINE,
          variables: { channel },
          data: timelineData,
        })

        const channelRes = cache.readQuery({ query: GET_CHANNELS })
        const channelData = { ...channelRes }
        channelData.channels.find((c) => c.uid === channel).unread = 0
        cache.writeQuery({ query: GET_CHANNELS, data: channelData })
      },
    })
  }
}
