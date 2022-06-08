import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/client'
import useReactRouter from 'use-react-router'
import { useSnackbar } from 'notistack'
import { ListItem, ListItemText, TextField, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { ADD_CHANNEL, GET_CHANNELS } from '../../queries'

const NewChannelForm = ({ classes }) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const { history } = useReactRouter()
  const { enqueueSnackbar } = useSnackbar()

  const [addChannel] = useMutation(ADD_CHANNEL)

  const handleAddChannel = async (e) => {
    e.preventDefault()
    const {
      error,
      data: { addChannel: channel },
    } = await addChannel({
      variables: { name },
      update: (cache, { data: { addChannel: channel } }) => {
        // Read the data from our cache for this query.
        const data = cache.readQuery({
          query: GET_CHANNELS,
        })
        let update = { ...data }
        // Add the new channel to the cache
        update.channels.unshift(channel)
        // Write our data back to the cache.
        cache.writeQuery({ query: GET_CHANNELS, data: update })
      },
    })
    if (error) {
      console.error('[Error adding channel]', error)
      enqueueSnackbar('Error adding channel', { variant: 'error' })
    } else if (channel) {
      enqueueSnackbar(`Added channel ${channel.name}`, { variant: 'success' })
      setName('')
      history.push(`/channel/${channel._t_slug}`)
    }
    setOpen(false)
    return false
  }

  if (!open) {
    return (
      <ListItem onClick={() => setOpen(true)} button>
        <ListItemText
          title="Add New Channel"
          classes={{ primary: classes.addButton }}
          primary={<AddIcon />}
        />
      </ListItem>
    )
  }

  return (
    <form className={classes.addForm} onSubmit={handleAddChannel}>
      <TextField
        fullWidth={true}
        label="New Channel Name"
        required={true}
        autoFocus={true}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button
        style={{ width: '100%' }}
        type="submit"
        variant="text"
        color="secondary"
      >
        Add Channel
      </Button>
    </form>
  )
}

NewChannelForm.defaultProps = {}

NewChannelForm.propTypes = {
  classes: PropTypes.object,
}

export default NewChannelForm
