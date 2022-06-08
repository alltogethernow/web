import React from 'react'
import { Typography } from '@mui/material'
import Meta from '../Meta'
import Post from '../Post'

const isUrl = string => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

const Share = () => {
  const parsedUrl = new URL(window.location)
  const title = parsedUrl.searchParams.get('title')
  const text = parsedUrl.searchParams.get('text')
  let url = parsedUrl.searchParams.get('url')

  if (!url && isUrl(title)) {
    url = title
  } else if (!url && isUrl(text)) {
    url = text
  }

  let cardTitle = 'Sharing'
  if (url) {
    cardTitle += ' ' + url
  }

  const post = {
    _id: null,
    _is_read: true,
    url: url,
    name: title,
    content: {
      text: text,
      // html: text,
    },
  }

  return (
    <div style={{ margin: 16 }}>
      <Meta title={cardTitle} />
      <Typography variant="h4" paragraph>
        {cardTitle}
      </Typography>
      <Post
        post={post}
        shownActions={['like', 'reply', 'repost', 'consoleLog']}
      />
    </div>
  )
}

export default Share
