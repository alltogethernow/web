import React from 'react'
import { LinearProgress } from '@material-ui/core'
import { Redirect } from 'react-router-dom'
import useChannels from '../../hooks/use-channels'

const Home = () => {
  const { channels, loading } = useChannels()
  const firstChannel = channels.find(c => c.uid !== 'notifications')

  return (
    <div style={{ height: '100%' }}>
      {!!loading && <LinearProgress />}
      {!!firstChannel && <Redirect to={`/channel/${firstChannel._t_slug}`} />}
    </div>
  )
}

export default Home
