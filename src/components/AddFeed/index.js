import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import useReactRouter from 'use-react-router'
import {
  Card,
  CardActions,
  Fab,
  Button,
  LinearProgress,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import Search from './Search'
import Results from './Results'
import styles from './style'

const AddFeed = ({ classes }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const defaultActions = [
    <Button
      size="small"
      onClick={() => {
        setSearch('')
        handleCancel()
      }}
    >
      Cancel
    </Button>,
  ]
  const [actions, setActions] = useState(defaultActions)
  if (!actions) {
    setActions(defaultActions)
  }

  const {
    match: {
      params: { channelSlug },
    },
  } = useReactRouter()
  const currentChannel = channelSlug ? decodeURIComponent(channelSlug) : null

  const handleCancel = e => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }
    setOpen(false)
    setSearch(false)
    setActions(null)
    return false
  }

  const handleSearch = async query => {
    setSearch(query)
    return false
  }

  if (!currentChannel) {
    return null
  }

  return (
    <div className={classes.container + (open ? ' is-open' : '')}>
      {!!open && (
        <>
          <div className={classes.toolbarSpacer} />
          <Card className={classes.card}>
            {!!loading && <LinearProgress />}
            <Search handleSearch={handleSearch} />
            {!!search && (
              <Results
                query={search}
                setActions={setActions}
                setLoading={setLoading}
                handleCancel={handleCancel}
              />
            )}
            <CardActions className={classes.actions}>{actions}</CardActions>
          </Card>
        </>
      )}

      <Fab
        color="secondary"
        aria-label="Add New Subscription"
        className={classes.fabButton}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>
    </div>
  )
}

AddFeed.defaultProps = {
  currentChannel: false,
}

export default withStyles(styles)(AddFeed)
