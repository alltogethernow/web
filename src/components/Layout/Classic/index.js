import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import useMarkRead from '../../../hooks/use-mark-read'
import useLocalState from '../../../hooks/use-local-state'
import 'intersection-observer'
import { InView } from 'react-intersection-observer'
import { List, Button, Toolbar, AppBar } from '@material-ui/core'
import ReactList from 'react-list'
import Shortcuts from '../Shortcuts'
import Preview from './Preview'
import Post from '../../Post'
import styles from './style'

const ClassicView = ({ classes, posts, channel, loadMore, loading }) => {
  const [selectedPostId, setSelectedPostId] = useState(null)
  const articleRef = useRef()
  const listRef = useRef()
  const markRead = useMarkRead()
  const [_, setLocalState] = useLocalState()

  const infiniteScrollEnabled = channel._t_infiniteScroll
  const postIndex = selectedPostId
    ? posts.findIndex(post => post._id === selectedPostId)
    : -1
  const hasNextPost = posts[postIndex + 1] ? true : false
  const hasPreviousPost = postIndex > 0 && posts[postIndex - 1] ? true : false

  const handlePostSelect = post => {
    const index = posts.findIndex(p => p._id === post._id)
    setSelectedPostId(post._id)
    if (articleRef.current) {
      articleRef.current.scrollTop = 0
    }
    // Mark the post as read
    if (channel._t_autoRead) {
      markRead(channel.uid, post._id)
    }
    // Load the next posts if reading the final post
    if (index === posts.length - 1 && loadMore) {
      loadMore()
    }
    // Scroll the selected post into view
    listRef.current.scrollAround(index)
  }

  const handleNextPost = () => {
    const nextIndex = selectedPostId
      ? posts.findIndex(post => post._id === selectedPostId) + 1
      : 0
    if (nextIndex !== false && posts[nextIndex]) {
      handlePostSelect(posts[nextIndex])
    }
  }

  const handlePreviousPost = () => {
    const previousIndex = selectedPostId
      ? posts.findIndex(post => post._id === selectedPostId) - 1
      : posts.length - 1
    if (previousIndex !== false && previousIndex > -1) {
      handlePostSelect(posts[previousIndex])
    }
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.previewColumn} id="classic-view-previews">
        <Shortcuts
          onNext={handleNextPost}
          onPrevious={handlePreviousPost}
          onSelectPost={() => {
            handlePostSelect({ _id: selectedPostId })
            setLocalState({ focusedComponent: 'post' })
          }}
          onMarkRead={() => {}}
        >
          <List>
            <ReactList
              itemRenderer={(index, key) => {
                const post = posts[index]
                const preview = (
                  <Preview
                    post={post}
                    key={`classic-preview-${key}`}
                    onClick={() => handlePostSelect(post)}
                    highlighted={selectedPostId === post._id}
                  />
                )
                if (
                  index >= posts.length - 2 &&
                  infiniteScrollEnabled &&
                  loadMore
                ) {
                  // Attach intersection observer to only the second last item to trigger load more
                  return (
                    <InView
                      key={`classic-preview-observer-${key}`}
                      rootMargin="1px"
                      triggerOnce={true}
                      onChange={() => loadMore()}
                    >
                      {preview}
                    </InView>
                  )
                }
                // Otherwise just return plain preview
                return preview
              }}
              length={posts.length}
              type="simple"
              minSize={3}
              ref={listRef}
            />
            {!infiniteScrollEnabled && loadMore && (
              <Button
                className={classes.loadMore}
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            )}
          </List>
        </Shortcuts>
      </div>
      {!!selectedPostId && (
        <div ref={articleRef} className={classes.postColumn}>
          <Post
            focus
            post={posts.find(post => post._id === selectedPostId)}
            expandableContent={false}
            style={{
              margin: 0,
              minHeight: 'calc(100% - 48px)',
              maxWidth: 700,
              boxShadow: 'none',
            }}
            shortcutOnNext={handleNextPost}
            scrollElement={articleRef.current}
          />
          <AppBar
            position="sticky"
            color="default"
            style={{ bottom: 0, maxWidth: 700, boxShadow: 'none' }}
          >
            <Toolbar variant="dense">
              <Button onClick={handlePreviousPost} disabled={!hasPreviousPost}>
                Previous
              </Button>
              <Button onClick={handleNextPost} disabled={!hasNextPost}>
                Next
              </Button>
              <Button onClick={() => setSelectedPostId(null)}>Close</Button>
            </Toolbar>
          </AppBar>
        </div>
      )}
    </div>
  )
}

ClassicView.defaultProps = {
  posts: [],
}

ClassicView.propTypes = {
  posts: PropTypes.array.isRequired,
}

export default withStyles(styles)(ClassicView)
