import React, { Fragment, useState } from 'react'
import withStyles from '@mui/styles/withStyles';
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import ExpandIcon from '@mui/icons-material/ExpandMore'
import CollapseIcon from '@mui/icons-material/ExpandLess'
import parse from 'html-react-parser'
import TruncatedContentLoader from './TruncatedContentLoader'
import style from './style'

const TogetherCardContent = ({ classes, post, expandable = false }) => {
  const [expanded, setExpanded] = useState(false)

  const isExpandable = () => {
    let contentLength = 0
    if (post.content && post.content.text) {
      contentLength = post.content.text.length
    } else if (post.content && post.content.html) {
      contentLength = post.content.html.length
    }
    if (contentLength > 300) {
      return expandable
    }
    return false
  }

  const getContent = () => {
    if (post.summary && !post.content) {
      return {
        component: 'p',
        content: post.summary,
      }
    }

    if (post.content && post.content.html) {
      return {
        component: 'div',
        content: post.content.html,
      }
    }

    if (post.content && post.content.text) {
      return {
        component: 'p',
        content: post.content.text,
      }
    }

    return null
  }

  const content = getContent()

  if (content && content.component === 'div' && content.content) {
    content.content = parse(content.content, {
      replace: (domNode) => {
        // Open links in new tabs always
        if (domNode.name === 'a') {
          domNode.attribs.target = '_blank'
          domNode.attribs.rel = 'noopener noreferrer'
        }
      },
    })
  }

  return (
    <CardContent>
      {!!post.name && (
        <Typography
          variant="h5"
          component="h2"
          dangerouslySetInnerHTML={{ __html: post.name }}
          gutterBottom
        />
      )}

      {!!content && (
        <Collapse
          in={!isExpandable() || expanded}
          collapsedSize={isExpandable() ? '5em' : null}
        >
          <Typography className={classes.content} component={content.component}>
            {content.content}
          </Typography>
          <TruncatedContentLoader post={post} />
        </Collapse>
      )}

      {isExpandable() && (
        <Fragment>
          <Divider className={classes.divider} />
          <Button
            size="small"
            variant="text"
            fullWidth={true}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Collapse' : 'Show Content'}
            {expanded ? <CollapseIcon /> : <ExpandIcon />}
          </Button>
        </Fragment>
      )}
    </CardContent>
  );
}
export default withStyles(style)(TogetherCardContent)
