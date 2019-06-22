import React from 'react'
import { IconButton } from '@material-ui/core'
import LinkIcon from '@material-ui/icons/Link'

const SnackbarLinkAction = ({ url }) => {
  return (
    <IconButton
      component="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: 'inherit' }}
    >
      <LinkIcon />
    </IconButton>
  )
}

export default SnackbarLinkAction
