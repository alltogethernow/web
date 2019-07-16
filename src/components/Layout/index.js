import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography, LinearProgress } from '@material-ui/core'
import useCurrentChannel from '../../hooks/use-current-channel'
import useTimeline from '../../hooks/use-timeline'
import AddFeed from '../AddFeed'
import Gallery from './Gallery'
import Map from './Map'
import Classic from './Classic'
import Timeline from './Timeline'
import layouts from '../../modules/layouts'
import styles from './style'

const NoContent = ({ classes }) => (
  <div className={classes.noPosts}>
    <Typography variant="h5" component="h2">
      <span role="img" aria-label="">
        🤷‍
      </span>{' '}
      Nothing to show
    </Typography>
    <Typography component="p">
      Maybe you need to subscribe to a site or select a different channel
    </Typography>
  </div>
)

const Content = ({ classes, channel }) => {
  const { data, fetchMore, networkStatus } = useTimeline(channel.uid)
  // Use the correct component for the channel view
  const layout = channel && channel._t_layout ? channel._t_layout : 'timeline'
  const viewFilter = layouts.find(l => l.id === layout).filter
  let View = () => null
  switch (layout) {
    case 'gallery':
      View = Gallery
      break
    case 'classic':
      View = Classic
      break
    case 'map':
      View = Map
      break
    default:
      View = Timeline
      break
  }

  const isEmpty = !(
    data &&
    data.timeline &&
    data.timeline.items &&
    data.timeline.items.length
  )

  return (
    <>
      {networkStatus < 7 && <LinearProgress className={classes.loading} />}

      {isEmpty ? (
        <NoContent classes={classes} />
      ) : (
        <View
          posts={data.timeline.items.filter(viewFilter)}
          channel={channel}
          loadMore={fetchMore}
          loading={networkStatus < 7}
        />
      )}

      <AddFeed />
    </>
  )
}

const Layout = ({ classes }) => {
  const channel = useCurrentChannel()

  return (
    <div style={{ height: '100%' }}>
      {channel && channel.uid && (
        <Content classes={classes} channel={channel} />
      )}
      <AddFeed />
    </div>
  )
}

export default withStyles(styles)(Layout)
