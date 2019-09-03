import React from 'react'
import { MenuItem, Tooltip, IconButton, ListItemIcon } from '@material-ui/core'

const TogetherCardBaseAction = ({
  title,
  icon,
  onClick,
  menuItem = false,
  loading = false,
}) => {
  if (menuItem) {
    return (
      <MenuItem dense onClick={onClick} disabled={loading}>
        <ListItemIcon style={{ minWidth: 42 }}>{icon}</ListItemIcon>
        {title}
      </MenuItem>
    )
  } else {
    return (
      <Tooltip title={title} placement="top">
        <IconButton onClick={onClick} disabled={loading}>
          {icon}
        </IconButton>
      </Tooltip>
    )
  }
}

export default TogetherCardBaseAction
