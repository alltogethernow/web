import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@apollo/client'
import { GET_BLOCKED, UNBLOCK } from '../../queries'
import withStyles from '@mui/styles/withStyles'
import {
  ListSubheader,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@mui/material'
import ChannelSettingUrl from './ChannelSettingUrl'
import styles from './style'

const ChannelBlocked = ({ classes, channel }) => {
  const {
    data: { blocked },
    loading,
    refetch,
  } = useQuery(GET_BLOCKED, {
    variables: { channel },
  })

  useEffect(() => {
    if (!loading && refetch) {
      refetch()
    }
  }, [])

  const [unblockMutation] = useMutation(UNBLOCK)

  const unblock = (url) =>
    unblockMutation({
      variables: { channel, url },
      optimisticResponse: {
        __typename: 'Mutation',
        mute: true,
      },
      update: (cache, _) => {
        // Read the data from our cache for this query.
        const data = cache.readQuery({
          query: GET_BLOCKED,
          variables: { channel },
        })
        let update = { ...data }
        // Find and remove posts with the given author url
        update.blocked = update.blocked.filter((item) => item.url !== url)
        // Write our data back to the cache.
        cache.writeQuery({
          query: GET_BLOCKED,
          variables: { channel },
          data: update,
        })
      },
    })

  return (
    <>
      <ListSubheader>Blocked</ListSubheader>

      {!!loading && (
        <ListItem>
          <LinearProgress style={{ width: '100%' }} />
        </ListItem>
      )}

      {!!blocked &&
        blocked.map((item) => (
          <ChannelSettingUrl
            {...item}
            key={`list-blocked-${item.url}`}
            onRemove={() => unblock(item.url)}
            onRemoveLabel={`Unblock ${item.url}`}
          />
        ))}

      {!loading && (!blocked || blocked.length === 0) && (
        <ListItem>
          <ListItemText>No blocked urls in this channel</ListItemText>
        </ListItem>
      )}
    </>
  )
}

ChannelBlocked.propTypes = {
  channel: PropTypes.string,
}

export default withStyles(styles)(ChannelBlocked)
