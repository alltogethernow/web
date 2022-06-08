import React, { useState, Fragment } from 'react'
import { useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import withStyles from '@mui/styles/withStyles'
import { Popover, IconButton, Tooltip, LinearProgress } from '@mui/material'
import NoteIcon from '@mui/icons-material/Edit'
import useUser from '../../hooks/use-user'
import MicropubForm from '../MicropubForm'
import styles from './style'
import SnackbarLinkAction from '../SnackbarActions/Link'
import SnackbarUndoAction from '../SnackbarActions/Undo'
import { MICROPUB_CREATE, MICROPUB_DELETE } from '../../queries'

const QuickNote = ({ classes }) => {
  const { user } = useUser()
  const [popoverAnchor, setPopoverAnchor] = useState(null)
  const [loading, setLoading] = useState(false)
  const [defaultProperties, setDefaultProperties] = useState({})
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [createNote] = useMutation(MICROPUB_CREATE)
  const [deleteMicropub] = useMutation(MICROPUB_DELETE)

  const supportsMicropub = user && user.hasMicropub
  if (!supportsMicropub) {
    return null
  }

  const handleSubmit = async (mf2) => {
    const originalAnchor = popoverAnchor
    const properties = mf2.properties
    setLoading(true)
    try {
      const {
        data: { micropubCreate: postUrl },
      } = await createNote({
        variables: {
          json: JSON.stringify(mf2),
        },
      })
      setLoading(false)
      enqueueSnackbar('Posted note', {
        variant: 'success',
        action: (key) => [
          <SnackbarLinkAction url={postUrl} />,
          <SnackbarUndoAction
            onClick={async (e) => {
              closeSnackbar(key)
              await deleteMicropub({ variables: { url: postUrl } })
              enqueueSnackbar('Deleted post', { variant: 'success' })
              setDefaultProperties(properties)
              setPopoverAnchor(originalAnchor)
            }}
          />,
        ],
      })
    } catch (err) {
      setLoading(false)
      console.error('Error posting note', err)
      enqueueSnackbar('Error posting note', { variant: 'error' })
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
      <Tooltip title="New post" placement="bottom">
        <IconButton
          aria-label="New post"
          onClick={(e) => setPopoverAnchor(e.target)}
          className={classes.menuAction}
          size="large"
        >
          <NoteIcon />
        </IconButton>
      </Tooltip>
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
            properties={defaultProperties}
            onSubmit={handleSubmit}
            onClose={() => setPopoverAnchor(null)}
          />
        </div>
        {loading && <LinearProgress />}
      </Popover>
    </Fragment>
  )
}

export default withStyles(styles)(QuickNote)
