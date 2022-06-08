import React, { Fragment, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import ReplyIcon from '@mui/icons-material/Reply'
import { Popover, LinearProgress } from '@mui/material'
import useUser from '../../../hooks/use-user'
import BaseAction from './Base'
import SnackbarLink from '../../SnackbarActions/Link'
import SnackbarUndo from '../../SnackbarActions/Undo'
import MicropubForm from '../../MicropubForm'
import { MICROPUB_CREATE, MICROPUB_DELETE } from '../../../queries'

const ActionReply = ({ url, menuItem }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [popoverAnchor, setPopoverAnchor] = useState(null)
  const [defaultProperties, setDefaultProperties] = useState({
    'in-reply-to': url,
  })

  const [createRepost] = useMutation(MICROPUB_CREATE)
  const [micropubDelete] = useMutation(MICROPUB_DELETE)

  const handleSubmit = async (mf2) => {
    setLoading(true)
    const properties = mf2.properties
    const oldPopoverAnchor = popoverAnchor
    try {
      const {
        data: { micropubCreate: postUrl },
      } = await createRepost({
        variables: {
          json: JSON.stringify(mf2),
        },
      })
      setLoading(false)
      enqueueSnackbar('Posted reply', {
        variant: 'success',
        action: (key) => [
          <SnackbarLink url={postUrl} />,
          <SnackbarUndo
            onClick={async (e) => {
              closeSnackbar(key)
              await micropubDelete({ variables: { url: postUrl } })
              enqueueSnackbar('Deleted reply', { variant: 'success' })
              setDefaultProperties(properties)
              setPopoverAnchor(oldPopoverAnchor)
            }}
          />,
        ],
      })
    } catch (err) {
      setLoading(false)
      console.error('Error posting like', err)
      enqueueSnackbar('Error posting like', { variant: 'error' })
    }
    setPopoverAnchor(null)
  }

  if (
    user &&
    user.settings.noteSyndication.length &&
    !defaultProperties['mp-syndicate-to']
  ) {
    setDefaultProperties({
      ...defaultProperties,
      'mp-syndicate-to': user.settings.noteSyndication,
    })
  }

  return (
    <Fragment>
      <BaseAction
        title="Reply"
        icon={<ReplyIcon />}
        onClick={(e) => setPopoverAnchor(e.target)}
        menuItem={menuItem}
        loading={loading}
      />
      <Popover
        open={!!popoverAnchor}
        anchorEl={popoverAnchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={() => setPopoverAnchor(null)}
        onBackdropClick={() => setPopoverAnchor(null)}
      >
        <div
          style={{
            padding: 10,
          }}
        >
          <MicropubForm
            onSubmit={handleSubmit}
            properties={defaultProperties}
          />
        </div>
        {loading && <LinearProgress />}
      </Popover>
    </Fragment>
  )
}

export default ActionReply
