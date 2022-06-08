import React, { useState } from 'react'
import RestoreIcon from '@mui/icons-material/RestoreFromTrash'
import BaseAction from './Base'
import { useSnackbar } from 'notistack'
import { useMutation } from '@apollo/client'
import { MICROPUB_UNDELETE } from '../../../queries'

const ActionUndelete = ({ url, menuItem }) => {
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const [undelete] = useMutation(MICROPUB_UNDELETE, {
    variables: { url },
  })

  const handleRemove = async (e) => {
    try {
      setLoading(true)
      await undelete()
      enqueueSnackbar('Post restored', { variant: 'success' })
    } catch (err) {
      console.error('Error undeleting post', err)
      enqueueSnackbar('Error undeleting post', { variant: 'error' })
    }
    setLoading(false)
  }

  return (
    <BaseAction
      title={'Undelete'}
      onClick={handleRemove}
      icon={<RestoreIcon />}
      menuItem={menuItem}
      loading={loading}
    />
  )
}

export default ActionUndelete
