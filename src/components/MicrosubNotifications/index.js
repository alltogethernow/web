import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Popover, Divider, Button, CircularProgress } from '@material-ui/core'
import OpenButton from './OpenButton'
import TitleBar from './TitleBar'
import Post from '../Post'
import styles from './style'
import useTimeline from '../../hooks/use-timeline'
import useChannels from '../../hooks/use-channels'

const Channel = props => {
  const { channels } = useChannels()
  const channel = channels.find(c => c.uid === 'notifications')

  return channel ? <NotificationsList channel={channel} {...props} /> : null
}

const NotificationsList = ({ classes, buttonClass, channel }) => {
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState(null)
  const { data, fetchMore, networkStatus, error } = useTimeline({
    channel: 'notifications',
  })
  const loading = networkStatus < 7

  if (error) {
    console.warn('Error loading notifications', error)
    return null
  }

  if (Object.keys(data).length === 0) {
    return null
  }

  const {
    timeline: { after, items: notifications },
  } = data

  return (
    <Fragment>
      <OpenButton
        open={open}
        loading={loading}
        unread={channel.unread}
        handleOpen={e => {
          setAnchor(e.target)
          setOpen(true)
        }}
        buttonClass={buttonClass}
        name={channel.name}
      />
      <Popover
        open={open}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={() => setOpen(false)}
        onBackdropClick={() => setOpen(false)}
        className={classes.popover}
      >
        {loading && <CircularProgress className={classes.spinner} size={50} />}
        <div className={classes.container}>
          {notifications.map(post => (
            <Fragment key={'notification-' + post._id}>
              <div style={{ opacity: post._is_read ? 0.5 : 1 }}>
                <Post
                  style={{ boxShadow: 'none' }}
                  post={post}
                  channel="notifications"
                />
              </div>
              <Divider />
            </Fragment>
          ))}
          {after && (
            <Button
              size="large"
              fullWidth={true}
              onClick={fetchMore}
              className={classes.loadMore}
            >
              Load More
            </Button>
          )}
        </div>
        <TitleBar title={channel.name} unread={channel.unread} />
      </Popover>
    </Fragment>
  )
}

NotificationsList.defaultProps = {
  buttonClass: '',
}

NotificationsList.propTypes = {
  buttonClass: PropTypes.string.isRequired,
}

export default withStyles(styles)(Channel)
