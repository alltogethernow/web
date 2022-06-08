import React from 'react'
import { IconButton } from '@mui/material'
import UndoIcon from '@mui/icons-material/Replay'

const SnackbarLinkAction = ({ onClick }) => {
  return (
    <IconButton style={{ color: 'inherit' }} onClick={onClick} size="large">
      <UndoIcon />
    </IconButton>
  );
}

export default SnackbarLinkAction
