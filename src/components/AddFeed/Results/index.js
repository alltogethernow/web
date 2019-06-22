import React, { useState, Fragment } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { withStyles } from '@material-ui/core/styles'
import {
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@material-ui/core'
import Preview from '../Preview'
import { SEARCH } from '../../../queries'
import styles from '../style'

const Results = ({ classes, query, setActions, setLoading, handleClose }) => {
  const [preview, setPreview] = useState(null)
  const {
    loading,
    data: { search: results },
    error,
  } = useQuery(SEARCH, { variables: { query } })

  setLoading(loading ? 'Finding feeds' : false)
  if (loading) {
    return null
  }

  if (error || results.length === 0) {
    return (
      <ListItem>
        <ListItemText primary="No results" secondary="Please try again" />
      </ListItem>
    )
  }

  return (
    <List className={classes.cardInner}>
      {results.map((result, i) => (
        <Fragment key={`search-result-${i}`}>
          <ListItem
            button
            dense
            component="li"
            onClick={() => {
              setActions(null)
              setPreview(preview === result.url ? null : result.url)
            }}
            className={
              classes.result + (preview === result.url ? ' is-selected' : '')
            }
          >
            <ListItemAvatar>
              <Avatar alt="" src={result.photo}>
                {result.photo
                  ? null
                  : result.url
                      .replace('https://', '')
                      .replace('http://', '')
                      .replace('www.', '')[0]}
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              classes={{
                primary: classes.resultText,
                secondary: classes.resultText,
              }}
              primary={result.name || result.url}
              secondary={result.url}
            />
          </ListItem>
          {preview === result.url && (
            <Preview
              url={result.url}
              setActions={setActions}
              setLoading={setLoading}
              handleClose={e => {
                setPreview(null)
                handleClose()
              }}
            />
          )}
        </Fragment>
      ))}
    </List>
  )
}

export default withStyles(styles)(Results)
