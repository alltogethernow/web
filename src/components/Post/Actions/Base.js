import React from 'react'
import { MenuItem, Tooltip, IconButton, ListItemIcon } from '@mui/material'

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
        <IconButton onClick={onClick} disabled={loading} size="large">
          {icon}
        </IconButton>
      </Tooltip>
    );
  }
}

export default TogetherCardBaseAction
