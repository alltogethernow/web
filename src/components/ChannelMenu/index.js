import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Shortcuts } from 'react-shortcuts'
import {
  List,
  ListItem,
  ListItemText,
  SwipeableDrawer,
  useMediaQuery,
} from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import { SortableContainer } from 'react-sortable-hoc'
import useReactRouter from 'use-react-router'
import ChannelMenuItem from './ChannelMenuItem'
import NewChannelForm from './NewChannelForm'
import styles from './style'
import { useQuery, useMutation } from 'react-apollo-hooks'
import useLocalState from '../../hooks/use-local-state'
import useCurrentChannel from '../../hooks/use-current-channel'
import { GET_CHANNELS, REORDER_CHANNELS } from '../../queries'

const SortableList = SortableContainer(({ children }) => (
  <List>{children}</List>
))

const ChannelMenu = ({ classes }) => {
  const { history } = useReactRouter()
  const selectedChannel = useCurrentChannel()
  const [focusedChannel, setFocusedChannel] = useState(selectedChannel._t_slug)
  const { data, loading, error } = useQuery(GET_CHANNELS)
  const channels = data.channels ? data.channels : []
  const reorderChannels = useMutation(REORDER_CHANNELS)
  const [localState, setLocalState] = useLocalState()
  const ref = React.createRef()
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))

  // Set focused channel on url change
  useEffect(() => {
    if (selectedChannel._t_slug !== focusedChannel) {
      setFocusedChannel(selectedChannel._t_slug)
      setLocalState({ focusedComponent: 'timeline' })
    }
  }, [selectedChannel._t_slug])

  // Focus channels menu for shortcuts
  useEffect(() => {
    if (ref.current) {
      const el = ref.current._domNode
      if (
        localState.focusedComponent === 'channels' &&
        el !== document.activeElement
      ) {
        el.focus()
      }
    }
  }, [localState.focusedComponent])

  // Shortcut handler
  const handleShortcuts = action => {
    const channelIndex = channels.findIndex(
      channel => channel._t_slug === focusedChannel
    )

    switch (action) {
      case 'NEXT':
        if (channels[channelIndex + 1]) {
          setFocusedChannel(channels[channelIndex + 1]._t_slug)
        }
        break
      case 'PREVIOUS':
        if (channelIndex > 0 && channels[channelIndex - 1]) {
          setFocusedChannel(channels[channelIndex - 1]._t_slug)
        }
        break
      case 'SELECT_CHANNEL':
        setLocalState({ focusedComponent: 'timeline' })
        if (selectedChannel._t_slug !== focusedChannel) {
          history.push(`/channel/${focusedChannel}`)
        }
        break
      default:
        break
    }
  }

  // Just a little helper function for channel sorting
  const moveArray = (items, from, to) => {
    let array = [...items]
    const toMove = array[from]
    array.splice(from, 1)
    array.splice(to, 0, toMove)
    return array
  }

  // Handle sorting channels
  const handleSort = ({ oldIndex, newIndex }) => {
    let uids = channels.map(channel => channel.uid)
    uids = moveArray(uids, oldIndex, newIndex)
    reorderChannels({
      variables: { channels: uids },
      optimisticResponse: {
        __typename: 'Mutation',
        reorderChannels: true,
      },
      update: (proxy, _) => {
        // Read the data from our cache for this query.
        const data = proxy.readQuery({
          query: GET_CHANNELS,
        })
        // Reorder the channels
        data.channels = moveArray(data.channels, oldIndex, newIndex)
        // Write our data back to the cache.
        proxy.writeQuery({ query: GET_CHANNELS, data })
      },
    })
  }

  return (
    <SwipeableDrawer
      open={isSmall ? localState.channelsMenuOpen : true}
      variant={isSmall ? null : 'permanent'}
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
      onClose={e => setLocalState({ channelsMenuOpen: false })}
      onOpen={e => setLocalState({ channelsMenuOpen: true })}
    >
      <div className={classes.toolbarSpacer} />
      <Shortcuts
        name="CHANNEL_LIST"
        handler={handleShortcuts}
        className={classes.shortcuts}
        ref={ref}
      >
        {!!loading && (
          <ListItem>
            <ListItemText>Loading channels...</ListItemText>
          </ListItem>
        )}

        {!!error && (
          <ListItem>
            <ListItemText>Error loading channels 😢</ListItemText>
          </ListItem>
        )}

        {!!channels && (
          <SortableList
            lockAxis="y"
            // TODO: Mousepad touches don't seem to be fully registered
            pressDelay={200}
            onSortEnd={handleSort}
          >
            {channels.map((channel, index) => (
              <ChannelMenuItem
                key={`channel-menu-item-${index}`}
                index={index}
                channel={channel}
                isFocused={focusedChannel === channel._t_slug}
                current={selectedChannel._t_slug === channel._t_slug}
              />
            ))}
          </SortableList>
        )}

        <div style={{ flexGrow: 1 }} />
        <NewChannelForm classes={classes} />
      </Shortcuts>
    </SwipeableDrawer>
  )
}

export default withStyles(styles)(ChannelMenu)
