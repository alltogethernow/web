import React from 'react'
import useReactRouter from 'use-react-router'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { FRAGMENT_POST } from '../../queries'
import { CircularProgress, Typography } from '@mui/material'
import Tabs from './Tabs'
import Timeline from '../Layout/Timeline'

const GET_POSTS = gql`
  query GetMicropubPosts($postType: String, $after: String, $before: String) {
    micropubPosts(postType: $postType, before: $before, after: $after) {
      after
      before
      items {
        ...PostFragment
        refs {
          ...PostFragment
        }
      }
    }
  }
  ${FRAGMENT_POST}
`

const MicropubPosts = (props) => {
  const {
    match: {
      params: { postType },
    },
  } = useReactRouter()

  let query = {
    notifyOnNetworkStatusChange: true,
  }
  if (postType) {
    query.variables = { postType }
  }

  const {
    networkStatus,
    data: { micropubPosts: res },
    fetchMore,
  } = useQuery(GET_POSTS, query)
  const loading = networkStatus < 7

  const loadMore =
    res && res.items && res.items.length
      ? () => {
          fetchMore({
            query: GET_POSTS,
            variables: { postType, after: res.after },
            updateQuery: (previousResult, { fetchMoreResult }) => ({
              micropubPosts: {
                after: fetchMoreResult.micropubPosts.after,
                before: previousResult.micropubPosts.before,
                items: [
                  ...previousResult.micropubPosts.items,
                  ...fetchMoreResult.micropubPosts.items,
                ],
                __typename: previousResult.micropubPosts.__typename,
              },
            }),
          })
        }
      : null

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Tabs />
      <div style={{ flexShrink: 1, overflow: 'hidden' }}>
        {!loading && res && res.items && res.items.length === 0 && (
          <Typography style={{ margin: '40px auto', textAlign: 'center' }}>
            Nothing found...
          </Typography>
        )}
        {res && res.items && (
          <Timeline
            posts={res.items}
            channel={true}
            loading={loading}
            shownActions={[
              'consoleLog',
              'view',
              'micropubDelete',
              'micropubUndelete',
              'micropubUpdate',
            ]}
            loadMore={loadMore}
          />
        )}
        {loading && (
          <CircularProgress style={{ display: 'block', margin: '40px auto' }} />
        )}
      </div>
    </div>
  )
}

export default MicropubPosts
