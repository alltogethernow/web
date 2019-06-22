import React, { useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { IconButton } from '@material-ui/core'
import ReloadIcon from '@material-ui/icons/Refresh'
import * as serviceWorker from '../service-worker'

const ReloadButton = () => {
  return (
    <IconButton
      style={{ color: 'inherit' }}
      onClick={() => window.location.reload(true)}
    >
      <ReloadIcon />
    </IconButton>
  )
}

const ServiceWorker = () => {
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    serviceWorker.register({
      onUpdate: reg => {
        try {
          reg.waiting.postMessage('skipWaiting')
        } catch (err) {
          console.error('Error skipping service worker waiting', err)
        }
        enqueueSnackbar('New version available. Click to reload.', {
          action: [<ReloadButton />],
        })
      },
    })
  }, [])

  return null
}

export default ServiceWorker
