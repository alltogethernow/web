import React from 'react'
import withStyles from '@mui/styles/withStyles';
import {
  Tooltip,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material'
import { ClearAll as MarkAllReadIcon } from '@mui/icons-material'
import useMarkChannelRead from '../../hooks/use-mark-channel-read'
import styles from './style'

const NotificationsTitleBar = ({ classes, unread, title }) => {
  const markChannelRead = useMarkChannelRead()

  return (
    <AppBar position="sticky" color="default" style={{ bottom: 0 }}>
      <Toolbar variant="dense">
        <Typography variant="subtitle1" color="inherit" style={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {unread > 0 && (
          <Tooltip title={`Mark all read`} placement="top">
            <IconButton
              aria-label={`Mark all notifications as read`}
              onClick={() => markChannelRead('notifications')}
              size="large">
              <MarkAllReadIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(styles)(NotificationsTitleBar)
