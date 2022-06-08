import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';
import { Tooltip, IconButton, CircularProgress } from '@mui/material'
import {
  Notifications as NotificationsIcon,
  NotificationsActive as HasNotificationsIcon,
} from '@mui/icons-material'
import styles from './style'

const NotificationsOpenButton = ({
  name,
  unread,
  classes,
  loading,
  handleOpen,
  buttonClass,
  open,
}) => {
  return (
    <Tooltip title={`${name} (${unread})`} placement="bottom">
      <span className={classes.icon}>
        <IconButton
          className={
            loading ? classes.loadingIcon + ' ' + buttonClass : buttonClass
          }
          aria-label={`Notifications (${unread})`}
          onClick={handleOpen}
          size="large">
          {unread > 0 ? <HasNotificationsIcon /> : <NotificationsIcon />}
        </IconButton>
        {loading && !open && (
          <CircularProgress className={classes.iconSpinner} size={48} />
        )}
      </span>
    </Tooltip>
  );
}

NotificationsOpenButton.propTypes = {
  name: PropTypes.string.isRequired,
  unread: PropTypes.number.isRequired,
  buttonClass: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
}

export default withStyles(styles)(NotificationsOpenButton)
