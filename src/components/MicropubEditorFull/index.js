import React, { useState } from 'react'
import withStyles from '@mui/styles/withStyles'
import LinearProgress from '@mui/material/LinearProgress'
import { useMutation } from '@apollo/client'
import useMicropubCreate from '../../hooks/use-micropub-create'
import useMicropubUpdate from '../../hooks/use-micropub-update'
import MicropubForm from '../MicropubForm'
import SnackbarLinkAction from '../SnackbarActions/Link'
import SnackbarUndo from '../SnackbarActions/Undo'
import { useSnackbar } from 'notistack'
import { MICROPUB_DELETE } from '../../queries'
import styles from './style'

const FullMicropubEditor = ({ classes, location: { state } }) => {
  const [loading, setLoading] = useState(false)
  const [properties, setProperties] = useState(
    state && state.properties ? state.properties : {}
  )
  const create = useMicropubCreate()
  const micropubUpdate = useMicropubUpdate()
  const [micropubDelete] = useMutation(MICROPUB_DELETE)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const update = state && !!state.update

  const handleSubmit = async (mf2) => {
    try {
      setLoading(true)

      if (!update) {
        const postUrl = await create(mf2)
        enqueueSnackbar('Successfully posted', {
          variant: 'success',
          action: (key) => [
            <SnackbarLinkAction url={postUrl} />,
            <SnackbarUndo
              onClick={async (e) => {
                const tmpProperties = properties
                closeSnackbar(key)
                await micropubDelete({ variables: { url: postUrl } })
                enqueueSnackbar('Post deleted', { variant: 'success' })
                setProperties(tmpProperties)
              }}
            />,
          ],
        })
        setLoading(false)
        setProperties({})
      } else {
        let update = {}
        for (const key in mf2.properties) {
          if (mf2.properties.hasOwnProperty(key)) {
            const value = mf2.properties[key]
            if (!state.properties.hasOwnProperty(key)) {
              update[key] = value
            } else if (
              typeof value[0] === 'string' &&
              value[0] !== state.properties[key][0]
            ) {
              update[key] = value
            } else if (key === 'content') {
              if (
                state.properties.content[0].html &&
                state.properties.content[0].html.trim() !== value[0].html.trim()
              ) {
                update.content = value
              }
            }
          }
        }
        if (Object.keys(update).length === 0) {
          enqueueSnackbar(`It looks like you haven't changed anything`, {
            variant: 'error',
          })
        } else {
          const updateUrl = await micropubUpdate(state.properties.url[0], {
            replace: update,
          })
          enqueueSnackbar('Post updated', {
            variant: 'success',
            action: (key) => [<SnackbarLinkAction url={updateUrl} />],
          })
        }
        setLoading(false)
      }
    } catch (err) {
      setLoading(false)
      console.error(update ? 'Error updating post' : 'Error creating post', err)
      enqueueSnackbar(update ? 'Error updating post' : 'Error creating post', {
        variant: 'error',
      })
    }
  }

  const shownProperties = ['name', 'content', ...Object.keys(properties)]

  return (
    <div className={classes.wrapper}>
      {loading && <LinearProgress />}
      <div className={classes.container}>
        <MicropubForm
          expanded={true}
          properties={properties}
          shownProperties={shownProperties}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

export default withStyles(styles)(FullMicropubEditor)
