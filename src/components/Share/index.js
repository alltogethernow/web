import React from 'react'
import { Typography } from '@material-ui/core'
import Meta from '../Meta'
import Post from '../Post'

const Share = () => {
  const parsedUrl = new URL(window.location)
  const title = parsedUrl.searchParams.get('title')
  const text = parsedUrl.searchParams.get('text')
  const url = parsedUrl.searchParams.get('url')

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
