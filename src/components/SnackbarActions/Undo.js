import React from 'react'
import { IconButton } from '@material-ui/core'
import UndoIcon from '@material-ui/icons/Replay'

const SnackbarLinkAction = ({ onClick }) => {
  return (
    <IconButton style={{ color: 'inherit' }} onClick={onClick}>
      <UndoIcon />
    </IconButton>
  )
}

export default SnackbarLinkAction
