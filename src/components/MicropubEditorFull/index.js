import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useMutation } from 'react-apollo-hooks'
import useMicropubCreate from '../../hooks/use-micropub-create'
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
  const micropubDelete = useMutation(MICROPUB_DELETE)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const handleSubmit = async mf2 => {
    try {
      setLoading(true)
      const postUrl = await create(mf2)
      enqueueSnackbar('Successfully posted', {
        variant: 'success',
        action: key => [
          <SnackbarLinkAction url={postUrl} />,
          <SnackbarUndo
            onClick={async e => {
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
    } catch (err) {
      setLoading(false)
      console.error('Error creating post', err)
      enqueueSnackbar('Error creating post', { type: 'error' })
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
