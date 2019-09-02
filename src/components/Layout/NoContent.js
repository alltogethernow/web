import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import styles from './style'

const NoContent = ({ classes }) => (
  <div className={classes.noPosts}>
    <Typography variant="h5" component="h2">
      <span role="img" aria-label="">
        🤷‍
      </span>{' '}
      Nothing to show
    </Typography>
    <Typography component="p">
      Maybe you need to subscribe to a site or select a different channel
    </Typography>
  </div>
)

export default withStyles(styles)(NoContent)
