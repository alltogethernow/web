import React from 'react'
import RemoveIcon from '@mui/icons-material/Delete'
import BaseAction from './Base'
import { useSnackbar } from 'notistack'
import { useMutation } from '@apollo/client'
import { REMOVE_POST, GET_TIMELINE } from '../../../queries'

const ActionRemove = ({ _id, channel, menuItem }) => {
  const { enqueueSnackbar } = useSnackbar()

  const [removePost] = useMutation(REMOVE_POST, {
    variables: { channel, post: _id },
    optimisticResponse: {
      __typename: 'Mutation',
      removePost: {
        _id,
        __typename: 'Post',
      },
    },
    update: (cache, _) => {
      // Read the data from our cache for this query.
      const data = cache.readQuery({
        query: GET_TIMELINE,
        variables: { channel },
      })
      const update = { ...data }
      // Find and remove the post
      update.timeline.items = update.timeline.items.filter(
        (post) => post._id !== _id
      )
      // Write our data back to the cache.
      cache.writeQuery({
        query: GET_TIMELINE,
        variables: { channel },
        data: update,
      })
    },
  })

  const handleRemove = async (e) => {
    try {
      await removePost()
      enqueueSnackbar('Post removed', { variant: 'success' })
    } catch (err) {
      console.error('Error removing post', err)
      enqueueSnackbar('Error removing post', { variant: 'error' })
    }
  }

  return (
    <BaseAction
      title={'Remove from channel'}
      onClick={handleRemove}
      icon={<RemoveIcon />}
      menuItem={menuItem}
    />
  )
}

export default ActionRemove
