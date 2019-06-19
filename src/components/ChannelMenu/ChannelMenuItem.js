import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { ListItem, ListItemText } from '@material-ui/core'
import { SortableElement } from 'react-sortable-hoc'
import useLocalState from '../../hooks/use-local-state'
import styles from './style'

const ChannelMenuItem = ({ classes, channel, isFocused, current }) => {
  const [localState, setLocalState] = useLocalState()
  let unreadCount = null
  if (channel.unread) {
    unreadCount = (
      <span className={classes.unread}>
        {typeof channel.unread === 'number' ? channel.unread : ''}
      </span>
    )
  }

  return (
    <ListItem
      button
      component={Link}
      to={`/channel/${channel._t_slug}`}
      className={current ? classes.currentItem : null}
      onClick={e => {
        setLocalState({ channelsMenuOpen: false })
        return true
      }}
      selected={!current && isFocused}
    >
      <ListItemText
        classes={{
          root: classes.channelTextRoot,
          primary: classes.channelTextRoot,
        }}
        primary={
          <>
            {channel.name} {unreadCount}
          </>
        }
      />
    </ListItem>
  )
}

export default SortableElement(withStyles(styles)(ChannelMenuItem))
