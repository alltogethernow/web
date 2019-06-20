import { useQuery } from 'react-apollo-hooks'
import { GET_CHANNELS } from '../queries'

const useChannels = () => {
  const res = useQuery(GET_CHANNELS, {
    pollInterval: 60 * 1000,
  })
  const channels = res.data.channels ? res.data.channels : []
  // return { channels: channels.filter(c => c.uid !== 'notifications'), ...res }
  return { channels, ...res }
}

export default useChannels
