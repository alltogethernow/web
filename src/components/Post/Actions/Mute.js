import React from 'react'
import MuteIcon from '@mui/icons-material/VolumeOff'
import BaseAction from './Base'
import { useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { MUTE, GET_TIMELINE } from '../../../queries'

const ActionMute = ({ url, channel, menuItem }) => {
  const { enqueueSnackbar } = useSnackbar()

  const [mute] = useMutation(MUTE, {
    variables: { channel, url },
    optimisticResponse: {
      __typename: 'Mutation',
      mute: true,
    },
    update: (cache, _) => {
      // Read the data from our cache for this query.
      const data = cache.readQuery({
        query: GET_TIMELINE,
        variables: { channel },
      })
      const update = { ...data }
      // Find and remove posts with the given author url
      update.timeline.items = update.timeline.items.filter(
        (post) => post.author.url !== url
      )
      // Write our data back to the cache.
      cache.writeQuery({
        query: GET_TIMELINE,
        variables: { channel },
        data: update,
      })
    },
  })

  const handleMute = async (e) => {
    try {
      await mute()
      enqueueSnackbar('User muted', { variant: 'success' })
    } catch (err) {
      console.error('Error muting user', err)
      enqueueSnackbar('Error muting user', { variant: 'error' })
    }
  }

  return (
    <BaseAction
      title={'Mute user'}
      onClick={handleMute}
      icon={<MuteIcon />}
      menuItem={menuItem}
    />
  )
}

export default ActionMute
