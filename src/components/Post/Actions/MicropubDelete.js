import React, { useState } from 'react'
import RemoveIcon from '@mui/icons-material/Delete'
import BaseAction from './Base'
import { useSnackbar } from 'notistack'
import { useMutation } from '@apollo/client'
import { MICROPUB_DELETE } from '../../../queries'

const ActionDelete = ({ url, menuItem }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)

  const [removePost] = useMutation(MICROPUB_DELETE, {
    variables: { url },
  })

  const handleRemove = async (e) => {
    try {
      setLoading(true)
      await removePost()
      enqueueSnackbar('Post deleted', { variant: 'success' })
    } catch (err) {
      console.error('Error deleting post', err)
      enqueueSnackbar('Error deleting post', { variant: 'error' })
    }
    setLoading(false)
  }

  return (
    <BaseAction
      title={'Delete'}
      onClick={handleRemove}
      icon={<RemoveIcon />}
      menuItem={menuItem}
      loading={loading}
    />
  )
}

export default ActionDelete
