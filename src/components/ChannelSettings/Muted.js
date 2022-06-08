import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@apollo/client'
import { GET_MUTED, UNMUTE } from '../../queries'
import withStyles from '@mui/styles/withStyles'
import {
  ListSubheader,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@mui/material'
import ChannelSettingUrl from './ChannelSettingUrl'
import styles from './style'

const ChannelMuted = ({ classes, channel }) => {
  const {
    data: { muted },
    loading,
    refetch,
  } = useQuery(GET_MUTED, {
    variables: { channel },
  })

  useEffect(() => {
    if (!loading && refetch) {
      refetch()
    }
  }, [])

  const [unmuteMutation] = useMutation(UNMUTE)

  const unmute = (url) =>
    unmuteMutation({
      variables: { channel, url },
      optimisticResponse: {
        __typename: 'Mutation',
        mute: true,
      },
      update: (cache, _) => {
        // Read the data from our cache for this query.
        const data = cache.readQuery({
          query: GET_MUTED,
          variables: { channel },
        })
        const update = { ...data }
        // Find and remove posts with the given author url
        update.muted = update.muted.filter((item) => item.url !== url)
        // Write our data back to the cache.
        cache.writeQuery({
          query: GET_MUTED,
          variables: { channel },
          data: update,
        })
      },
    })

  return (
    <>
      <ListSubheader>Muted</ListSubheader>

      {!!loading && (
        <ListItem>
          <LinearProgress style={{ width: '100%' }} />
        </ListItem>
      )}

      {!!muted &&
        muted.map((item) => (
          <ChannelSettingUrl
            {...item}
            key={`list-muted-${item.url}`}
            onRemove={() => unmute(item.url)}
            onRemoveLabel={`Unmute ${item.url}`}
          />
        ))}

      {!loading && (!muted || muted.length === 0) && (
        <ListItem>
          <ListItemText>No muted urls in this channel</ListItemText>
        </ListItem>
      )}
    </>
  )
}

ChannelMuted.propTypes = {
  channel: PropTypes.string,
}

export default withStyles(styles)(ChannelMuted)
