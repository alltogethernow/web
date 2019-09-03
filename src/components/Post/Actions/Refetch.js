import React, { useState } from 'react'
import { useMutation } from 'react-apollo-hooks'
import { useSnackbar } from 'notistack'
import RefetchIcon from '@material-ui/icons/Refresh'
import BaseAction from './Base'
import { REFETCH_POST } from '../../../queries'

const ActionRefetch = ({ url, _id, menuItem, handleClose }) => {
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const refetchPost = useMutation(REFETCH_POST, {
    variables: { post: _id, url },
  })

  const onClick = async e => {
    setLoading(true)
    const {
      data: { refetchPost: update },
      error,
    } = await refetchPost()
    setLoading(false)
    if (error) {
      enqueueSnackbar('Error loading post content', { variant: 'error' })
    } else if (!update || !update.content) {
      enqueueSnackbar('Could not parse post content', { variant: 'warning' })
    }
    handleClose()
  }

  return (
    <BaseAction
      title={'Refetch Full Post' + (loading ? ' (loading...)' : '')}
      onClick={onClick}
      icon={<RefetchIcon />}
      menuItem={menuItem}
      loading={loading}
    />
  )
}

export default ActionRefetch
