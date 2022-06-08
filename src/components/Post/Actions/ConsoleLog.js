import React from 'react'
import BaseAction from './Base'
import LogIcon from '@mui/icons-material/DeveloperMode'

const ActionConsoleLog = ({ post, menuItem }) => (
  <BaseAction
    onClick={e => console.log(post)}
    title="Log to console"
    icon={<LogIcon />}
    menuItem={menuItem}
  />
)

export default ActionConsoleLog
