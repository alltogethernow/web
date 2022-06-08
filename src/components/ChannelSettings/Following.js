import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@apollo/client'
import { GET_FOLLOWING, UNFOLLOW } from '../../queries'
import withStyles from '@mui/styles/withStyles'
import {
  ListSubheader,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@mui/material'
import ChannelSettingUrl from './ChannelSettingUrl'
import styles from './style'

const ChannelFollowing = ({ classes, channel }) => {
  const {
    data: { following },
    loading,
    refetch,
  } = useQuery(GET_FOLLOWING, {
    variables: { channel },
  })

  useEffect(() => {
    if (!loading && refetch) {
      refetch()
    }
  }, [])

  const [unfollowMutation] = useMutation(UNFOLLOW)

  const unfollow = (url) =>
    unfollowMutation({
      variables: { channel, url },
      optimisticResponse: {
        __typename: 'Mutation',
        mute: true,
      },
      update: (cache, _) => {
        // Read the data from our cache for this query.
        const data = cache.readQuery({
          query: GET_FOLLOWING,
          variables: { channel },
        })
        const update = { ...data }
        // Find and remove posts with the given author url
        update.following = update.following.filter((item) => item.url !== url)
        // Write our data back to the cache.
        cache.writeQuery({
          query: GET_FOLLOWING,
          variables: { channel },
          data: update,
        })
      },
    })

  return (
    <>
      <ListSubheader>Following</ListSubheader>

      {!!loading && (
        <ListItem>
          <LinearProgress style={{ width: '100%' }} />
        </ListItem>
      )}

      {!!following &&
        following.map((item) => (
          <ChannelSettingUrl
            {...item}
            key={`list-following-${item.url}`}
            onRemove={() => unfollow(item.url)}
            onRemoveLabel={`Unfollow ${item.url}`}
          />
        ))}

      {!loading && (!following || following.length === 0) && (
        <ListItem>
          <ListItemText>
            You are not following anything at the moment
          </ListItemText>
        </ListItem>
      )}
    </>
  )
}

ChannelFollowing.propTypes = {
  channel: PropTypes.string,
}

export default withStyles(styles)(ChannelFollowing)
