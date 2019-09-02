import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography, LinearProgress } from '@material-ui/core'
import useCurrentChannel from '../../hooks/use-current-channel'
import useTimeline from '../../hooks/use-timeline'
import AddFeed from '../AddFeed'
import Content from './Content'
import styles from './style'

const ContentFetcher = ({ channel }) => {
  const { data, fetchMore, networkStatus } = useTimeline(channel.uid)

  return (
    <Content
      data={data}
      fetchMore={data.after ? fetchMore : null}
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
