import React from 'react'
import { useMutation } from 'react-apollo-hooks'
import { useSnackbar } from 'notistack'
import LikeIcon from '@material-ui/icons/ThumbUp'
import useUser from '../../../hooks/use-user'
import BaseAction from './Base'
import SnackbarLinkAction from '../../SnackbarActions/Link'
import SnackbarUndoAction from '../../SnackbarActions/Undo'
import { MICROPUB_CREATE, MICROPUB_DELETE } from '../../../queries'

const ActionLike = ({ url, menuItem }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { user } = useUser()
  let mf2 = {
    type: ['h-entry'],
    properties: {
      'like-of': [url],
    },
  }
  if (user && user.settings.likeSyndication.length) {
    mf2.properties['mp-syndicate-to'] = user.settings.likeSyndication
  }
  const createLike = useMutation(MICROPUB_CREATE, {
    variables: {
      json: JSON.stringify(mf2),
    },
  })
  const micropubDelete = useMutation(MICROPUB_DELETE)

  const onClick = async e => {
    try {
      const {
        data: { micropubCreate: postUrl },
      } = await createLike()
      enqueueSnackbar('Posted Like', {
        variant: 'success',
        action: key => [
          <SnackbarLinkAction url={postUrl} />,
          <SnackbarUndoAction
            onClick={async e => {
              closeSnackbar(key)
              await micropubDelete({ variables: { url: postUrl } })
              enqueueSnackbar('Like deleted', { variant: 'success' })
            }}
          />,
        ],
      })
    } catch (err) {
      console.error('Error posting like', err)
      enqueueSnackbar('Error posting like', { variant: 'error' })
    }
  }

  return (
    <BaseAction
      title="Like"
      icon={<LikeIcon />}
      onClick={onClick}
      menuItem={menuItem}
    />
  )
}

export default ActionLike
