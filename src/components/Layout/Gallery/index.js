import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import useComponentSize from '@rehooks/component-size'
import useMarkRead from '../../../hooks/use-mark-read'
import { withStyles } from '@material-ui/core/styles'
import 'intersection-observer'
import { InView } from 'react-intersection-observer'
import {
  GridList,
  GridListTile,
  GridListTileBar,
  Button,
} from '@material-ui/core/'
import ReactList from 'react-list'
import Shortcuts from '../Shortcuts'
import AuthorAvatar from '../../AuthorAvatar'
import GallerySlider from '../../GallerySlider'
import authorToAvatarData from '../../../modules/author-to-avatar-data'
import resizeImage from '../../../modules/get-image-proxy-url'
import styles from './style'

const Gallery = ({ classes, posts, channel, loadMore, loading }) => {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(false)
  const markRead = useMarkRead()
  // Generate the width and height of the items
  const ref = useRef(null)
  const { width } = useComponentSize(ref)
  const columnCount = width ? Math.floor(width / 300) : 3
  const cellHeight = Math.floor(width / columnCount)

  const infiniteScrollEnabled = channel._t_infiniteScroll
  const autoReadEnabled = channel._t_autoRead

  const getMediasFromPosts = posts => {
    const medias = []
    posts.forEach(post => {
      if (
        post.photo &&
        post.video &&
        post.photo.length === 1 &&
        post.video.length === 1
      ) {
        // This is a video with a poster
        medias.push({
          postId: post._id,
          video: post.video[0],
          poster: post.photo[0],
        })
      } else {
        if (post.photo) {
          if (typeof post.photo === 'string') {
            post.photo = [post.photo]
          }
          post.photo.forEach(photo =>
            medias.push({
              postId: post._id,
              photo,
            })
          )
        }

        if (post.featured) {
          if (typeof post.featured === 'string') {
            post.featured = [post.featured]
          }
          post.featured.forEach(featured =>
            medias.push({
              postId: post._id,
              photo: featured,
            })
          )
        }

        if (post.video) {
          if (typeof post.video === 'string') {
            post.video = [post.video]
          }
          post.video.forEach(video => medias.push({ postId: post._id, video }))
        }
      }
    })
    return medias
  }
  const medias = getMediasFromPosts(posts)

  const handleIntersection = (inView, entry) => {
    if (!entry || !entry.intersectionRatio) {
      return null
    }

    const target = entry.target
    const itemId = target.dataset.id
    const itemIsRead = target.dataset.isread === 'true'

    if (autoReadEnabled && !itemIsRead) {
      markRead(channel.uid, itemId)
    }

    const isSecondLastItem = itemId === posts[posts.length - 2]._id

    if (infiniteScrollEnabled && isSecondLastItem) {
      if (loadMore) {
        loadMore()
        return null
      }
      return true
    }

    return null
  }

  const handleGallerySliderChange = media => {
    const post = posts.find(post => post._id === media.postId)
    const autoReadEnabled = true

    if (autoReadEnabled) {
      if (!post._is_read) {
        markRead(channel.uid, post._id)
      }
    }
  }

  const renderRow = (rowIndex, key) => {
    const startIndex = rowIndex * columnCount
    return (
      <GridList
        key={key}
        spacing={0}
        cols={columnCount}
        cellHeight={cellHeight}
        className="layoutScrollTop"
      >
        {medias
          .slice(startIndex, startIndex + columnCount)
          .map((media, rowItemIndex) => {
            const index = startIndex + rowItemIndex
            const post = posts.find(post => post._id === media.postId)
            const avatarData = authorToAvatarData(post.author)

            return (
              <GridListTile
                key={'gallery-item-' + post._id + index}
                cols={1}
                onClick={e => {
                  if (e && e.preventDefault) {
                    e.preventDefault()
                  }
                  setSelectedMediaIndex(index)
                  if (!post._is_read) {
                    markRead(channel.uid, post._id)
                  }
                }}
                style={{ height: cellHeight, width: 100 / columnCount + '%' }}
              >
                {media.photo && (
                  <img
                    src={resizeImage(media.photo, {
                      w: 300,
                      h: 300,
                      t: 'square',
                    })}
                    alt=""
                  />
                )}
                {media.video && (
                  <video
                    className={classes.video}
                    src={media.video}
                    poster={media.poster}
                    controls
                    loop
                  />
                )}
                <GridListTileBar
                  title={post.name || (post.content && post.content.text) || ''}
                  subtitle={avatarData.alt}
                  actionIcon={
                    <InView
                      rootMargin="0px"
                      threshold={0}
                      onChange={handleIntersection}
                      data-id={post._id}
                      data-isread={post._is_read}
                    >
                      <div style={{ marginRight: 14 }}>
                        <AuthorAvatar author={post.author} />
                      </div>
                    </InView>
                  }
                />
              </GridListTile>
            )
          })}
      </GridList>
    )
  }

  return (
    <Shortcuts
      onNext={() => {
        if (selectedMediaIndex === false) {
          setSelectedMediaIndex(0)
        } else {
          setSelectedMediaIndex(selectedMediaIndex + 1)
        }
      }}
      onPrevious={() => {
        if (selectedMediaIndex > 0) {
          setSelectedMediaIndex(selectedMediaIndex - 1)
        }
      }}
      onMarkRead={() => {}}
      className={classes.galleryWrapper}
    >
      <div ref={ref}>
        <ReactList
          itemRenderer={renderRow}
          length={Math.ceil(medias.length / columnCount)}
          type="simple"
          minSize={3}
        />
      </div>

      {!infiniteScrollEnabled && loadMore && (
        <Button
          className={classes.loadMore}
          onClick={loadMore}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load More'}
        </Button>
      )}

      <GallerySlider
        open={selectedMediaIndex !== false}
        posts={posts}
        medias={medias}
        startIndex={selectedMediaIndex === false ? 0 : selectedMediaIndex}
        onChange={handleGallerySliderChange}
        onClose={() => setSelectedMediaIndex(false)}
        onLastPhoto={() => {
          if (infiniteScrollEnabled) {
            loadMore()
          }
        }}
      />
    </Shortcuts>
  )
}

Gallery.defaultProps = {
  posts: [],
}

Gallery.propTypes = {
  posts: PropTypes.array.isRequired,
}

export default withStyles(styles)(Gallery)
