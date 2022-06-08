import React from 'react'
import PropTypes from 'prop-types'
import { CardHeader } from '@mui/material'
import moment from 'moment'
import useReactRouter from 'use-react-router'
import AuthorAvatar from '../../AuthorAvatar'
import useCurrentChannel from '../../../hooks/use-current-channel'
import authorToAvatarData from '../../../modules/author-to-avatar-data'

const TogetherCardHeader = ({ item, shownActions }) => {
  const { history } = useReactRouter()
  const channel = useCurrentChannel()
  // Parse author data
  const avatarData = authorToAvatarData(item.author)

  // Parse published date
  let date = 'unknown'
  if (item.published) {
    date = moment(item.published).fromNow()
  }

  if (!Array.isArray(shownActions)) {
    shownActions = ['consoleLog', 'markRead', 'remove']
    if (item.url) {
      shownActions.push('view')
      shownActions.push('refetch')
    }
    if (item.url && !item['likeOf'] && !item['repostOf']) {
      shownActions.push('like', 'repost', 'reply')
    }
  }

  const authorNameLink = avatarData.href ? (
    <a href={avatarData.href} target="_blank" rel="noopener noreferrer">
      {avatarData.alt}
    </a>
  ) : (
    avatarData.alt
  )

  return (
    <CardHeader
      onClick={e => {
        if (item._source && history && channel) {
          e.preventDefault()
          history.push(`/channel/${channel._t_slug}/${item._source}`)
        }
      }}
      title={authorNameLink}
      subheader={date}
      avatar={<AuthorAvatar author={item.author || '?'} />}
    />
  )
}

TogetherCardHeader.propTypes = {
  item: PropTypes.object.isRequired,
}

export default TogetherCardHeader
