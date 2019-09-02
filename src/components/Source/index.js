import React from 'react'
import useReactRouter from 'use-react-router'
import { CircularProgress } from '@material-ui/core'
import useCurrentChannel from '../../hooks/use-current-channel'
import SettingsModal from '../SettingsModal'
import Timeline from '../Layout/Content'
import useTimeline from '../../hooks/use-timeline'
import useLocalState from '../../hooks/use-local-state'
import theme from '../Theme/style'

const Source = ({
  match: {
    params: { source },
  },
}) => {
  const [localState] = useLocalState()
  const muiTheme = theme(localState.theme)
  const { history } = useReactRouter()
  const channel = useCurrentChannel()
  const { data, fetchMore, networkStatus, loading } = useTimeline({
    source,
    channel: channel.uid,
  })

  const handleClose = () => {
    if (history) {
      history.push('/channel/' + channel._t_slug)
    }
  }

  let title = `${loading ? 'Loading' : 'Loaded'} Source`
  if (data.timeline && data.timeline.source && data.timeline.source.name) {
    title = data.timeline.source.name
  }

  return (
    <SettingsModal
      singleColumn
      title={title}
      onClose={handleClose}
      contentStyle={{
        padding: 0,
        position: 'relative',
        background: muiTheme.palette.background.default,
      }}
    >
      {loading ? (
        <CircularProgress style={{ display: 'block', margin: '20px auto' }} />
      ) : (
        <Timeline
          data={data}
          fetchMore={data.after ? fetchMore : null}
          networkStatus={networkStatus}
          channel={channel}
        />
      )}
    </SettingsModal>
  )
}

export default Source
