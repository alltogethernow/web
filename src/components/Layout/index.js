import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import useCurrentChannel from '../../hooks/use-current-channel'
import useTimeline from '../../hooks/use-timeline'
import AddFeed from '../AddFeed'
import Content from './Content'
import styles from './style'

const ContentFetcher = ({ channel }) => {
  const { data, fetchMore, networkStatus } = useTimeline({
    channel: channel.uid,
    unreadOnly: channel._t_unreadOnly,
  })

  return (
    <Content
      data={data}
      fetchMore={data.timeline && data.timeline.after ? fetchMore : null}
      networkStatus={networkStatus}
      channel={channel}
    />
  )
}

const Layout = ({ classes }) => {
  const channel = useCurrentChannel()

  return (
    <div style={{ height: '100%' }}>
      {channel && channel.uid && <ContentFetcher channel={channel} />}
      <AddFeed />
    </div>
  )
}

export default withStyles(styles)(Layout)
