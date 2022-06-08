import React, { Fragment } from 'react'
import { Typography } from '@mui/material'
import useCurrentChannel from '../../hooks/use-current-channel'
import Meta from '../Meta'

const AppBarTitle = ({ className }) => {
  const channel = useCurrentChannel()
  let title = 'Together'
  let metaTitle = ''
  if (channel.name) {
    metaTitle = channel.name
    if (channel.unread) {
      metaTitle += ` (${channel.unread})`
    }
  }
  if (metaTitle) {
    title = metaTitle
  }

  return (
    <Fragment>
      <Meta title={metaTitle} />

      {title === 'Together' && (
        <img
          style={{
            display: 'block',
            height: 40,
            width: 'auto',
            marginRight: 12,
          }}
          src={process.env.PUBLIC_URL + '/icon/icon.svg'}
          alt="Together icon"
        />
      )}

      <Typography
        component="h1"
        variant="h6"
        color="inherit"
        className={className}
      >
        {title}
      </Typography>
    </Fragment>
  )
}

export default AppBarTitle
