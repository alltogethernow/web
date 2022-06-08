import React, { Fragment } from 'react'
import withStyles from '@mui/styles/withStyles';
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LikeIcon from '@mui/icons-material/ThumbUp'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import ReplyIcon from '@mui/icons-material/Reply'
import RepostIcon from '@mui/icons-material/Repeat'
import QuoteIcon from '@mui/icons-material/FormatQuote'
import Post from '../index'
import style from './style'

const TogetherCardReplyContext = ({ type, url, reference, classes }) => {
  let icon = null
  switch (type) {
    case 'reply':
      icon = <ReplyIcon className={classes.icon} />
      break
    case 'like':
      icon = <LikeIcon className={classes.icon} />
      break
    case 'repost':
      icon = <RepostIcon className={classes.icon} />
      break
    case 'bookmark':
      icon = <BookmarkIcon className={classes.icon} />
      break
    case 'quotation':
      icon = <QuoteIcon className={classes.icon} />
      break
    default:
      icon = null
      break
  }
  return (
    <Fragment>
      <CardContent className={classes.replyContext}>
        <Typography component="p" className={classes.replyUrl}>
          {icon}
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </Typography>
      </CardContent>
      {reference && (
        <CardContent>
          <Post
            post={reference}
            shownActions={['view', 'reply', 'repost', 'like', 'consoleLog']}
          />
        </CardContent>
      )}
    </Fragment>
  )
}
export default withStyles(style)(TogetherCardReplyContext)
