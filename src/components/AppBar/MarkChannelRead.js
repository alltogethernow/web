import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import ReadIcon from '@mui/icons-material/DoneAll'
import useCurrentChannel from '../../hooks/use-current-channel'
import useMarkChannelRead from '../../hooks/use-mark-channel-read'

const MarkChannelRead = ({ classes }) => {
  const channel = useCurrentChannel()
  const markChannelRead = useMarkChannelRead()

  if (channel.unread === 0 || !channel.uid) {
    return null
  }

  return (
    <Tooltip title="Mark all as read" placement="bottom">
      <IconButton
        aria-label="Mark all as read"
        onClick={() => markChannelRead(channel.uid)}
        className={classes.menuAction}
        size="large">
        <ReadIcon />
      </IconButton>
    </Tooltip>
  );
}

export default MarkChannelRead
