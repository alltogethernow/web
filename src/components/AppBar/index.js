import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, IconButton, Tooltip } from '@material-ui/core'
import ChannelsIcon from '@material-ui/icons/Menu'
import useLocalState from '../../hooks/use-local-state'
import MicrosubNotifications from '../MicrosubNotifications'
import QuickNote from './QuickNote'
import AppBarTitle from './Title'
import SettingsMenu from './SettingsMenu'
import MarkChannelRead from './MarkChannelRead'
import styles from './style'

const TogetherAppBar = ({ classes }) => {
  const [localState, setLocalState] = useLocalState()
  const toggleChannelsMenu = e =>
    setLocalState({ channelsMenuOpen: !localState.channelsMenuOpen })

  // TODO: Don't really love this solution, feels a bit hacky
  const rootClasses = [classes.root]
  if (localState.channelsMenuOpen) {
    rootClasses.push(classes.rootAboveDrawer)
  }

  return (
    <AppBar position="static" className={rootClasses.join(' ')}>
      <Toolbar>
        <Tooltip title="Channels" placement="bottom">
          <IconButton
            className={classes.menuButton}
            onClick={toggleChannelsMenu}
            color="inherit"
            aria-label="Menu"
          >
            <ChannelsIcon />
          </IconButton>
        </Tooltip>

        <AppBarTitle className={classes.title} />

        <MarkChannelRead classes={classes} />
        <QuickNote />

        <MicrosubNotifications buttonClass={classes.menuAction} />

        <SettingsMenu classes={classes} />
      </Toolbar>
    </AppBar>
  )
}

export default withStyles(styles)(TogetherAppBar)
