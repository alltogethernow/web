import React from 'react'
import BaseAction from './Base'
import BlockIcon from '@mui/icons-material/Block'
import { useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { BLOCK, GET_TIMELINE } from '../../../queries'

const ActionBlock = ({ url, channel, menuItem }) => {
  const { enqueueSnackbar } = useSnackbar()

  const [block] = useMutation(BLOCK, {
    variables: { channel, url },
    optimisticResponse: {
      __typename: 'Mutation',
      block: true,
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

  const handleBlock = async (e) => {
    try {
      await block()
      enqueueSnackbar('User blocked', { variant: 'success' })
    } catch (err) {
      console.error('Error blocking user', err)
      enqueueSnackbar('Error blocking user', { variant: 'error' })
    }
  }

  return (
    <BaseAction
      title={'Block user'}
      onClick={handleBlock}
      icon={<BlockIcon />}
      menuItem={menuItem}
    />
  )
}

export default ActionBlock
