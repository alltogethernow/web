import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import useReactRouter from 'use-react-router'
import { useSnackbar } from 'notistack'
import { useMutation } from '@apollo/client'
import { GET_CHANNELS, UPDATE_CHANNEL, REMOVE_CHANNEL } from '../../queries'
import withStyles from '@mui/styles/withStyles'
import {
  Switch,
  TextField,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemSecondaryAction,
  Select,
  MenuItem,
} from '@mui/material'
import useCurrentChannel from '../../hooks/use-current-channel'
import SettingsModal from '../SettingsModal'
import Following from './Following'
import Blocked from './Blocked'
import Muted from './Muted'
import layouts from '../../modules/layouts'
import styles from './style'

const ChannelSettings = ({ classes }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { history } = useReactRouter()
  const channel = useCurrentChannel()

  const [updateChannel] = useMutation(UPDATE_CHANNEL)
  const [removeChannel] = useMutation(REMOVE_CHANNEL, {
    variables: { channel: channel.uid },
    update: (cache, _) => {
      const data = cache.readQuery({
        query: GET_CHANNELS,
      })
      const update = { ...data }
      // Update our channel in the channels array
      update.channels = update.channels.filter((c) => c.uid !== channel.uid)
      // Write our data back to the cache.
      cache.writeQuery({ query: GET_CHANNELS, data: update })
    },
  })

  const handleClose = () => {
    if (history) {
      history.push('/channel/' + channel._t_slug)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this channel?')) {
      const { error } = await removeChannel()
      if (error) {
        console.error('[Error deleting channel]', error)
        enqueueSnackbar('Error deleting channel', { variant: 'error' })
      } else {
        enqueueSnackbar('Channel deleted', { variant: 'success' })
        history.push('/')
      }
    }
  }

  const handleUpdate = (key, value) => {
    const optimisticChannel = Object.assign({}, channel, { [key]: value })
    updateChannel({
      variables: Object.assign({}, channel, {
        [key]: value,
      }),
      optimisticResponse: {
        __typename: 'Mutation',
        updateChannel: {
          ...optimisticChannel,
          __typename: 'Channel',
        },
      },
      update: (cache, _) => {
        // Read the data from our cache for this query.
        const data = cache.readQuery({
          query: GET_CHANNELS,
        })
        const update = { ...data }
        // Update our channel in the channels array
        update.channels = update.channels.map((c) =>
          c.uid === channel.uid ? optimisticChannel : c
        )
        // Write our data back to the cache.
        cache.writeQuery({ query: GET_CHANNELS, data: update })
      },
    })
  }

  return (
    <SettingsModal
      singleColumn
      title={`${channel.name} Settings`}
      onClose={handleClose}
    >
      <List className={classes.list}>
        <ListSubheader>Channel Options</ListSubheader>
        {!channel.uid ? (
          <ListItem>
            <LinearProgress style={{ width: '100%' }} />
          </ListItem>
        ) : (
          <>
            <ListItem>
              <ListItemText>Name</ListItemText>
              <TextField
                value={channel.name}
                onChange={(e) => handleUpdate('name', e.target.value)}
                margin="none"
                type="text"
              />
            </ListItem>

            <ListItem>
              <ListItemText>Layout</ListItemText>
              <Select
                value={channel._t_layout}
                onChange={(e) => handleUpdate('_t_layout', e.target.value)}
                margin="none"
              >
                {layouts.map((layout) => (
                  <MenuItem
                    key={`setting-layout-${layout.id}`}
                    value={layout.id}
                  >
                    {layout.name}
                  </MenuItem>
                ))}
              </Select>
            </ListItem>

            <ListItem
              button
              onClick={(e) =>
                handleUpdate('_t_infiniteScroll', !channel._t_infiniteScroll)
              }
            >
              <ListItemText>Infinite Scroll</ListItemText>
              <ListItemSecondaryAction>
                <Switch
                  checked={!!channel._t_infiniteScroll}
                  value="infiniteScrollChecked"
                  onChange={(e) =>
                    handleUpdate(
                      '_t_infiniteScroll',
                      !channel._t_infiniteScroll
                    )
                  }
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem
              button
              onClick={(e) =>
                handleUpdate('_t_autoRead', !!!channel._t_autoRead)
              }
            >
              <ListItemText>Auto Mark as Read</ListItemText>
              <ListItemSecondaryAction>
                <Switch
                  checked={!!channel._t_autoRead}
                  value="autoReadChecked"
                  onChange={(e) =>
                    handleUpdate('_t_autoRead', !!!channel._t_autoRead)
                  }
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem
              button
              onClick={(e) =>
                handleUpdate('_t_unreadOnly', !!!channel._t_unreadOnly)
              }
            >
              <ListItemText>Only Show Unread Items</ListItemText>
              <ListItemSecondaryAction>
                <Switch
                  checked={!!channel._t_unreadOnly}
                  value="unreadOnlyChecked"
                  onChange={(e) =>
                    handleUpdate('_t_unreadOnly', !!!channel._t_unreadOnly)
                  }
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemText>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={handleDelete}
                  className={classes.delete}
                >
                  Delete Channel
                </Button>
              </ListItemText>
            </ListItem>
          </>
        )}
        <Following channel={channel.uid} />
        <Blocked channel={channel.uid} />
        <Muted channel={channel.uid} />
      </List>
    </SettingsModal>
  )
}

ChannelSettings.defaultProps = {
  channels: [],
}

ChannelSettings.propTypes = {
  channels: PropTypes.array.isRequired,
}

export default withStyles(styles)(ChannelSettings)
