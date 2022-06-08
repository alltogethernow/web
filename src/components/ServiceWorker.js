import React, { useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { IconButton } from '@mui/material'
import ReloadIcon from '@mui/icons-material/Refresh'
import * as serviceWorker from '../service-worker'

const ReloadButton = ({ reg }) => {
  const { enqueueSnackbar } = useSnackbar()

  return (
    <IconButton
      style={{ color: 'inherit' }}
      onClick={() => {
        try {
          const res = reg.waiting.postMessage('skipWaiting')
          console.log({ res })
          // window.location.reload(true)
        } catch (err) {
          console.error('[Error skipping service worker waiting]', err)
          enqueueSnackbar('Error loading new version', { variant: 'error' })
        }
      }}
      size="large">
      <ReloadIcon />
    </IconButton>
  );
}

const ServiceWorker = () => {
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    serviceWorker.register({
      onUpdate: reg => {
        enqueueSnackbar('New version available. Click to reload.', {
          action: [<ReloadButton reg={reg} />],
        })
      },
    })
  }, [])

  return null
}

export default ServiceWorker
