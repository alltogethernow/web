import React from 'react'
import { useMutation } from 'react-apollo-hooks'
import { useSnackbar } from 'notistack'
import RepostIcon from '@material-ui/icons/Repeat'
import useUser from '../../../hooks/use-user'
import BaseAction from './Base'
import SnackbarLinkAction from '../../SnackbarActions/Link'
import SnackbarUndo from '../../SnackbarActions/Undo'
import { MICROPUB_CREATE, MICROPUB_DELETE } from '../../../queries'

const ActionRepost = ({ url, menuItem }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { user } = useUser()
  let mf2 = {
    type: ['h-entry'],
    properties: {
      'repost-of': [url],
    },
  }
  if (user && user.settings.repostSyndication.length) {
    mf2.properties['mp-syndicate-to'] = user.settings.repostSyndication
  }
  const createRepost = useMutation(MICROPUB_CREATE, {
    variables: {
      json: JSON.stringify(mf2),
    },
  })
  const micropubDelete = useMutation(MICROPUB_DELETE)

  const onClick = async e => {
    try {
      const {
        data: { micropubCreate: postUrl },
      } = await createRepost()
      enqueueSnackbar('Successfully reposted', {
        variant: 'success',
        action: key => [
          <SnackbarLinkAction url={postUrl} />,
          <SnackbarUndo
            onClick={async e => {
              closeSnackbar(key)
              await micropubDelete({ variables: { url: postUrl } })
              enqueueSnackbar('Deleted repost', { variant: 'success' })
            }}
          />,
        ],
      })
    } catch (err) {
      console.error('Error reposting', err)
      enqueueSnackbar('Error reposting', { variant: 'error' })
    }
  }
  return (
    <BaseAction
      title="Repost"
      onClick={onClick}
      icon={<RepostIcon />}
      menuItem={menuItem}
    />
  )
}

export default ActionRepost
