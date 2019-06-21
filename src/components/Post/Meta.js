import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { CardContent, Chip, Tooltip } from '@material-ui/core'
import CategoryIcon from '@material-ui/icons/Label'
import StatusIcon from '@material-ui/icons/Public'
import VisibilityIcon from '@material-ui/icons/Visibility'

const metaProperties = ['postStatus', 'visibility', 'category']

const styles = theme => ({
  chip: {
    marginRight: theme.spacing(2),
  },
})

function stringToColor(string) {
  if (!string) {
    return '#000'
  }
  let hash = 0
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for (let x = 0; x < 3; x++) {
    const value = (hash >> (x * 8)) & 0xff
    color += ('00' + value.toString(16)).substr(-2)
  }
  return color
}

const PostMeta = ({ item = {}, classes }) => {
  if (!metaProperties.find(prop => !!item[prop])) {
    return null
  }
  return (
    <CardContent>
      {!!item.category &&
        item.category.map((cat, i) => {
          return (
            <Tooltip title="Category">
              <Chip
                key={`post-${item._id}-category-${i}`}
                className={classes.chip}
                label={cat}
                icon={<CategoryIcon />}
                style={{ background: stringToColor(cat) }}
              />
            </Tooltip>
          )
        })}
      {!!item.postStatus && (
        <Tooltip title="Post Status">
          <Chip
            className={classes.chip}
            label={item.postStatus}
            icon={<StatusIcon />}
          />
        </Tooltip>
      )}
      {!!item.visibility && (
        <Tooltip title="Visibility">
          <Chip
            className={classes.chip}
            label={item.visibility}
            icon={<VisibilityIcon />}
          />
        </Tooltip>
      )}
    </CardContent>
  )
}

export default withStyles(styles)(PostMeta)
