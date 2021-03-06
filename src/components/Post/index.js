import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Card, CardMedia } from '@material-ui/core'
import Shortcuts from './Shortcuts'
import TogetherCardHeader from './Header'
import TogetherCardContent from './Content'
import TogetherCardPhotos from './Photos'
import TogetherCardLocation from './Location'
import TogetherCardReplyContext from './ReplyContext'
import TogetherCardActions from './Actions'
import PostMeta from './Meta'
import moment from 'moment'
import styles from './style'

const TogetherCard = ({
  post: item,
  expandableContent,
  shownActions,
  hideProperties,
  style,
  classes,
  className,
  scrollElement,
  shortcutOnNext,
  focus,
  channel,
}) => {
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

  const property = (name, El) => {
    let value = item[name]
    if (value && !Array.isArray(value)) {
      value = [value]
    }
    if (value && Array.isArray(value) && !hideProperties.includes(name)) {
      return value.map((value, i) => (
        <El value={value} key={'post-property-' + name + i} />
      ))
    }
    return null
  }

  return (
    <Card className={classes.card + ' ' + className} style={style}>
      {/* <Shortcuts
        post={item}
        scrollElement={scrollElement}
        onNext={shortcutOnNext}
        focus={focus}
      > */}
      {item.featured && <TogetherCardPhotos photos={item.featured} />}
      {(date !== 'unknown' || item.author) && (
        <TogetherCardHeader item={item} />
      )}

      {property('inReplyTo', ({ value: url }) => (
        <TogetherCardReplyContext
          type="reply"
          url={url}
          reference={
            item.refs ? item.refs.find(item => item.url === url) : null
          }
        />
      ))}

      {property('repostOf', ({ value: url }) => (
        <TogetherCardReplyContext
          type="repost"
          url={url}
          reference={
            item.refs ? item.refs.find(item => item.url === url) : null
          }
        />
      ))}

      {property('likeOf', ({ value: url }) => (
        <TogetherCardReplyContext
          type="like"
          url={url}
          reference={
            item.refs ? item.refs.find(item => item.url === url) : null
          }
        />
      ))}

      {property('bookmarkOf', ({ value: url }) => (
        <TogetherCardReplyContext
          type="bookmark"
          url={url}
          reference={
            item.refs ? item.refs.find(item => item.url === url) : null
          }
        />
      ))}

      {property('quotationOf', ({ value: url }) => (
        <TogetherCardReplyContext
          type="quotation"
          url={url}
          reference={
            item.refs ? item.refs.find(item => item.url === url) : null
          }
        />
      ))}

      {property('video', ({ value: video }) =>
        typeof video == 'string' ? (
          <CardMedia
            component="video"
            src={video}
            controls={true}
            className={classes.video}
            width={160 * 3}
            height={90 * 3}
            poster={
              item.photo && item.photo.length === 1 ? item.photo[0] : null
            }
          />
        ) : null
      )}

      {property('audio', ({ value: audio }) =>
        typeof audio == 'string' ? (
          <CardMedia component="audio" src={audio} controls={true} />
        ) : null
      )}

      {/* TODO: This hides the single photo if there is a single video but I am not sure that is correct */}

      {item.photo &&
        !hideProperties.includes('photo') &&
        (!item.video || item.video.length !== 1) && (
          <TogetherCardPhotos photos={item.photo} />
        )}

      {!item['repostOf'] && (
        <TogetherCardContent expandable={expandableContent} post={item} />
      )}

      <PostMeta item={item} />

      {property('checkin', ({ value: location }) => (
        <TogetherCardLocation location={location} author={item.author} />
      ))}
      {property('location', ({ value: location }) => (
        <TogetherCardLocation location={location} author={item.author} />
      ))}

      <TogetherCardActions
        post={item}
        shownActions={shownActions}
        channel={channel}
      />
      {/* </Shortcuts> */}
    </Card>
  )
}

TogetherCard.defaultProps = {
  post: {},
  focus: false,
  hideProperties: [],
  expandableContent: true,
}

TogetherCard.propTypes = {
  post: PropTypes.object.isRequired,
  shownActions: PropTypes.array,
  hideProperties: PropTypes.array.isRequired,
  expandableContent: PropTypes.bool.isRequired,
  focus: PropTypes.bool.isRequired,
  scrollElement: PropTypes.element,
  shortcutOnNext: PropTypes.func,
  channel: PropTypes.string,
}

const TogetherCardMemo = React.memo(props => <TogetherCard {...props} />)

export default withStyles(styles)(TogetherCardMemo)
