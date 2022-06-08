import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';
import {
  Link,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import styles from './style'

const ChannelSettingsUrl = ({
  classes,
  url,
  name,
  type,
  onRemove,
  onRemoveLabel,
}) => {
  return (
    <ListItem>
      <ListItemText
        className={classes.followingUrl}
        secondary={type ? `(${type})` : null}
      >
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          color="secondary"
        >
          {name}
        </Link>
      </ListItemText>

      {!!onRemove && (
        <ListItemSecondaryAction>
          <IconButton aria-label={onRemoveLabel} onClick={onRemove} size="large">
            <CloseIcon />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
}

ChannelSettingsUrl.propTypes = {
  url: PropTypes.string.isRequired,
  type: PropTypes.string,
  onRemove: PropTypes.func,
  onRemoveLabel: PropTypes.string,
}

export default withStyles(styles)(ChannelSettingsUrl)
