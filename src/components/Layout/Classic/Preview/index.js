import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';
import { ListItem, ListItemText, ListItemAvatar } from '@mui/material'
import AuthorAvatar from '../../../AuthorAvatar'
import moment from 'moment'
import styles from './style'

const ClassicPreview = ({ classes, post, onClick, highlighted }) => {
  const getPreviewText = (maxLength = 80) => {
    const item = post
    let text = ''

    if (item.name) {
      text = item.name
    } else if (item.summary) {
      text = item.summary
    } else if (item.content) {
      const contentObject = item.content
      if (contentObject.value) {
        text = contentObject.value
      } else if (contentObject.html) {
        text = contentObject.html.replace(/<\/?[^>]+(>|$)/g, '')
      }
    }

    if (text.length > maxLength) {
      text = text.substring(0, maxLength)
      text += '…'
    }

    return text
  }

  // Parse published date
  let date = 'unknown'
  if (post.published) {
    date = moment(post.published).fromNow()
  }

  let classNames = [classes.item]

  if (post._is_read) {
    classNames.push(classes.read)
  }
  if (highlighted) {
    classNames.push(classes.highlighted)
  }

  return (
    <ListItem
      dense
      button
      onClick={onClick}
      className={classNames.join(' ')}
      data-id={post._id}
      data-isread={post._is_read}
    >
      <ListItemAvatar>
        <AuthorAvatar author={post.author} />
      </ListItemAvatar>
      <ListItemText
        primary={getPreviewText()}
        secondary={date}
        className={classes.text}
      />
    </ListItem>
  )
}

ClassicPreview.defaultProps = {
  post: {},
  highlighted: false,
  onClick: () => {},
}

ClassicPreview.propTypes = {
  post: PropTypes.object.isRequired,
  highlighted: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
}

export default withStyles(styles)(ClassicPreview)
