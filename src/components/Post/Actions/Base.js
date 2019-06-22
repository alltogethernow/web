import React from 'react'
import { MenuItem, Tooltip, IconButton, ListItemIcon } from '@material-ui/core'

const TogetherCardBaseAction = ({ title, icon, onClick, menuItem = false }) => {
  if (menuItem) {
    return (
      <MenuItem dense onClick={onClick}>
        <ListItemIcon style={{ minWidth: 42 }}>{icon}</ListItemIcon>
        {title}
      </MenuItem>
    )
  } else {
    return (
      <Tooltip title={title} placement="top">
        <IconButton onClick={onClick}>{icon}</IconButton>
      </Tooltip>
    )
  }
}

export default TogetherCardBaseAction
