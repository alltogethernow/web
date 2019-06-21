import React from 'react'
import RemoveIcon from '@material-ui/icons/Delete'
import BaseAction from './Base'
import { useSnackbar } from 'notistack'
import { useMutation } from 'react-apollo-hooks'
import { MICROPUB_DELETE } from '../../../queries'

const ActionRemove = ({ url, menuItem }) => {
  const { enqueueSnackbar } = useSnackbar()

  const removePost = useMutation(MICROPUB_DELETE, {
    variables: { url },
    // optimisticResponse: {
    //   __typename: 'Mutation',
    //   removePost: {
    //     _id,
    //     __typename: 'Post',
    //   },
    // },
    update: (proxy, _) => {
      // TODO: Change post status to deleted
      // Read the data from our cache for this query.
      // const data = proxy.readQuery({
      //   query: GET_TIMELINE,
      //   variables: { channel },
      // })
      // Find and remove the post
      // data.timeline.items = data.timeline.items.filter(post => post._id !== _id)
      // Write our data back to the cache.
      // proxy.writeQuery({ query: GET_TIMELINE, variables: { channel }, data })
    },
  })

  const handleRemove = async e => {
    try {
      await removePost()
      enqueueSnackbar('Post deleted', { variant: 'success' })
    } catch (err) {
      console.error('Error deleting post', err)
      enqueueSnackbar('Error deleting post', { variant: 'error' })
    }
  }

  return (
    <BaseAction
      title={'Delete'}
      onClick={handleRemove}
      icon={<RemoveIcon />}
      menuItem={menuItem}
    />
  )
}

export default ActionRemove
