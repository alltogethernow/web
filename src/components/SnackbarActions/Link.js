import React from 'react'
import { IconButton } from '@mui/material'
import LinkIcon from '@mui/icons-material/Link'

const SnackbarLinkAction = ({ url }) => {
  return (
    <IconButton
      component="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: 'inherit' }}
      size="large">
      <LinkIcon />
    </IconButton>
  );
}

export default SnackbarLinkAction
