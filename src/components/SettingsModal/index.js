import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import withStyles from '@mui/styles/withStyles';
import {
  Dialog,
  DialogContent,
  Slide,
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import useReactRouter from 'use-react-router'
import styles from './style'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const SettingsModal = ({
  classes,
  children,
  singleColumn,
  onClose,
  title,
  contentStyle,
  ...dialogProps
}) => {
  const { history } = useReactRouter()
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
    if (onClose) {
      onClose()
    } else {
      history.push('/')
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      classes={{
        root: classes.dialogRoot,
        paper: classes.dialogPaper,
      }}
      {...dialogProps}
    >
      <AppBar color="secondary" position="sticky">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.title}>
            {title}
          </Typography>
          <IconButton className={classes.popupClose} onClick={handleClose} size="large">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.wrapper}>
        <DialogContent
          className={singleColumn ? classes.singleColumn : classes.twoColumns}
          style={contentStyle}
        >
          {children}
        </DialogContent>
      </div>
    </Dialog>
  );
}

SettingsModal.defaultProps = {
  singleColumn: false,
}

SettingsModal.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  singleColumn: PropTypes.bool.isRequired,
}

export default withRouter(withStyles(styles)(SettingsModal))
