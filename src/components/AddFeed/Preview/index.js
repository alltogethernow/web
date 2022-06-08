import React, { useState } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'
import { useQuery, useMutation } from '@apollo/client'
import useReactRouter from 'use-react-router'
import { Button, ListItem, ListItemText } from '@mui/material'
import Post from '../../Post'
import { PREVIEW, FOLLOW } from '../../../queries'
import styles from '../style'

const Preview = ({ classes, url, setActions, setLoading, handleClose }) => {
  const [hasSetActions, setHasSetActions] = useState(false)

  const {
    match: {
      params: { channelSlug },
    },
  } = useReactRouter()

  const {
    data: { preview: items },
    loading,
  } = useQuery(PREVIEW, { variables: { url } })

  const channel = channelSlug ? decodeURIComponent(channelSlug) : null
  const [follow] = useMutation(FOLLOW, {
    variables: {
      channel,
      url,
    },
  })

  const handleFollow = async () => {
    try {
      await follow()
      handleClose()
      setActions(null)
    } catch (err) {
      console.log('[Error following]', err)
    }
  }

  setLoading(loading ? 'Loading preview' : false)
  if (loading) {
    return null
  }

  if (!hasSetActions && setActions) {
    setHasSetActions(true)
    setActions((actions) => [
      <Button size="small" color="primary" onClick={handleFollow}>
        Follow
      </Button>,
      ...actions,
    ])
  }

  if (!items || !items.length) {
    return (
      <ListItem>
        <ListItemText
          primary="Not found"
          secondary="No preview items were returned"
        />
      </ListItem>
    )
  }

  return (
    <ListItem className={classes.preview}>
      {Array.isArray(items) &&
        items.map((item, i) => (
          <Post
            post={item}
            style={{ boxShadow: 'none' }}
            key={`search-preview-${i}`}
          />
        ))}
    </ListItem>
  )
}

Preview.propTypes = {
  url: PropTypes.string.isRequired,
}

export default withStyles(styles)(Preview)
