import React from 'react'
import withStyles from '@mui/styles/withStyles'
import { LinearProgress } from '@mui/material'
import AddFeed from '../AddFeed'
import Gallery from './Gallery'
import Map from './Map'
import Classic from './Classic'
import Timeline from './Timeline'
import NoContent from './NoContent'
import layouts from '../../modules/layouts'
import styles from './style'

const Content = ({ classes, channel, data, fetchMore, networkStatus }) => {
  // Use the correct component for the channel view
  const layout = channel && channel._t_layout ? channel._t_layout : 'timeline'
  const viewFilter = layouts.find((l) => l.id === layout).filter
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

  const timelineItems = data?.timeline?.items ?? []

  const isEmpty = !timelineItems.length

  return (
    <>
      {networkStatus < 7 && <LinearProgress className={classes.loading} />}

      {isEmpty && networkStatus >= 7 && <NoContent />}

      {!isEmpty && (
        <View
          posts={timelineItems.filter(viewFilter)}
          channel={channel}
          loadMore={fetchMore}
          loading={networkStatus < 7}
        />
      )}

      <AddFeed />
    </>
  )
}

export default withStyles(styles)(Content)
